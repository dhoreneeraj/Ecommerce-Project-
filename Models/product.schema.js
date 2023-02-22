import mongoose, { Collection } from "mongoose";

const productSchema = new mongoose.Schema(

    {
        name:{
            type:String,
            required: [true,"Please provide the product name"],
            trim:true,
            maxLength:[120,"Product name should be max 120 characters"]
 },
      price:{
      type:Number,
      required: [true,"Please provide the product price"],
       maxLength:[5,"Product price should not be more than 5 digits"]
},
      description:{
          type:Number,
//use some of editor npm editor
},
       photos:[
        {
            secure_url:{
                type:String,
                required:true
            }
        }
       ],
   
       stock:{
        type:Number,
        default:0
       },

       sold :{
        type:Number,
        default:0
       },

       collectionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Collection
       },

},
{
    timestamps:true
}
)

export default mongoose.model("Product",productSchema)