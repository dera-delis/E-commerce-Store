#!/usr/bin/env python3
"""
Database initialization script for E-commerce Store
This script creates an admin user and sample products
"""

import asyncio
import uuid
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from app.models import Base, User, Product
from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def init_database():
    """Initialize the database with admin user and sample products"""
    
    # Create database engine
    engine = create_engine(settings.database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        try:
            # Check if admin user already exists
            existing_admin = db.query(User).filter(User.email == "admin@example.com").first()
            if existing_admin:
                print("Admin user already exists")
            else:
                # Create admin user
                admin_user = User(
                    id=str(uuid.uuid4()),
                    email="admin@example.com",
                    name="Admin User",
                    password_hash=hash_password("admin123"),
                    role="admin",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.add(admin_user)
                print("Admin user created successfully")
            
            # Check if products already exist
            existing_products = db.query(Product).count()
            if existing_products > 0:
                print(f"Database already has {existing_products} products")
            else:
                # Create sample products
                sample_products = [
                    Product(
                        id=str(uuid.uuid4()),
                        name="Wireless Headphones",
                        description="High-quality wireless headphones with noise cancellation",
                        price=99.99,
                        category="Electronics",
                        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                        stock=50,
                        rating=4.5,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Smart Watch",
                        description="Fitness tracking smartwatch with heart rate monitor",
                        price=199.99,
                        category="Electronics",
                        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                        stock=30,
                        rating=4.2,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Canvas Backpack",
                        description="Durable canvas backpack for travel and daily adventures",
                        price=45.99,
                        category="Clothing",
                        image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                        stock=25,
                        rating=4.0,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Running Shoes",
                        description="Comfortable running shoes with excellent cushioning",
                        price=129.99,
                        category="Sports",
                        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                        stock=40,
                        rating=4.3,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Coffee Maker",
                        description="Automatic coffee maker with programmable features",
                        price=79.99,
                        category="Home & Garden",
                        image_url="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
                        stock=15,
                        rating=4.1,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Bluetooth Speaker",
                        description="Portable Bluetooth speaker with 360-degree sound",
                        price=59.99,
                        category="Electronics",
                        image_url="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
                        stock=35,
                        rating=4.4,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Yoga Mat",
                        description="Non-slip yoga mat for home workouts",
                        price=29.99,
                        category="Sports",
                        image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
                        stock=60,
                        rating=4.0,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    ),
                    Product(
                        id=str(uuid.uuid4()),
                        name="Laptop Stand",
                        description="Adjustable laptop stand for better ergonomics",
                        price=39.99,
                        category="Electronics",
                        image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
                        stock=20,
                        rating=4.2,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                ]
                
                for product in sample_products:
                    db.add(product)
                
                print(f"Created {len(sample_products)} sample products")
            
            # Commit all changes
            db.commit()
            print("Database initialization completed successfully!")
            
        except Exception as e:
            print(f"Error initializing database: {e}")
            db.rollback()
            raise

if __name__ == "__main__":
    init_database()
