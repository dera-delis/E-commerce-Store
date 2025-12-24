from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.routers.auth import verify_token
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order as OrderModel, OrderItem as OrderItemModel

router = APIRouter()

# Pydantic models
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    subtotal: float
    image_url: Optional[str] = None

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
    shipping_address: Optional[ShippingAddress] = None
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
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create a new order from cart"""
    try:
        # Import cart functions to get real cart data
        from app.routers.cart import get_user_cart, carts_db
        
        # Get user's real cart data
        cart_data = get_user_cart(current_user_id)
        cart_items_data = list(cart_data.get("items", {}).values())
        
        # Convert cart items to order items
        cart_items = []
        for item in cart_items_data:
            order_item = OrderItem(
                product_id=item["product_id"],
                name=item["name"],
                price=item["price"],
                quantity=item["quantity"],
                subtotal=item["subtotal"],
                image_url=item.get("image_url")
            )
            cart_items.append(order_item)
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        subtotal = sum(item.subtotal for item in cart_items)
        tax = subtotal * 0.08
        shipping = 0 if subtotal >= 50 else 5.99
        total = subtotal + tax + shipping
        
        order_id = generate_order_id()
        now = datetime.now()
        
        # Create order in database
        db_order = OrderModel(
            id=order_id,
            user_id=current_user_id,
            status="pending",
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total=total,
            shipping_address=request.shipping_address.dict(),
            created_at=now,
            updated_at=now
        )
        
        db.add(db_order)
        db.flush()  # Get the order ID
        
        # Create order items in database
        for item in cart_items:
            db_order_item = OrderItemModel(
                order_id=order_id,
                product_id=item.product_id,
                name=item.name,
                price=item.price,
                quantity=item.quantity,
                subtotal=item.subtotal,
                image_url=item.image_url
            )
            db.add(db_order_item)
        
        db.commit()
        db.refresh(db_order)
        
        # Clear the user's cart after creating order
        if current_user_id in carts_db:
            carts_db[current_user_id]["items"] = {}
            carts_db[current_user_id]["total_items"] = 0
            carts_db[current_user_id]["subtotal"] = 0
        
        # Return the order in the expected format
        return Order(
            id=db_order.id,
            user_id=db_order.user_id,
            items=cart_items,
            shipping_address=request.shipping_address,
            subtotal=db_order.subtotal,
            tax=db_order.tax,
            shipping=db_order.shipping,
            total=db_order.total,
            status=db_order.status,
            created_at=db_order.created_at,
            updated_at=db_order.updated_at
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=OrderList)
def get_user_orders(
    current_user_id: str = Depends(verify_token),
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get user's order history"""
    try:
        # Get orders from database
        db_orders = db.query(OrderModel).filter(OrderModel.user_id == current_user_id).all()
        
        # Convert to Pydantic models
        orders = []
        for db_order in db_orders:
            # Get order items
            order_items = db.query(OrderItemModel).filter(OrderItemModel.order_id == db_order.id).all()
            
            # Convert to OrderItem Pydantic models
            items = [
                OrderItem(
                    product_id=item.product_id,
                    name=item.name,
                    price=item.price,
                    quantity=item.quantity,
                    subtotal=item.subtotal,
                    image_url=item.image_url
                ) for item in order_items
            ]
            
            # Convert shipping address back to Pydantic model
            if db_order.shipping_address:
                if isinstance(db_order.shipping_address, dict):
                    shipping_address = ShippingAddress(**db_order.shipping_address)
                else:
                    # Handle cases where shipping_address is stored as a string (legacy data)
                    shipping_address = None
            else:
                shipping_address = None
            
            order = Order(
                id=db_order.id,
                user_id=db_order.user_id,
                items=items,
                shipping_address=shipping_address,
                subtotal=db_order.subtotal,
                tax=db_order.tax,
                shipping=db_order.shipping,
                total=db_order.total,
                status=db_order.status,
                created_at=db_order.created_at,
                updated_at=db_order.updated_at
            )
            orders.append(order)
        
        # Simple pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_orders = orders[start_idx:end_idx]
        
        return OrderList(
            orders=paginated_orders,
            total=len(orders)
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

