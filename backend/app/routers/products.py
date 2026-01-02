from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product as ProductModel

router = APIRouter()

# Pydantic models
class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str = "USD"
    category: str
    image_url: str
    stock: int
    rating: Optional[float] = None
    review_count: Optional[int] = None

class ProductList(BaseModel):
    products: List[Product]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

class Category(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

# Mock data for development (replace with API calls in production)
mock_products = [
    {
        "id": "1",
        "name": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 99.99,
        "currency": "USD",
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "stock": 50,
        "rating": 4.5,
        "review_count": 128
    },
    {
        "id": "2",
        "name": "Smart Fitness Watch",
        "description": "Track your fitness goals with this advanced smartwatch",
        "price": 199.99,
        "currency": "USD",
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        "stock": 25,
        "rating": 4.3,
        "review_count": 89
    },
    {
        "id": "3",
        "name": "Organic Cotton T-Shirt",
        "description": "Comfortable and eco-friendly cotton t-shirt",
        "price": 29.99,
        "currency": "USD",
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        "stock": 100,
        "rating": 4.7,
        "review_count": 256
    },
    {
        "id": "4",
        "name": "Stainless Steel Water Bottle",
        "description": "Keep your drinks cold for hours with this insulated bottle",
        "price": 24.99,
        "currency": "USD",
        "category": "Home & Garden",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        "stock": 75,
        "rating": 4.6,
        "review_count": 189
    },
    {
        "id": "5",
        "name": "Professional Camera Lens",
        "description": "High-quality camera lens for professional photography",
        "price": 599.99,
        "currency": "USD",
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
        "stock": 15,
        "rating": 4.8,
        "review_count": 67
    },
    {
        "id": "6",
        "name": "Leather Handbag",
        "description": "Elegant leather handbag perfect for everyday use",
        "price": 89.99,
        "currency": "USD",
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "stock": 30,
        "rating": 4.4,
        "review_count": 92
    },
    {
        "id": "7",
        "name": "Canvas Backpack",
        "description": "Durable canvas backpack for travel and daily adventures",
        "price": 45.99,
        "currency": "USD",
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "stock": 40,
        "rating": 4.6,
        "review_count": 156
    },
    {
        "id": "8",
        "name": "Cotton Tote Bag",
        "description": "Eco-friendly cotton tote bag for shopping and beach trips",
        "price": 15.99,
        "currency": "USD",
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "stock": 60,
        "rating": 4.2,
        "review_count": 78
    }
]

mock_categories = [
    {"id": "1", "name": "Electronics", "description": "Electronic devices and accessories"},
    {"id": "2", "name": "Clothing", "description": "Fashion and apparel"},
    {"id": "3", "name": "Home & Garden", "description": "Home improvement and gardening"},
    {"id": "4", "name": "Sports", "description": "Sports equipment and activewear"},
    {"id": "5", "name": "Books", "description": "Books and educational materials"}
]

def _normalize_image_url(raw_url: Optional[str], request: Request) -> Optional[str]:
    """Normalize image URLs to avoid mixed content and host mismatches.
    - If GCS is configured and URL is /uploads/ path, return GCS URL directly
    - Force https for any http URLs not pointing to localhost
    - Rewrite localhost/0.0.0.0/127.0.0.1 to current request host
    - Prefix relative '/uploads' with current host and scheme (if GCS not configured)
    """
    if not raw_url:
        return raw_url

    url = raw_url.strip()
    base = str(request.base_url).rstrip('/')

    # Relative upload path - try to get GCS URL directly if GCS is configured
    if url.startswith('/uploads'):
        import os
        GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "")
        if GCS_BUCKET_NAME:
            # Extract filename from path (e.g., "/uploads/filename.jpg" -> "filename.jpg")
            filename = url.replace('/uploads/', '').lstrip('/')
            if filename:
                try:
                    from google.cloud import storage
                    from datetime import timedelta
                    
                    client = storage.Client()
                    bucket = client.bucket(GCS_BUCKET_NAME)
                    blob = bucket.blob(f"uploads/{filename}")
                    
                    # Check if blob exists
                    if blob.exists():
                        # Try to get public URL first
                        try:
                            blob.reload()
                            if blob.public_url:
                                return blob.public_url
                        except:
                            pass
                        
                        # If not public, generate signed URL
                        signed_url = blob.generate_signed_url(
                            expiration=timedelta(days=365),
                            method='GET'
                        )
                        return signed_url
                except Exception as e:
                    # If GCS lookup fails, fall back to backend URL
                    print(f"⚠️ Could not get GCS URL for {filename}: {e}", flush=True)
        
        # Fallback to backend URL if GCS not configured or lookup failed
        return f"{base}{url}"

    # Localhost variants -> current host
    localhost_prefixes = (
        'http://localhost', 'http://127.0.0.1', 'http://0.0.0.0',
        'https://localhost', 'https://127.0.0.1', 'https://0.0.0.0',
    )
    if url.startswith(localhost_prefixes):
        # keep path/query, replace origin with current base
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            path_and_query = parsed.path or ''
            if parsed.query:
                path_and_query += f"?{parsed.query}"
            return f"{base}{path_and_query}"
        except Exception:
            return base

    # Generic http -> https
    if url.startswith('http://'):
        return 'https://' + url[len('http://'):]

    return url


@router.get("/", response_model=ProductList)
async def get_products(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    sort_by: Optional[str] = Query("name", description="Sort by field"),
    sort_order: Optional[str] = Query("asc", description="Sort order (asc/desc)"),
    db: Session = Depends(get_db)
):
    """Get products with filtering, searching, and pagination"""
    try:
        # Start with base query
        query = db.query(ProductModel)
        
        # Apply category filter
        if category:
            query = query.filter(ProductModel.category.ilike(f"%{category}%"))
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                ProductModel.name.ilike(search_term) | 
                ProductModel.description.ilike(search_term)
            )
        
        # Apply price filters
        if min_price is not None:
            query = query.filter(ProductModel.price >= min_price)
        if max_price is not None:
            query = query.filter(ProductModel.price <= max_price)
        
        # Apply sorting
        if sort_by == "name":
            query = query.order_by(ProductModel.name.asc() if sort_order.lower() == "asc" else ProductModel.name.desc())
        elif sort_by == "price":
            query = query.order_by(ProductModel.price.asc() if sort_order.lower() == "asc" else ProductModel.price.desc())
        elif sort_by == "rating":
            query = query.order_by(ProductModel.rating.asc() if sort_order.lower() == "asc" else ProductModel.rating.desc())
        else:
            query = query.order_by(ProductModel.name.asc())
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        db_products = query.offset(offset).limit(limit).all()
        
        # Convert to Product objects
        products = []
        for db_product in db_products:
            product = Product(
                id=db_product.id,
                name=db_product.name,
                description=db_product.description,
                price=db_product.price,
                currency="USD",
                category=db_product.category,
                image_url=_normalize_image_url(db_product.image_url, request),
                stock=db_product.stock,
                rating=db_product.rating,
                review_count=0  # We can add review count later
            )
            products.append(product)
        
        return ProductList(
            products=products,
            total=total,
            page=page,
            limit=limit,
            has_next=offset + limit < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories", response_model=List[Category])
async def get_categories(db: Session = Depends(get_db)):
    """Get all product categories from database"""
    try:
        # Get unique categories from database
        categories = db.query(ProductModel.category).distinct().all()
        
        # Convert to Category objects
        category_list = []
        for idx, (category_name,) in enumerate(categories, start=1):
            if category_name:  # Only add non-empty categories
                category_list.append(Category(
                    id=str(idx),
                    name=category_name,
                    description=f"Products in {category_name} category"
                ))
        
        # If no categories in database, return mock categories as fallback
        if not category_list:
            category_list = [Category(**c) for c in mock_categories]
        
        return category_list
    except Exception as e:
        print(f"Error in categories: {e}", flush=True)
        import traceback
        traceback.print_exc()
        # Fallback to mock categories on error
        try:
            return [Category(**c) for c in mock_categories]
        except Exception as fallback_error:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/featured", response_model=List[Product])
async def get_featured_products(request: Request, db: Session = Depends(get_db)):
    """Get featured products (highly rated or popular)"""
    try:
        # Get top 3 products by rating
        db_products = db.query(ProductModel).order_by(ProductModel.rating.desc()).limit(3).all()
        
        products = []
        for db_product in db_products:
            product = Product(
                id=db_product.id,
                name=db_product.name,
                description=db_product.description,
                price=db_product.price,
                currency="USD",
                category=db_product.category,
                image_url=_normalize_image_url(db_product.image_url, request),
                stock=db_product.stock,
                rating=db_product.rating,
                review_count=0
            )
            products.append(product)
        
        return products
    except Exception as e:
        print(f"Error in featured products: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str, request: Request, db: Session = Depends(get_db)):
    """Get product by ID"""
    try:
        # Find product by ID in database
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = Product(
            id=db_product.id,
            name=db_product.name,
            description=db_product.description,
            price=db_product.price,
            currency="USD",
            category=db_product.category,
            image_url=_normalize_image_url(db_product.image_url, request),
            stock=db_product.stock,
            rating=db_product.rating,
            review_count=0
        )
        
        return product
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/suggestions")
async def get_search_suggestions(q: str = Query(..., min_length=1)):
    """Get search suggestions based on query"""
    try:
        if len(q) < 2:
            return {"suggestions": []}
        
        q_lower = q.lower()
        suggestions = []
        
        # Get product name suggestions
        for product in mock_products:
            if q_lower in product["name"].lower():
                suggestions.append(product["name"])
        
        # Get category suggestions
        for category in mock_categories:
            if q_lower in category["name"].lower():
                suggestions.append(category["name"])
        
        # Remove duplicates and limit results
        unique_suggestions = list(set(suggestions))[:5]
        
        return {"suggestions": unique_suggestions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
