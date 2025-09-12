from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

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
    }
]

mock_categories = [
    {"id": "1", "name": "Electronics", "description": "Electronic devices and accessories"},
    {"id": "2", "name": "Clothing", "description": "Fashion and apparel"},
    {"id": "3", "name": "Home & Garden", "description": "Home improvement and gardening"},
    {"id": "4", "name": "Sports", "description": "Sports equipment and activewear"},
    {"id": "5", "name": "Books", "description": "Books and educational materials"}
]

@router.get("/", response_model=ProductList)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    sort_by: Optional[str] = Query("name", description="Sort by field"),
    sort_order: Optional[str] = Query("asc", description="Sort order (asc/desc)")
):
    """Get products with filtering, searching, and pagination"""
    try:
        # Filter products
        filtered_products = mock_products.copy()
        
        # Apply category filter
        if category:
            filtered_products = [p for p in filtered_products if p["category"].lower() == category.lower()]
        
        # Apply search filter
        if search:
            search_lower = search.lower()
            filtered_products = [
                p for p in filtered_products 
                if search_lower in p["name"].lower() or search_lower in p["description"].lower()
            ]
        
        # Apply price filters
        if min_price is not None:
            filtered_products = [p for p in filtered_products if p["price"] >= min_price]
        if max_price is not None:
            filtered_products = [p for p in filtered_products if p["price"] <= max_price]
        
        # Apply sorting
        if sort_by in ["name", "price", "rating"]:
            reverse = sort_order.lower() == "desc"
            filtered_products.sort(key=lambda x: x[sort_by], reverse=reverse)
        
        # Apply pagination
        total = len(filtered_products)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_products = filtered_products[start_idx:end_idx]
        
        # Convert to Product objects
        products = [Product(**p) for p in paginated_products]
        
        return ProductList(
            products=products,
            total=total,
            page=page,
            limit=limit,
            has_next=end_idx < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all product categories"""
    try:
        return [Category(**c) for c in mock_categories]
    except Exception as e:
        print(f"Error in categories: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/featured", response_model=List[Product])
async def get_featured_products():
    """Get featured products (highly rated or popular)"""
    try:
        # Simple return without sorting to test
        return [Product(**p) for p in mock_products[:3]]
    except Exception as e:
        print(f"Error in featured products: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product by ID"""
    try:
        # Find product by ID
        product = next((p for p in mock_products if p["id"] == product_id), None)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return Product(**product)
        
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
