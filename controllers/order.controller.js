import Product from "../Models/product.schema";
import Coupon from "../Models/coupon.schema";
import order from "../Models/order.schema";
import asynchandler from "../service/asynchandler"
import Customererror from "../utils/custom.Error"
import razorpay from "../config/razorpay.config";

//Generate razoprpay id

export const genereateRazorpayOrderId = asynchandler(async (req,res)=>{
    //get product from frontend

    //verifiy product price from backend
    //make db queries to get all product and info
     let totalamount;
    //total amaount and final amount

    //coupon check -db
    //final amount = total amount - discount

    const options ={
        amount:Math.round(totalamount * 100),
        currency:INR ,
        receipt:`receipt_${new Date().getTime()}`
    }

    const order = await razorpay.orders.create(options)

    //if order does not exist
    // suceess then it to frontend
    
})