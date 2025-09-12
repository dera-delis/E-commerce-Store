from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.routers.auth import verify_token

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

# Mock admin data
admin_products = []
admin_orders = []

def check_admin_role(user_id: str) -> bool:
    """Check if user has admin role"""
    # Import users_db from auth module
    from app.routers.auth import users_db
    
    # Find user by ID and check role
    for email, user in users_db.items():
        if user["id"] == user_id:
            return user["role"] == "admin"
    return False

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_user_id: str = Depends(verify_token)):
    """Get admin dashboard statistics"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        # Mock stats
        stats = AdminStats(
            total_products=len(admin_products),
            total_orders=len(admin_orders),
            total_revenue=sum(order.get("total", 0) for order in admin_orders),
            pending_orders=len([o for o in admin_orders if o.get("status") == "pending"]),
            low_stock_products=len([p for p in admin_products if p.get("stock", 0) < 10])
        )
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Product Management
@router.post("/products", response_model=dict)
async def create_product(
    product: ProductCreate,
    current_user_id: str = Depends(verify_token)
):
    """Create a new product"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        new_product = {
            "id": f"prod_{len(admin_products) + 1}",
            **product.dict(),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        admin_products.append(new_product)
        return {"message": "Product created successfully", "product_id": new_product["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products", response_model=List[dict])
async def get_admin_products(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 20
):
    """Get all products for admin management"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        return admin_products[start_idx:end_idx]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user_id: str = Depends(verify_token)
):
    """Update product information"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        product = next((p for p in admin_products if p["id"] == product_id), None)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update fields
        for field, value in product_update.dict(exclude_unset=True).items():
            product[field] = value
        
        product["updated_at"] = datetime.now()
        return {"message": "Product updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user_id: str = Depends(verify_token)
):
    """Delete a product"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        global admin_products
        admin_products = [p for p in admin_products if p["id"] != product_id]
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Order Management
@router.get("/orders", response_model=List[dict])
async def get_admin_orders(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 20,
    status: Optional[str] = None
):
    """Get all orders for admin management"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        filtered_orders = admin_orders
        if status:
            filtered_orders = [o for o in filtered_orders if o.get("status") == status]
        
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        return filtered_orders[start_idx:end_idx]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user_id: str = Depends(verify_token)
):
    """Update order status"""
    if not check_admin_role(current_user_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        order = next((o for o in admin_orders if o["id"] == order_id), None)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order["status"] = status_update.status
        order["updated_at"] = datetime.now()
        
        return {"message": "Order status updated successfully"}
    except Exception as e:
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



