import mongoose from "mongoose";
import Authroles from '../utils/authRoles'

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

export default mongoose.model("User",userSchema)