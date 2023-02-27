import User from '../Models/userschema'
import asyncHandler from "../service/asynchandler"
import CustomError from "../utils/custom.Error"

export const cookieOptions = {
     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
     httpOnly:true,
     //could be in separate file in utils
}

// documentations in controller
/*
@signUp
@route https://localhost:4000/api/auth/signup
@description : user sign up controller for creating a new user
@parameters :name ,email, password 
@return user object

*/
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

   // documentations in controller
/*
@Login
@route https://localhost:4000/api/auth/login
@description : user sign up controller for creating a new user
@parameters :name ,email, password 
@return user object

*/

export const login = asyncHandler(async (req,res) =>{
  const {email,password} =req.body

    if( !email || !password){
        throw new CustomError ('please fill all feild',400)
    }

    const user = User.findOne({email}).select("+password")

    if(!user) {
      throw new CustomError ('invalid credential',400)

    }

    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched) {
       const token = user.getjwtToken()
       user.password = undefined
      res.cookie("token",token,cookieOptions)
      return res.status(200).json({
        success:true,
            token,
            user
      })

    }
    throw new CustomError ('invalid credential -pass',400)

})


/*
@Log out
@route https://localhost:4000/api/auth/logout
@description : user logout by clearing user cookie 
@parameters :
@return success message

*/  
 export const logout = asyncHandler(async (_req,res)  => {
  res.cookie("token",null ,{
  expires: new Date(Date.now()),
  httpOnly:true
  })
 res.status(200).json({
  success:true,
  message: "logged out"
 })

 })

 