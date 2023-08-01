
from datetime import datetime, timedelta
import random
from src.constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_409_CONFLICT
from flask import Blueprint, app, render_template_string, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity
import validators
import re
from src.database import User, db
from flask_mail import Mail,Message
mail = Mail()
auth = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

def sendOTPEmail(email,username,otp):
    emailTemplate="""<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
</head>
<body>
    <h1>OTP Verification</h1>

    <p>Hello {{ username }},</p>

    <p>Your OTP for verification is: <strong>{{ otp }}</strong></p>

    <p>Please enter this OTP to complete the verification process. It will expire in 5 minutes.</p>

    <p>If you did not request this OTP, please ignore this email.</p>

    <a href="http://localhost:4200/otp-verification/{{email}}">Click here to redirect to OTP verification page.</a>

    <p>Best regards,<br>
    My Kitchen Team</p>
</body>
</html>
"""

    # Send the OTP to the user's email
    msg = Message('OTP Verification', sender='mykitchenwebsite@outlook.com', recipients=[email])
    msg.html = render_template_string(emailTemplate, username=username,email=email, otp=otp)
    print(msg)
    mail.send(msg)


@auth.post('/register')
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    passwordPattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
    if not re.match(passwordPattern, password):
        return jsonify({'success':False,'message':'Password should meet the criteria specified','criteria':['Password should contain at least one letter (uppercase or lowercase).',
                                                                                          'Password should contain at least one digit.','Password should contain at least one special character.',
                                                                                          'Password must have a minimum length of 8 characters.']})

    if len(username) < 3:
        return jsonify({'success':False,'message': "Username is too short"}), HTTP_400_BAD_REQUEST

    if  username.isdigit() or  " " in username:
        return jsonify({'success':False,'message': "Username should be alphanumeric, also no spaces"}), HTTP_400_BAD_REQUEST
    
    if len(password) < 8:
        return jsonify({'success':False,'message': "Password is too short"}), HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return jsonify({'success':False,'message': "Email is not valid"}), HTTP_400_BAD_REQUEST

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'success':False,'message': "Email is taken"}), HTTP_409_CONFLICT

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'success':False,'message': "username is taken"}), HTTP_409_CONFLICT

    pwd_hash = generate_password_hash(password)
    otp = str(random.randint(100000, 999999))
    expiration_time = datetime.now() + timedelta(minutes=5)
    user = User(username=username, password=pwd_hash, email=email,isAdmin=False,otp=otp,isVerified=False,expiration_time=expiration_time)
    sendOTPEmail(email,username,otp)

    db.session.add(user)
    db.session.commit()
   

    return jsonify({
        'message': "User Created..OTP has been sent to your email..Please verify the mailID for successful signin",
        'data': { "email": email
        },
        'success':True,

    }), HTTP_200_OK

@auth.post('/login')
def login():
    username = request.json.get('username', '')
    password = request.json.get('password', '')

    user = User.query.filter_by(email=username).first()
    if user is None:
        user = User.query.filter_by(username=username).first()

    if user:
        if user.isVerified is False:
            return jsonify({
                'data': { 'email':user.email},
                'success':False,
                'message':'Email verification is pending..'

            }), HTTP_409_CONFLICT

        is_pass_correct = check_password_hash(user.password, password)

        if is_pass_correct:
            refresh = create_refresh_token(identity=user.id)
            access = create_access_token(identity=user.id)

            return jsonify({
                'data': {
                    'refresh': refresh,
                    'access': access,
                    'username': user.username,
                    'email': user.email,
                    'userId':user.id,
                    'isAdmin':user.isAdmin
                },
                'success':True

            }), HTTP_200_OK

    return jsonify({'message': 'Invalid Username/Password','success':False}), HTTP_400_BAD_REQUEST

@auth.get('/token/refresh')
@jwt_required(refresh=True)
def refresh_users_token():
    identity = get_jwt_identity()
    access = create_access_token(identity=identity)

    return jsonify({
        'access': access
    }), HTTP_200_OK

@auth.get('/userInfoByEmail/<string:email>')
def userInfo(email):
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found',"success":False}), HTTP_404_NOT_FOUND

    return jsonify({
        'message': 'userInfo','data':{'username':user.username,'isVerified':user.isVerified,'expiration_time':user.expiration_time},'success':True
    }), HTTP_200_OK

@auth.post('/verify_otp')
def verify_otp():
    email = request.json.get('email')
    user_otp = request.json.get('otp')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found',"success":False}), HTTP_404_NOT_FOUND


    if user_otp == user.otp:
        if datetime.now() <= user.expiration_time:
            user.isVerified=True
            db.session.commit()
            return jsonify({'message': 'Email verified successfully','success':False}), 200
        else:
            return jsonify({'message': 'OTP has expired','success':False}), 400
    else:
        return jsonify({'message': 'Invalid OTP','success':False}), 400
    

@auth.post('/resend_otp')
def resend_otp():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'message': 'User not found',"success":False}), HTTP_404_NOT_FOUND
    otp = str(random.randint(100000, 999999))
    expiration_time = datetime.now() + timedelta(minutes=5)
    user.otp=otp
    user.expiration_time=expiration_time
    sendOTPEmail(email,user.username,otp)
    db.session.commit()

    return jsonify({
        'message': "OTP has been sent to your email..Please verify the mailID",
        'data': { "email": email
        },
        'success':True,

    }), HTTP_200_OK





