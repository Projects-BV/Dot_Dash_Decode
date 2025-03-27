



from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt

db=SQLAlchemy()
bcrypt=Bcrypt()

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(80),unique=True,nullable=False)
    email=db.Column(db.String(120),unique=True,nullable=False)
    password_hash=db.Column(db.String(255),nullable=False)  
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email
        # Generate verification token
        import secrets
        self.verification_token = secrets.token_urlsafe(32)
        self.is_verified = False

    def set_password(self,password):
        self.password_hash=bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self,password):
        return bcrypt.check_password_hash(self.password_hash,password)
    
    def to_dict(self):
        return{
            "id":self.id,
            "username":self.username,
            "email":self.email
        }