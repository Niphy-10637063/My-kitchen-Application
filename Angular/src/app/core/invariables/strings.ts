export abstract class Strings {
      // API ENDPOINTS
  public static readonly API_ENDPOINT_LOGIN: string = 'auth/login';
  public static readonly API_ENDPOINT_VERIFY_OTP: string = 'auth/verify_otp';
  public static readonly API_ENDPOINT_RESEND_OTP: string ='auth/resend_otp';
  public static readonly API_ENDPOINT_REFRESH: string = 'auth/token/refresh';
  public static readonly API_ENDPOINT_USERINFO_BY_EMAIL: string = 'auth/userInfoByEmail/';
  public static readonly API_ENDPOINT_REGISTER: string = 'auth/register';
  public static readonly API_ENDPOINT_CATEGORIES: string ='ProductDetails/categories';
  public static readonly API_ENDPOINT_PRODUCTS: string ='ProductDetails/products';
  public static readonly ACCESS_TOKEN_STORAGE_VARIABLE_NAME: string = 'accessToken';
  public static readonly REFRESH_TOKEN_STORAGE_VARIABLE_NAME: string = 'refreshToken';
  public static readonly SESSION_USER: string = 'sessionUser';
  public static readonly API_ENDPOINT_ORDER: string = '/order/add';
  public static readonly API_ENDPOINT_ADD_REVIEW: string = '/review/add';
  public static readonly API_ENDPOINT_GET_REVIEW: string = '/review/get/';
  public static readonly API_ENDPOINT_GET_ORDERS: string = '/order/get/all';
  public static readonly API_ENDPOINT_GET_ORDER_By_USER: string ='/order/getOrderByUser'
  public static readonly API_ENDPOINT_SAVE_CATEGORIES: string = '/category/add';
  public static readonly API_ENDPOINT_GET_CATEGORIES: string = '/category/get/all';
  public static readonly API_ENDPOINT_GET_ORDER_DETAILS: string = '/order/get/details/';
  public static readonly API_ENDPOINT_GET_CATEGORIES_WITH_PRODUCT_COUNT: string ='/category/get/pdtCount';
  public static readonly API_ENDPOINT_GET_PRODUCTS: string = '/product/get/all/';
  public static readonly API_ENDPOINT_GET_PRODUCT_BY_ID: string = '/product/get/';
  public static readonly API_ENDPOINT_UPDATE_CATEGORIES: string = '/category/update/';
  public static readonly API_ENDPOINT_DELETE_CATEGORY: string = '/category/delete/';
  public static readonly API_ENDPOINT_SAVE_PRODUCTS: string = '/product/add';
  public static readonly API_ENDPOINT_CANCEL_ORDER: string = '/order/cancel';
  public static readonly API_ENDPOINT_UPDATE_PRODUCTS: string = '/product/update/';
  public static readonly API_ENDPOINT_DELETE_PRODUCT: string = '/product/delete/';
  public static readonly API_ENDPOINT_FAVOURITE_PRODUCT: string = '/product/favourite';
  public static readonly API_ENDPOINT_REMOVE_FAVOURITE_PRODUCT: string = '/product/remove/favourite';
  public static readonly API_ENDPOINT_GET_FAVOURITE_PRODUCT: string = '/product/get/favourites';

}
