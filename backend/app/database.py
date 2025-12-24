from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@postgres:5432/ecommerce")

# Create engine with connection pool settings for Cloud Run
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=300,    # Recycle connections after 5 minutes
    connect_args={"connect_timeout": 10}  # 10 second connection timeout
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)

def init_db():
    """Initialize database with sample data"""
    create_tables()
    
    # Import here to avoid circular imports
    from app.routers.products import mock_products
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        from app.models import Product, User
        
        if db.query(Product).count() == 0:
            # Add sample products
            for product_data in mock_products:
                product = Product(
                    id=product_data["id"],
                    name=product_data["name"],
                    description=product_data["description"],
                    price=product_data["price"],
                    category=product_data["category"],
                    image_url=product_data["image_url"],
                    stock=product_data["stock"],
                    rating=product_data["rating"]
                )
                db.add(product)
        
        if db.query(User).count() == 0:
            # Add sample users with hashed passwords
            sample_users = [
                {
                    "id": "admin_1",
                    "email": "admin@ecommerce.com",
                    "name": "Admin User",
                    "password": "admin123",
                    "role": "admin"
                },
                {
                    "id": "user_1", 
                    "email": "test@example.com",
                    "name": "Test User",
                    "password": "password",
                    "role": "customer"
                }
            ]
            
            for user_data in sample_users:
                user = User(
                    id=user_data["id"],
                    email=user_data["email"],
                    name=user_data["name"],
                    password_hash=pwd_context.hash(user_data["password"]),
                    role=user_data["role"]
                )
                db.add(user)
        
        db.commit()
        print("✅ Database initialized with sample data")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()
