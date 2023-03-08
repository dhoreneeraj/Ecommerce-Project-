import User from '../Models/userschema'
import asyncHandler from "../service/asynchandler"
import CustomError from "../utils/custom.Error"
import mailHelper from '../utils/.mailhelper'
import crypto from 'crypto'

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

    const user = await User.findOne({email}).select("+password")

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

 /*
@Forgot password
@route https://localhost:4000/api/auth/password/reset
@description : user will submit email and we will generate token
@parameters :email
@return success message: email sent

*/  

export const forgotPassword = asyncHandler(async (req,res) => {
  const {email} = req.body
 const user = User.findOne({email})
 
 if(!user) {
  throw new CustomError ('USer not found',404)

 }

 const resetToken = user.generateForgotPasswordToken()

 await user.save ({validateBeforeSave:false})

 const resetUrl=
 `${req.protocol}://${req.get ("host")}/api/auth/password/reset/ ${resetToken}`
  
 const text = `your password reset url is 
 /n/n  ${resetUrl} /n/n`
 try {
  await mailHelper ({
    email: user.email,
    subject: "password reset email for website",
    text: text
  })
    res.status(200).json({
      success:true,
      message: "email send to ${user.email}"
    })
  
 } catch (error) {

  //rollback - clear feild and save

  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  await user.save({validateBeforeSave: false})

  throw new CustomError ('email sent failure',500)

 }
})

/*
@Reset password
@route https://localhost:4000/api/auth/password/reset:reseToken
@description : user will be able to reset password based on url token
@parameters : token from url,password and confirm pass
@return success message: user object

*/  

export const resetPassword = asyncHandler(async (req,res) => {

  const {token: resetToken} = req.params
  const {password,confirmPassword} = req.body

  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex')

  const user = await User.findOne({
    forgotPasswordToken : resetPasswordToken,
    forgotPasswordExpiry : {$gt: Date.now()}
  })

  if(!user){
    throw new CustomError('password token in invalid or expired',400)
  }
 
   if(password !== confirmPassword){
    throw new CustomError('password and confirm password does not match',400)

}
  user.password = password
  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  await user.save()
   
   //create token and send it to user as response
   const token = user.getjwtToken()
   user.password = undefined

   //helper method for cookie can be added 
   res.cookie("token",token,cookieOptions)
   res.status(200).json({
    success:true,
    user
   })
})

/*
@Get profile
@route https://localhost:4000/api/auth/profile
@description : check for token and populate req.user
@return success message: user object

*/
export const getProlife = asyncHandler(async (req,res) => {
  const {user} = req
  if (!user){
    throw new CustomError('User not found',404)
}
   res.status(200).json({
   success:true,
   user
   })
  })