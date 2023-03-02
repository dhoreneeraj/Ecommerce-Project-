import collection from '../Models/collection.schema.js'

import asyncHandler from "../service/asynchandler"
import CustomError from "../utils/custom.Error"

/*
@createcollection 
@route https://localhost:4000/api/auth/collection
@description : user sign up controller for creating a new user
@parameters :name ,email, password 
@return user object
*/

export const createCollection = asyncHandler(async (req,res) => {

    //take name from front end
    const {name} = req.body

    if(!name) {
        throw new CustomError("collection name is required",400)
    }
    //add this name to database
   const collect = collection.create({
    name

    })

    //send this respose to frontend
    res.status(200).json({
        success:true,
        message: "collection created with success",
        collection
   })
})




export const UpdateCollection = asyncHandler(async (req,res) => {
  // existing value to be updated 
  const {id : collectionId} = req.params

  // new value to be updated
  const {name} = req.body

  if(!name) {
    throw new CustomError("collection name is required",400)
}
  let updatedcollection = await collection.findByIdAndUpdate(
    collectionId,
    {
        name,
    },
    {
        new:true,
        runValidators:true,
    }

  )

  if(!updatedcollection){
    throw new CustomError("collection not found",400)

  }

  //send response to frontend
  res.status(200).json({
    success:true,
    message:"collection updated succesfully",
    UpdateCollection

})
 
})

export const deleteCollection = asyncHandler(async (req,res) => {
  
    const {id : collectionId} = req.params

   const collectiontoDelete = await collection.findByIdAndDelete(collectionId)

   if(!collectiontoDelete) {
    throw new CustomError("collection not found",400)

   }

   collectiontoDelete.remove()
   //send response to frontend
   res.status(200).json({
    success:true,
    message:"collection deleted succesfully",
   collectiontoDelete
   })

})

export const getAllCollection = asyncHandler(async (req,res) => {
  const collections = await collection.find()

  if(!collections){
    throw new CustomError("collection not found",400)

  }
//send response to frontend
res.status(400).json({
    success:true,
collections   })

})
