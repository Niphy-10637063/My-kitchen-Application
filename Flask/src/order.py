from src.constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED,HTTP_404_NOT_FOUND, HTTP_409_CONFLICT
from flask import Blueprint, render_template_string, request, jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from src.database import Order,OrderDetail,User,Product,db
from flask_mail import Mail,Message
order = Blueprint("order", __name__, url_prefix="/api/v1/order")
mail = Mail()

@order.post('/add')
@jwt_required()
def addOrder():
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    contactNumber = request.json['contactNumber']
    shippingAddress = request.json['shippingAddress']
    total = request.json['total']
    userId = get_jwt_identity()
    user = User.query.filter_by(id=userId).first()
    orderDetails = request.json.get('orderDetails',[])

    order = Order(
        firstName = firstName,
        LastName =lastName,
        contactNumber = contactNumber,
        shippingAddress = shippingAddress,
        status = 'Processing',
        total = total,
        userId = userId

    )

    for orderDetail in orderDetails:
        quantity = orderDetail.get('quantity')
        price = orderDetail.get('price')
        subtotal = orderDetail.get('subtotal')
        productId = orderDetail.get('productId')
        if productId:
            detail = OrderDetail(quantity=quantity, price=price,subtotal=subtotal,productId=productId,order=order)
            db.session.add(detail)

    db.session.add(order)
    msg = Message(subject="Order Confirmation",
                  sender="mykitchenwebsite@outlook.com",
                  recipients=[user.email])
    email_template = """
    <h1>Thank You for Your Food Order!</h1>
    <p>Hello {{ firstName }} {{lastName}},</p>
    <p>We have received your food order. Below are the details:</p>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>

        </tr>
        {% for item in orderDetails %}
        <tr>
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ item.price }}</td>
            <td>${{ item.subtotal }}</td>

        </tr>
        {% endfor %}
        <tr>
            <td colspan="3">Total:</td>
            <td><b>${{ total }}</b></td>
        </tr>
    </table>
    <p>Your order will be prepared and delivered to the following address:</p>
    <p><b>{{ shippingAddress }}</b></p>
    <p>Thank you for choosing our restaurant. We hope you enjoy your meal!</p>
    <p>Best regards,<br>
    My Kitchen Team</p>
    """

    msg.html = render_template_string(email_template, firstName=firstName,lastName=lastName, orderDetails=orderDetails,
                                      total=total, shippingAddress=shippingAddress)

    mail.send(msg)
    db.session.commit()

    return jsonify({
        'message': "Order added successfully",
        'data': {
            'id': order.id
        },"success":True

    }), HTTP_201_CREATED




@order.get('/get/all')
@jwt_required()
def getAllOrders():
    orders = Order.query.all()
    order_list = []
    for order in orders:
        user = User.query.filter_by(id=order.userId).first()
        order_data = {
            'id': order.id,
            'firstName': order.firstName,
            'LastName': order.LastName,
            'contactNumber': order.contactNumber,
            'shippingAddress': order.shippingAddress,
            'status': order.status,
            'total': order.total,
            'orderDate': order.created_at,
            'updatedDate': order.updated_at,

            'user':user.username
        }

        order_list.append(order_data)
    return jsonify({'message': "category list",'data':order_list,"success":True}), HTTP_200_OK


@order.get('/getOrderByUser')
@jwt_required()
def getOrdersForCurrentUser():
    userId = get_jwt_identity()
    orders = Order.query.filter_by(userId=userId).all()
    order_list = []
    for order in orders:
        order_data = {
            'id': order.id,
            'firstName': order.firstName,
            'LastName': order.LastName,
            'contactNumber': order.contactNumber,
            'shippingAddress': order.shippingAddress,
            'status': order.status,
            'total': order.total,
            'orderDate': order.created_at,
            'updatedDate':order.updated_at,
        }
        # detail_list=[]
        # for detail in order.orderDetails:
        #     product = Product.query.filter_by(id=order.productId).first()
        #     _data={
        #         'id':detail.id,
        #         'quantity':detail.quantity,
        #         'price':detail.price,
        #         'subtotal':detail.subtotal,
        #         'quantity':detail.quantity,
        #         'product':product.productName
        #     }
        #     tag_list.append(tag_data)
        # product_data['tags']=tag_list
        order_list.append(order_data)
    return jsonify({'message': "category list",'data':order_list,"success":True}), HTTP_200_OK


@order.get('/get/details/<int:id>')
@jwt_required()
def getOrderDetails(id):
    orderDetails = OrderDetail.query.filter_by(orderId=id).all()
    detail_list=[]
    for detail in orderDetails:
        product = Product.query.filter_by(id=detail.productId).first()
        _data={
            'id':detail.id,
            'quantity':detail.quantity,
            'price':detail.price,
            'subtotal':detail.subtotal,
            'quantity':detail.quantity,
            'product':product.productName,
            'imageUrl':product.imageUrl
        }
        detail_list.append(_data)
    return jsonify({'message': "details",
                    'data':detail_list,"success":True
                    }
                ), HTTP_200_OK

@order.put('/cancel')
@jwt_required()
def cancel():
    id = request.json['id']
    order = Order.query.filter_by(id=id).first()
    if order is None:
         return jsonify({'message': 'order not found',"success":False}), HTTP_404_NOT_FOUND
   
    order.status = 'Cancelled'
    db.session.commit()
    return jsonify({'data':{
        'id': order.id
    },'message':"Order cancelled successfully","success":True}), HTTP_200_OK