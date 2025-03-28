from flask import Blueprint, request, jsonify,url_for,current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from db_setup import db, User
from flask_bcrypt import Bcrypt
from flask_mail import Mail,Message
import os
import secrets

from flask import jsonify, redirect, current_app as app
auth = Blueprint("auth", __name__)
bcrypt = Bcrypt()
mail=Mail()

#Email verification helper function
from flask_mail import Message,Mail

#function to send verification email
def send_verification_email(user_email,token):
    try:
        #get frontenf url
        frontend_url=os.environ.get('FRONTEND_URL','http://localhost:3000')
        #create verification url
        verification_url=f"{frontend_url}/verify/{token}"
        #create mail
        msg=Message(
            'Verify your email for Dot Dash Decode',
            recipients=[user_email],
            html=f'''
            <h1>Welcome to Dot Dash Decode</h1>
            <p>Please Verify your email by clicking on the link below:</p>
            <p><a href="{verification_url}">{verification_url}</a></p>
            <p>If you did not register for this service, please ignore this mail.</p>
            '''
        )
        #send mail
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Error sending verification email:{str(e)}")
        return False


# Email verification endpoint
@auth.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    # Find user with this verification token
    user = User.query.filter_by(verification_token=token).first()
    
    if not user:
        return jsonify({"error": "Invalid verification token"}), 400
    
    # Mark user as verified
    user.is_verified = True
    # Clear the verification token for security (optional)
    user.verification_token = None
    db.session.commit()
    
    # Redirect to frontend with success message
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    return redirect(f"{frontend_url}/login?verified=true")

# Register Route
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    # Use the constructor correctly - only pass username and email
    new_user = User(username=username, email=email)
    
    # Set the password using the method
    new_user.set_password(password)
    
    # The verification token and is_verified are already set in __init__
    
    db.session.add(new_user)
    db.session.commit()

    # Send verification email
    send_verification_email(new_user.email, new_user.verification_token)

    return jsonify({
        "message": "User registered successfully! Please check your email to verify your account.",
        "user_id": new_user.id
    }), 201
# Login Route
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    #handle both email and username login
    if "username" in data and data["username"]:
        user=User.query.filter_by(username=data["username"]).first()
    elif "email" in data and data["email"]:
        user=User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error":"Invalid Credentials"}),401

    #check if user is verified
    '''if not user.is_verified:
        return jsonify({"error":"Please verify your email before logging in."}),401'''
    if not user.is_verified:
        return jsonify({
            "error": "Please verify your email before logging in",
            "needsVerification": True,
            "email": user.email
        }), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.to_dict()}), 200



# Resend Verification Email Route
@auth.route('/resend-verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Don't reveal if email exists or not (for security)
        return jsonify({"message": "If your email is registered, a verification link will be sent"}), 200
    
    if user.is_verified:
        return jsonify({"message": "This email is already verified"}), 200
        # Generate new token if needed
    if not user.verification_token:
        import secrets
        user.verification_token = secrets.token_urlsafe(32)
        db.session.commit()
    
    # Send verification email
    send_verification_email(user.email, user.verification_token)
    
    return jsonify({"message": "Verification email sent"}), 200

#life saver if the authentication does not work
@auth.route('/manual-verify/<username>', methods=['GET'])
def manual_verify(username):
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user.is_verified = True
    db.session.commit()
    
    return jsonify({"message": f"User {username} has been manually verified. You can now log in."}), 200

# Protected Route (Test)
@auth.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200

