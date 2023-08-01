from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.sql import func
db=SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.Text(), nullable=False)
    isAdmin=db.Column(db.Boolean, default=False)
    isVerified=db.Column(db.Boolean, default=False)
    otp = db.Column(db.Integer, unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    expiration_time=db.Column(db.DateTime(), default=func.timezone('utc', func.now()), server_default=func.timezone('utc', func.now()))
    reviews = db.relationship('Review', backref="user")
    orders = db.relationship('Order', backref="user")
    favourites = db.relationship('Favourite', backref="user")

    def __repr__(self) -> str:
        return 'User>>> {self.username}'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    categoryName = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    products = db.relationship('Product', backref="category")

    def __repr__(self) -> str:
        return 'Category>>> {self.categoryName}'
    
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    productName = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    imageUrl = db.Column(db.String(1500), nullable=False)
    price = db.Column(db.Float, nullable=False)
    time = db.Column(db.String(50),nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    categoryId = db.Column(db.Integer, db.ForeignKey('category.id'))
    tags = db.relationship('Tag', backref="product")
    reviews = db.relationship('Review', backref="product")
    favourites = db.relationship('Favourite', backref="product")

    def __repr__(self) -> str:
        return 'product>>> {self.productName}'


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tagName = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
   

    def __repr__(self) -> str:
        return 'tag>>> {self.tagName}'

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reviewText = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
   

    def __repr__(self) -> str:
        return 'review>>> {self.id}'
    
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    LastName = db.Column(db.String(100), nullable=False)
    contactNumber = db.Column(db.String(11), nullable=False)
    shippingAddress = db.Column(db.String(1000), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    orderDetails = db.relationship('OrderDetail', backref="order")
    def __repr__(self) -> str:
        return 'order>>> {self.id}'
    
class OrderDetail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    orderId = db.Column(db.Integer, db.ForeignKey('order.id'))
   

    def __repr__(self) -> str:
        return 'orderdetails>>> {self.id}'
    

class Favourite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey('product.id'))
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())

    def __repr__(self) -> str:
        return 'favourites>>> {self.id}'
    