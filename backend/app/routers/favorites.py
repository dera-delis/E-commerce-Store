from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.routers.auth import verify_token
from app.database import get_db, engine
from app.models import Favorite, Product, Base

router = APIRouter()

# Pydantic models
class FavoriteResponse(BaseModel):
    product_id: str
    created_at: str

class FavoriteProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str
    category: str
    image_url: str
    stock: int
    rating: float = None
    review_count: int = None

class FavoriteListResponse(BaseModel):
    favorites: List[FavoriteProductResponse]

@router.get("/", response_model=List[FavoriteProductResponse])
async def get_favorites(
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get user's favorite products"""
    try:
        # Ensure favorites table exists
        Base.metadata.create_all(bind=engine)
        
        # Get all favorite product IDs for the user
        favorites = db.query(Favorite).filter(
            Favorite.user_id == current_user_id
        ).all()
        
        if not favorites:
            return []
        
        # Get product IDs
        product_ids = [fav.product_id for fav in favorites]
        
        # Fetch product details
        products = db.query(Product).filter(
            Product.id.in_(product_ids)
        ).all()
        
        # Convert to response format
        result = []
        for product in products:
            result.append(FavoriteProductResponse(
                id=product.id,
                name=product.name,
                description=product.description or "",
                price=product.price,
                currency="USD",
                category=product.category or "",
                image_url=product.image_url or "",
                stock=product.stock or 0,
                rating=product.rating,
                review_count=0  # Can be added later if you track reviews
            ))
        
        return result
    except Exception as e:
        import traceback
        error_detail = f"Failed to get favorites: {str(e)}\n{traceback.format_exc()}"
        print(f"❌ Error in get_favorites: {error_detail}", flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to get favorites: {str(e)}")

@router.post("/{product_id}")
async def add_favorite(
    product_id: str,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Add a product to favorites"""
    try:
        # Ensure favorites table exists
        Base.metadata.create_all(bind=engine)
        
        # Check if product exists
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if already favorited
        existing = db.query(Favorite).filter(
            and_(
                Favorite.user_id == current_user_id,
                Favorite.product_id == product_id
            )
        ).first()
        
        if existing:
            return {"message": "Product already in favorites", "product_id": product_id}
        
        # Add to favorites
        favorite = Favorite(
            user_id=current_user_id,
            product_id=product_id
        )
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
        
        return {"message": "Product added to favorites", "product_id": product_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = f"Failed to add favorite: {str(e)}\n{traceback.format_exc()}"
        print(f"❌ Error in add_favorite: {error_detail}", flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to add favorite: {str(e)}")

@router.delete("/{product_id}")
async def remove_favorite(
    product_id: str,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Remove a product from favorites"""
    try:
        # Ensure favorites table exists
        Base.metadata.create_all(bind=engine)
        
        favorite = db.query(Favorite).filter(
            and_(
                Favorite.user_id == current_user_id,
                Favorite.product_id == product_id
            )
        ).first()
        
        if not favorite:
            raise HTTPException(status_code=404, detail="Favorite not found")
        
        db.delete(favorite)
        db.commit()
        
        return {"message": "Product removed from favorites", "product_id": product_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = f"Failed to remove favorite: {str(e)}\n{traceback.format_exc()}"
        print(f"❌ Error in remove_favorite: {error_detail}", flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to remove favorite: {str(e)}")

@router.get("/check/{product_id}")
async def check_favorite(
    product_id: str,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Check if a product is favorited by the user"""
    try:
        # Ensure favorites table exists
        Base.metadata.create_all(bind=engine)
        
        favorite = db.query(Favorite).filter(
            and_(
                Favorite.user_id == current_user_id,
                Favorite.product_id == product_id
            )
        ).first()
        
        return {"is_favorited": favorite is not None}
    except Exception as e:
        import traceback
        error_detail = f"Failed to check favorite: {str(e)}\n{traceback.format_exc()}"
        print(f"❌ Error in check_favorite: {error_detail}", flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to check favorite: {str(e)}")

