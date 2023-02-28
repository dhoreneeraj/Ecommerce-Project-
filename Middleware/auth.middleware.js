import user from '../Models/userschema'
import asyncHandler from "../service/asynchandler"
import CustomError from "../utils/custom.Error"
import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export const isLoggedIn = asyncHandler(async(req,res,next) => {
    let token;
    if(
        req.cookies.token || 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    ){
       token = req.cookies.token || req.headers.authorization.split("")[1]
    }

    if(!token){
        throw new CustomError('Not authorized to access this route',401)
    }
    try {
       const decodedJwtPayLoad = jwt.verify(token,config.JWT_SECRET)
       //_id,find user based on _id,set this in req.user
       req.user = await user.findOne(decodedJwtPayLoad._id,"name email role")
       next()
    } catch (error) {
        throw new CustomError('Not authorized to access this route',401)

    }
})

