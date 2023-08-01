from flask import Flask
from flask_jwt_extended import JWTManager
import os
from flask_cors import CORS
from src.database import db
from src.auth import auth
from src.category import category
from src.product import product
from src.review import review
from src.order import order
from datetime import timedelta
from flask_mail import Mail

mail = Mail()
def create_app(test_config=None):

    app=Flask(__name__,instance_relative_config=True)
    cors_config={
        'origins':"*"
    }
    CORS(app,supports_credentials=True,resources={r"/*":cors_config})
    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY='4e93c30cd7d8437a509acbe762763af5f54fb07d871eacef18fe07157af91a92',
            # SQLALCHEMY_DATABASE_URI='sqlite:///mykitchen.db',
            SQLALCHEMY_DATABASE_URI='postgresql://mykitchendb_user:ovitXjE4NCClxIc5z8t8SY8loUateGXi@dpg-cj4lmuc5kgrc739qur70-a.oregon-postgres.render.com/mykitchendb',
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY='f0959567e0ea787588c725314e2249a31418bbdba736663923cc818640d64291',
            JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1),
            MAIL_SERVER='smtp.office365.com',
            MAIL_PORT=587,
            MAIL_USE_TLS=True,
            MAIL_USERNAME='mykitchenwebsite@outlook.com',
            MAIL_PASSWORD='mykitchen@2023'

        )
    else:
        app.config.from_mapping(test_config)
    
    db.app = app
    db.init_app(app)
    JWTManager(app)
    mail.init_app(app)
    app.register_blueprint(auth)
    app.register_blueprint(category)
    app.register_blueprint(product)
    app.register_blueprint(order)
    app.register_blueprint(review)
    return app


