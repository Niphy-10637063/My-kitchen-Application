from src.constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED,HTTP_404_NOT_FOUND, HTTP_409_CONFLICT
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.database import Product,Tag,Favourite,Review,db

product = Blueprint("product", __name__, url_prefix="/api/v1/product")


@product.post('/add')
@jwt_required()
def addProduct():
    productName = request.json['productName']
    description = request.json['description']
    price = request.json['price']
    time = request.json['time']
    imageUrl = request.json['imageUrl']
    tags = request.json.get('tags',[])
    categoryId = request.json['categoryId']
    if Product.query.filter_by(productName=productName).first() is not None:
        return jsonify({'message': "Product already exists","success":False}), HTTP_409_CONFLICT
    product = Product(
        productName=productName,
        description=description,
        price=price,
        time=time,
        imageUrl=imageUrl,
        categoryId=categoryId
    )

    for tag in tags:
        tag_name = tag.get('tagName')
        if tag_name:
            tag = Tag(tagName=tag_name, product=product)
            db.session.add(tag)

    db.session.add(product)
    db.session.commit()

    return jsonify({
        'message': "Product added successfully",
        'data': {
            'productName': productName, "description": description
        },"success":True

    }), HTTP_201_CREATED


@product.put('/update/<int:id>')
@jwt_required()
def updateProduct(id):
    product = Product.query.filter_by(id=id).first()
    if product is None:
         return jsonify({'message': 'Product not found',"success":False}), HTTP_404_NOT_FOUND
    productName = request.json['productName']
    description = request.json['description']
    categoryId = request.json['categoryId']
    imageUrl = request.json['imageUrl']
    price = request.json['price']
    time = request.json['time']
    tags = request.json.get('tags',[])

    productExist= Product.query.filter_by(productName=productName).first()
    if productExist is not None and productExist.id != productExist.id:
        return jsonify({'message': "Product already exists","success":False}), HTTP_409_CONFLICT
   
    product.productName = productName
    product.description = description
    product.categoryId = categoryId
    product.price = price
    product.time = time
    product.imageUrl=imageUrl
    for pdt_tag in product.tags:
        db.session.delete(pdt_tag)
    # db.session.commit()
    for tag in tags:
        tag_name = tag.get('tagName')
        if tag_name:
            tag_data = Tag(tagName=tag_name, product=product)
            db.session.add(tag_data)

    db.session.commit()
    return jsonify({'data':{
        'id': product.id,
        'productName': product.productName,
        'description': product.description,
        'categoryId': product.categoryId,
        'price': product.price,
        'time': product.time,
        # 'tags':product.tags
    },'message':"Product updated successfully","success":True}), HTTP_200_OK


@product.get('/get/all/<int:categoryId>')
@jwt_required()
def getAllProductsByCategory(categoryId):
    if categoryId == 0:
        products = Product.query.all()
    else:
        products = Product.query.filter_by(categoryId=categoryId).all()
    userId = get_jwt_identity()

    product_list = []
    for product in products:
        favourite=Favourite.query.filter_by(productId=product.id,userId=userId).first()
        reviews=Review.query.filter_by(productId=product.id)
        totalRating=0
        overallRating=0
        for review in reviews:
            totalRating+=review.rating
        isFavourite=True
        if favourite is None:
            isFavourite=False
        if len(product.reviews)>0:
            overallRating=totalRating/len(product.reviews)

        product_data = {
            'id': product.id,
            'productName': product.productName,
            'description': product.description,
            'time': product.time,
            'price': product.price,
            'categoryId': product.categoryId,
            'imageUrl': product.imageUrl,
            'tags': [],
            'isFavourite':isFavourite,
            'overallRating':overallRating
        }
        tag_list=[]
        for tag in product.tags:
            tag_data={
                'id':tag.id,
                'tagName':tag.tagName
            }
            tag_list.append(tag_data)
        product_data['tags']=tag_list
        product_list.append(product_data)
    return jsonify({'message': "Product list",'data':product_list,"success":True}), HTTP_200_OK


@product.get('/get/<int:id>')
@jwt_required()
def getproduct(id):
    product = Product.query.filter_by(id=id).first()
    if product is None:
        return jsonify({'message': 'product not found',"success":False}), HTTP_404_NOT_FOUND
    tag_list=[]
    for tag in product.tags:
        tag_data={
            'id':tag.id,
            'tagName':tag.tagName
        }
        tag_list.append(tag_data)
    userId = get_jwt_identity()
    favourite=Favourite.query.filter_by(productId=id,userId=userId).first()
    reviews=Review.query.filter_by(productId=id)
    totalRating=0
    overallRating=0
    for review in reviews:
        totalRating+=review.rating
    isFavourite=True
    if favourite is None:
        isFavourite=False
    if len(product.reviews)>0:
        overallRating=totalRating/len(product.reviews)
    return jsonify({'message': "product",
                    'data':{
                        'id': product.id,
                        'productName': product.productName,
                        'description': product.description,
                        'time': product.time,
                        'price': product.price,
                        'categoryId': product.categoryId,
                        'imageUrl':product.imageUrl,
                        'isFavourite':isFavourite,
                        'overallRating':overallRating,
                        'tags': tag_list
                         },"success":True
                    }
                ), HTTP_200_OK

@product.delete("/delete/<int:id>")
@jwt_required()
def deleteProduct(id):
    product = Product.query.filter_by(id=id).first()
    if not product:
        return jsonify({'message': 'Product not found',"success":False}), HTTP_404_NOT_FOUND
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message":'Product deleted successfully',"success":True}), HTTP_200_OK

@product.post('/favourite')
@jwt_required()
def addFavourite():
    productId = request.json['productId']
    userId = get_jwt_identity()
    favourite=Favourite.query.filter_by(productId=productId,userId=userId).first()
    if favourite is not None:
        db.session.delete(favourite)
        db.session.commit()
        return jsonify({'message': "Product removed from favourites","success":True}), HTTP_200_OK
    else:
        favourite = Favourite(
            userId=userId,
            productId=productId
        )
        db.session.add(favourite)
        db.session.commit()
        return jsonify({'message': "Product added to favourites","success":True}), HTTP_200_OK

@product.get('/get/favourites')
@jwt_required()
def getFavouties():
    userId = get_jwt_identity()
    favourites=Favourite.query.filter_by(userId=userId)
    favouriteList=[]
    for favourite in favourites:
        product=Product.query.filter_by(id=favourite.productId).first()
        fav_data={
            'id':favourite.id,
            'productName':product.productName,
            'imageUrl':product.imageUrl,
            'productId':product.id,
            'price':product.price
        }
        favouriteList.append(fav_data)
    return jsonify({'message': "Favourites",'data':favouriteList,"success":True
                    }), HTTP_200_OK

@product.post('/remove/favourite')
@jwt_required()
def removeFavourite():
    id = request.json['id']
    userId = get_jwt_identity()
    favourite=Favourite.query.filter_by(id=id).first()
    if favourite is not None:
        db.session.delete(favourite)
        db.session.commit()
        return jsonify({'message': "Product removed from favourites","success":True}), HTTP_200_OK
    else:
        return jsonify({'message': 'Product not found',"success":False}), HTTP_404_NOT_FOUND


    