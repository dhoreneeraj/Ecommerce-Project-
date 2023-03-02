import dotenv from 'dotenv'
import { mongo } from 'mongoose'


dotenv.config()

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
  MONGODB_URL: ,
  PORT: process.env.PORT,
  SMPT_MAIL_HOST: process.env.SMPT_MAIL_HOST,
  SMPT_MAIL_PORT: process.env.SMPT_MAIL_PORT,
  SMPT_MAIL_USERNAME: process.env.SMPT_MAIL_USERNAME,
  SMPT_MAIL_PASSWORD: process.env.SMPT_MAIL_PASSWORD,
  SMPT_MAIL_EMAIL: process.env.SMPT_MAIL_EMAIL,
  S3_ACCESS_KEY:process.env.S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY:process.env.S3_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME:process.env.S3_BUCKET_NAME,
  S3_REGION : process.env.S3_REGION

}

export default config