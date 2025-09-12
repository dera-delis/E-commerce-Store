from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.routers.auth import verify_token

router = APIRouter()

# Pydantic models
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    subtotal: float

class ShippingAddress(BaseModel):
    first_name: str
    last_name: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    phone: str

class Order(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    subtotal: float
    tax: float
    shipping: float
    total: float
    status: str
    created_at: datetime
    updated_at: datetime

class CreateOrderRequest(BaseModel):
    shipping_address: ShippingAddress
    payment_method: str = "credit_card"

class OrderList(BaseModel):
    orders: List[Order]
    total: int

# Mock orders storage
orders_db = {}

def generate_order_id():
    return f"order_{len(orders_db) + 1}_{int(datetime.now().timestamp())}"

@router.post("/", response_model=Order)
async def create_order(
    request: CreateOrderRequest,
    current_user_id: str = Depends(verify_token)
):
    """Create a new order from cart"""
    try:
        # Get user's cart (mock implementation)
        cart_items = [
            OrderItem(
                product_id="1",
                name="Sample Product",
                price=29.99,
                quantity=2,
                subtotal=59.98
            )
        ]
        
        subtotal = sum(item.subtotal for item in cart_items)
        tax = subtotal * 0.08
        shipping = 0 if subtotal >= 50 else 5.99
        total = subtotal + tax + shipping
        
        order_id = generate_order_id()
        now = datetime.now()
        
        order = Order(
            id=order_id,
            user_id=current_user_id,
            items=cart_items,
            shipping_address=request.shipping_address,
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total=total,
            status="pending",
            created_at=now,
            updated_at=now
        )
        
        orders_db[order_id] = order.dict()
        
        return order
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=OrderList)
async def get_user_orders(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 10
):
    """Get user's order history"""
    try:
        user_orders = [
            order for order in orders_db.values()
            if order["user_id"] == current_user_id
        ]
        
        # Simple pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_orders = user_orders[start_idx:end_idx]
        
        return OrderList(
            orders=[Order(**order) for order in paginated_orders],
            total=len(user_orders)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user_id: str = Depends(verify_token)
):
    """Get specific order details"""
    try:
        if order_id not in orders_db:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order = orders_db[order_id]
        
        # Check if user owns this order
        if order["user_id"] != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return Order(**order)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}/tracking")
async def get_order_tracking(
    order_id: str,
    current_user_id: str = Depends(verify_token)
):
    """Get order tracking information"""
    try:
        if order_id not in orders_db:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order = orders_db[order_id]
        
        if order["user_id"] != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Mock tracking info
        tracking_info = {
            "order_id": order_id,
            "status": order["status"],
            "estimated_delivery": "2024-01-15",
            "tracking_number": f"TRK{order_id}",
            "updates": [
                {
                    "timestamp": order["created_at"],
                    "status": "Order placed",
                    "description": "Your order has been received"
                }
            ]
        }
        
        return tracking_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

