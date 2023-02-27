import User from '../Models/userschema'
import asyncHandler from "../service/asynchandler"
import CustomError from "../utils/custom.Error"

export const cookieOptions = {
     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
     httpOnly:true,
     //could be in separate file in utils
}

// documentations in controller




export const signUp = asyncHandler(async (req,res) => {
    const {name,email,password} =req.body

    if(!name || !email || !password){
        throw new CustomError ('please fill all feild',400)
    }

    //check if the user exists

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError ('user already exists',400)

}

  const user = await User.create({
    name,
    email,
    password
  })

   //token
   const token = user.getjwtToken()
   console.log(user);
   user.password  = undefined

   res.cookie("token",token,cookieOptions)

   res.status(200).json({
    success:true,
    token,
    user
   })

})