import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
       products: {
         type: [
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                count:Number,
                price:Number
            }
         ],
        required:true
       },
       user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
       phoneNumber:{
           type:Number,
           required:true
       },

       address :{
        type:String,
        required:true
    },
       amount:{
        type:Number,
        required:true
    },
    coupon:{
        type:String,
        transactionId:String
    },
    status:{
        type:String,
        enun:["ORDERED","SHIPPED","DELIVERED","CANCELLEd"],
        default:"ORDERED",
        //can we imnporve this?
    }
    },
    
    {
       timestamps:true
    }
)