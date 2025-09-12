from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from app.routers.auth import verify_token

router = APIRouter()

# Pydantic models
class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    subtotal: float

class CartResponse(BaseModel):
    items: List[CartItem]
    total_items: int
    subtotal: float
    tax: float
    shipping: float
    total: float

class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1

# Mock cart storage
carts_db = {}

def get_user_cart(user_id: str):
    if user_id not in carts_db:
        carts_db[user_id] = {"items": {}, "total_items": 0, "subtotal": 0}
    
    # Calculate totals
    cart = carts_db[user_id]
    cart["total_items"] = sum(item["quantity"] for item in cart["items"].values())
    cart["subtotal"] = sum(item["subtotal"] for item in cart["items"].values())
    
    return cart

@router.get("/", response_model=CartResponse)
async def get_cart(current_user_id: str = Depends(verify_token)):
    """Get user's shopping cart"""
    cart = get_user_cart(current_user_id)
    return CartResponse(
        items=list(cart["items"].values()),
        total_items=cart["total_items"],
        subtotal=cart["subtotal"],
        tax=cart["subtotal"] * 0.08,
        shipping=0 if cart["subtotal"] >= 50 else 5.99,
        total=cart["subtotal"] * 1.08 + (0 if cart["subtotal"] >= 50 else 5.99)
    )

@router.post("/add", response_model=CartResponse)
async def add_to_cart(request: AddToCartRequest, current_user_id: str = Depends(verify_token)):
    """Add item to cart"""
    cart = get_user_cart(current_user_id)
    
    # Mock product data
    mock_product = {
        "id": request.product_id,
        "name": f"Product {request.product_id}",
        "price": 29.99
    }
    
    if request.product_id in cart["items"]:
        cart["items"][request.product_id]["quantity"] += request.quantity
        cart["items"][request.product_id]["subtotal"] = cart["items"][request.product_id]["price"] * cart["items"][request.product_id]["quantity"]
    else:
        cart["items"][request.product_id] = {
            "product_id": request.product_id,
            "name": mock_product["name"],
            "price": mock_product["price"],
            "quantity": request.quantity,
            "subtotal": mock_product["price"] * request.quantity
        }
    
    cart = get_user_cart(current_user_id)
    return CartResponse(
        items=list(cart["items"].values()),
        total_items=cart["total_items"],
        subtotal=cart["subtotal"],
        tax=cart["subtotal"] * 0.08,
        shipping=0 if cart["subtotal"] >= 50 else 5.99,
        total=cart["subtotal"] * 1.08 + (0 if cart["subtotal"] >= 50 else 5.99)
    )

@router.delete("/items/{product_id}")
async def remove_cart_item(product_id: str, current_user_id: str = Depends(verify_token)):
    """Remove item from cart"""
    cart = get_user_cart(current_user_id)
    if product_id in cart["items"]:
        del cart["items"][product_id]
    return {"message": "Item removed"}

@router.put("/items/{product_id}")
async def update_cart_item(product_id: str, request: AddToCartRequest, current_user_id: str = Depends(verify_token)):
    """Update cart item quantity"""
    cart = get_user_cart(current_user_id)
    if product_id in cart["items"]:
        cart["items"][product_id]["quantity"] = request.quantity
        cart["items"][product_id]["subtotal"] = cart["items"][product_id]["price"] * request.quantity
    cart = get_user_cart(current_user_id)
    return CartResponse(
        items=list(cart["items"].values()),
        total_items=cart["total_items"],
        subtotal=cart["subtotal"],
        tax=cart["subtotal"] * 0.08,
        shipping=0 if cart["subtotal"] >= 50 else 5.99,
        total=cart["subtotal"] * 1.08 + (0 if cart["subtotal"] >= 50 else 5.99)
    )

@router.delete("/")
async def clear_cart(current_user_id: str = Depends(verify_token)):
    """Clear user's shopping cart"""
    cart = get_user_cart(current_user_id)
    cart["items"] = {}
    cart["total_items"] = 0
    cart["subtotal"] = 0
    return {"message": "Cart cleared"}
