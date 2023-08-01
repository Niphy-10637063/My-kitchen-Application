from src.constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED,HTTP_404_NOT_FOUND, HTTP_409_CONFLICT
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import Category, db

category = Blueprint("category", __name__, url_prefix="/api/v1/category")


@category.post('/add')
@jwt_required()
def addCategory():
    categoryName = request.json['categoryName']
    description = request.json['description']
    if Category.query.filter_by(categoryName=categoryName).first() is not None:
        return jsonify({'message': "Category already exists","success":False}), HTTP_409_CONFLICT
    category = Category(categoryName=categoryName, description=description)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': "Category added successfully",
        'data': {
            'categoryName': categoryName, "description": description
        },
        "success":True

    }), HTTP_201_CREATED


@category.put('/update/<int:id>')
@jwt_required()
def updateCategory(id):
    category = Category.query.filter_by(id=id).first()
    if category is None:
         return jsonify({'message': 'Category not found',"success":False}), HTTP_404_NOT_FOUND
    categoryName = request.json['categoryName']
    description = request.json['description']
    categoryExist= Category.query.filter_by(categoryName=categoryName).first()
    if categoryExist is not None and categoryExist.id != category.id:
        return jsonify({'message': "Category already exists","success":False}), HTTP_409_CONFLICT
   
    category.categoryName = categoryName
    category.description = description
    db.session.commit()
    return jsonify({'data':{
        'id': category.id,
        'categoryName': category.categoryName,
        'description': category.description,
    },'message':"Category updated successfully","success":True}), HTTP_200_OK


@category.get('/get/all')
@jwt_required()
def getAllCategories():
    categories = Category.query.all()
    category_list = []
    for category in categories:
        category_data = {
            'id': category.id,
            'categoryName': category.categoryName,
            'description': category.description
        }
        category_list.append(category_data)
    return jsonify({'message': "category list",'data':category_list,"success":True}), HTTP_200_OK

@category.get('/get/pdtCount')
@jwt_required()
def getAllCategoriesWithPdtCount():
    categories = Category.query.all()
    category_list = []
    totalCount=0
    for category in categories:
        category_data = {
            'id': category.id,
            'categoryName': category.categoryName,
            'description': category.description,
            'productCount':len(category.products)
        }
        totalCount+=len(category.products)
        category_list.append(category_data)
    data={'category_list':category_list,'totalCount':totalCount}
    return jsonify({'message': "category list",'data':data,"success":True}), HTTP_200_OK


@category.get('/get/<int:id>')
@jwt_required()
def getCategory(id):
    category = Category.query.filter_by(id=id).first()
    if category is None:
        return jsonify({'message': 'Category not found',"success":False}), HTTP_404_NOT_FOUND
    return jsonify({'message': "category","success":True,'data':{'categoryName':category.categoryName,'id':category.id,'description':category.description}}), HTTP_200_OK

@category.delete("/delete/<int:id>")
@jwt_required()
def deleteCategory(id):

    category = Category.query.filter_by(id=id).first()

    if not category:
        return jsonify({'message': 'category not found',"success":False}), HTTP_404_NOT_FOUND
    if category and (len(category.products))>0:
        return jsonify({'message': 'There is porduct under this category. Please delete all the products to delete the category',"success":False}), HTTP_404_NOT_FOUND

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message":'Category deleted successfully',"success":True}), HTTP_200_OK
    