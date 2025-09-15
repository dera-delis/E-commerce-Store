from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.routers.auth import verify_token
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order as OrderModel, OrderItem as OrderItemModel, Product as ProductModel, User as UserModel

router = APIRouter()

# Pydantic models
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None

class OrderStatusUpdate(BaseModel):
    status: str

class AdminStats(BaseModel):
    total_products: int
    total_orders: int
    total_revenue: float
    pending_orders: int
    low_stock_products: int

# Import real product data
from app.routers.products import mock_products
from app.routers.orders import orders_db

# Initialize admin data with real products
admin_products = mock_products.copy()

def check_admin_role(user_id: str, db: Session) -> bool:
    """Check if user has admin role"""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    return user and user.role == "admin"

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get admin dashboard statistics"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Get real stats from database
        total_products = db.query(ProductModel).count()
        total_orders = db.query(OrderModel).count()
        total_revenue = db.query(OrderModel).with_entities(OrderModel.total).all()
        total_revenue = sum([order.total for order in total_revenue]) if total_revenue else 0
        pending_orders = db.query(OrderModel).filter(OrderModel.status == "pending").count()
        low_stock_products = db.query(ProductModel).filter(ProductModel.stock < 10).count()
        
        stats = AdminStats(
            total_products=total_products,
            total_orders=total_orders,
            total_revenue=total_revenue,
            pending_orders=pending_orders,
            low_stock_products=low_stock_products
        )
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Product Management
@router.post("/products", response_model=dict)
async def create_product(
    product: ProductCreate,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create a new product"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Generate unique product ID
        product_id = f"prod_{int(datetime.now().timestamp())}"
        
        # Create product in database
        db_product = ProductModel(
            id=product_id,
            name=product.name,
            description=product.description,
            price=product.price,
            category=product.category,
            image_url=product.image_url,
            stock=product.stock,
            rating=0.0
        )
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        return {"message": "Product created successfully", "product_id": product_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products", response_model=List[dict])
async def get_admin_products(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all products for admin management"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Get products from database
        offset = (page - 1) * limit
        db_products = db.query(ProductModel).offset(offset).limit(limit).all()
        
        # Convert to admin format
        products = []
        for db_product in db_products:
            product = {
                "id": db_product.id,
                "name": db_product.name,
                "description": db_product.description,
                "price": db_product.price,
                "category": db_product.category,
                "image_url": db_product.image_url,
                "stock": db_product.stock,
                "rating": db_product.rating,
                "created_at": db_product.created_at.isoformat(),
                "updated_at": db_product.updated_at.isoformat()
            }
            products.append(product)
        
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update product information"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Find product in database
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update fields
        update_data = product_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        db_product.updated_at = datetime.now()
        db.commit()
        db.refresh(db_product)
        
        return {"message": "Product updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete a product"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Find product in database
        db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Delete product
        db.delete(db_product)
        db.commit()
        
        return {"message": "Product deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Order Management
@router.get("/orders", response_model=List[dict])
async def get_admin_orders(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all orders for admin management"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Get orders from database
        query = db.query(OrderModel)
        if status:
            query = query.filter(OrderModel.status == status)
        
        orders = query.offset((page - 1) * limit).limit(limit).all()
        
        # Convert orders to admin format
        admin_orders_list = []
        for order in orders:
            # Get user info for the order
            user = db.query(UserModel).filter(UserModel.id == order.user_id).first()
            
            # Get order items with product details
            order_items = db.query(OrderItemModel).filter(OrderItemModel.order_id == order.id).all()
            
            # Get product details for each item
            items_with_details = []
            for item in order_items:
                product = db.query(ProductModel).filter(ProductModel.id == item.product_id).first()
                items_with_details.append({
                    "product_id": item.product_id,
                    "name": item.name,
                    "quantity": item.quantity,
                    "price": item.price,
                    "subtotal": item.price * item.quantity,
                    "image_url": product.image_url if product else None
                })
            
            admin_order = {
                "id": order.id,
                "user_id": order.user_id,
                "user_email": user.email if user else "Unknown",
                "user_name": user.name if user else "Unknown User",
                "items": items_with_details,
                "total": order.total,
                "subtotal": order.subtotal,
                "tax": order.tax,
                "shipping": order.shipping,
                "status": order.status,
                "shipping_address": order.shipping_address,
                "notes": order.shipping_address,  # Using shipping_address as notes for now
                "created_at": order.created_at.isoformat(),
                "updated_at": order.updated_at.isoformat()
            }
            admin_orders_list.append(admin_order)
        
        return admin_orders_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{order_id}")
async def update_order(
    order_id: str,
    order_update: dict,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update order details"""
    if not check_admin_role(current_user_id, db):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Get order from database
        order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update order fields
        if "status" in order_update:
            order.status = order_update["status"]
        if "notes" in order_update:
            # Store notes in shipping_address field for now (could add notes field to model later)
            order.shipping_address = order_update["notes"]
        
        order.updated_at = datetime.now()
        
        db.commit()
        db.refresh(order)
        
        return {"message": "Order updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders/{order_id}")
async def get_admin_order(
    order_id: str,
    current_user_id: str = Depends(verify_token)
):
    """Get specific order details for admin"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        order = next((o for o in admin_orders if o["id"] == order_id), None)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



