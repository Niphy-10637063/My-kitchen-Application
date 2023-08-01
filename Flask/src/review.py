from src.constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED,HTTP_404_NOT_FOUND, HTTP_409_CONFLICT
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.database import Review,User, db

review = Blueprint("review", __name__, url_prefix="/api/v1/review")


@review.post('/add')
@jwt_required()
def addReview():
    reviewText = request.json['reviewText']
    rating = request.json['rating']
    productId = request.json['productId']
    userId = get_jwt_identity()
    review = Review(reviewText=reviewText, rating=rating,productId=productId,userId=userId)
    db.session.add(review)
    db.session.commit()

    return jsonify({
        'message': "Review added successfully",
        'data': {
            'reviewId': review.id
        },
        "success":True

    }), HTTP_201_CREATED

@review.delete("/delete/<int:id>")
@jwt_required()
def deleteReview(id):
    userId=get_jwt_identity()
    review = Review.query.filter_by(id=id).first()

    if not review:
        return jsonify({'message': 'review not found',"success":False}), HTTP_404_NOT_FOUND
    if not review.userId==userId:
        return  jsonify({"success":False,"message":"Invalid User"})
        
    db.session.delete(Review)
    db.session.commit()

    return jsonify({"message":'Review deleted successfully',"success":True}), HTTP_200_OK

@review.get('/get/<int:id>')
@jwt_required()
def getReviewsByProduct(id):
    reviews = Review.query.filter_by(productId=id)
    review_list = []
    for review in reviews:
        user=User.query.filter_by(id=review.userId).first()
        _data = {
            'id': review.id,
            'reviewText': review.reviewText,
            'rating': review.rating,
            'productId':review.productId,
            'user':user.username
        }
        review_list.append(_data)
    return jsonify({'message': "review list",'data':review_list,"success":True}), HTTP_200_OK