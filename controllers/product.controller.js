import Product from "../Models/product.schema"
import formidable from 'formidable'
import fs from "fs"
import {deleteFile , s3Fileupload} from  "../service/imageUploader"
import Mongoose from "mongoose"
import asyncHandler from '../service/asynchandler'
import CustomError from '../utils/custom.Error'
import config from "../config/index.js"

export const addProduct = asyncHandler(async (req,res) => {
     const form = formidable({
     mutiples:true,
    keepExtensions:true
});
   form.parse(req,async function(err,feilds,files){
    try {
        if(err){
        throw new CustomError(err.message || "Something went wrong",500)
        }
        let productId =  new Mongoose.Types.objectId().toHexString();
      // console.log(feilds,files)
      //check for feilds 
    if(!feilds.name || 
        !feilds.price ||
        !feilds.description || 
        !feilds.collectionId
        ){
            throw new CustomError("Please fill all the details",500)
        }

        //handling images
        let imgArrayResp = Promise.all(
            object.keys(files).map(async (filekey,index) => {
                const element = files[filekey]

                const data = fs.readFileSync(element.filepath)

                const upload = await s3Fileupload({
                    bucketName : config.S3_BUCKET_NAME,
                    key:`products/${productId}/photo_${index + 1}.png`,
                    body : data,
                    contentType : element.mimetype
                })
                return{
                    secure_url: upload.Location
                }
            })
        )

        let imgArray = await imgArrayResp;
        const product = await Product.create({
            _id: productId,
            photos: imgArray,
            ...feilds,
        })

        if(!product){
            throw new CustomError(err.message || "product was not created",400)

        }
        res.status(200).json({
          sucess:true,
          product
        })

    } catch (error) {

        return res.status(500).json({
            sucess:false,
          message: error.message  || "something went wrong "
        })
    }
   })
})

// get all the products

export const getAllProducts = asyncHandler (async(req,res) => {
    const products = await Product.find({})

    if(!products){
        throw new CustomError("No product was found",400)
    }

    res.status(500).json({
        sucess:true,
         products
    })
})

// get all the products by id 


export const getProductbyId = asyncHandler (async(req,res) => {

     const {id:productId} = req.params
    const product = await Product.findById(productId)

    if(!product){
        throw new CustomError("No product was found",400)
    }

    res.status(500).json({
        sucess:true,
         product
    })
})

// assigment to read 

/*
model . aggregate([{},{},{}])

$gruop
$push
$$root
$lookup
$project

*/