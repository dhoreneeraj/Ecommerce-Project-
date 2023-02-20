import mongoose from "mongoose";
import Authroles from '../utils/authRoles'
import bycrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import config from "../config/index"

const userSchema = mongoose.Schema ( 
    {
        name:{
            type: String,
            required: [true, "Name is required"],
            maxLength: [50,"Name must be less than 50"]
        },
        email:{
            type: String,
            required: [true, "email is required"],
             unique:true
        },
        Password:{
            type: String,
            required: [true, "Password is required"],
            minlength: [8,"Pass must be atleat 8 characters"],
            select:false
        },
        role:{
            type:String,
            enum: Object.values(Authroles),
            default: Authroles.USER
        },
        forgotpasswordToken:String,
        forgotpasswordExpiry:Date

},
{
    timestamps:true,
}
);

//challenge no -1 encrypt the password before saving mongosse middle ware pre hook

userSchema.pre("save",async function(next){
    if(!this.modified("password")) return next();
    this.Password = await bycrypt.hash(this.Password, 10)
    next()
})

// add more features to your user schema

userSchema.methods = {
//compare password
 comparePassword: async function(enteredPassword){
 return await bycrypt.compare(enteredPassword,this.Password)
},
 
//generate jwt token 

getJwtToken: function(){
   return JWT.sign(
    {
        _id:this._id,
        role:this.role
    },
    config.JWT_SECRET,
    {
       expiresIn: config.JWT_EXPIRY
    }
   )

}

}



export default mongoose.model("User",userSchema)