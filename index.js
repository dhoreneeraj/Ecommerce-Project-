import mongoose from "mongoose";
import app from './app'

import config from './config/index'


//create a fn
// run a fn
// (async   () => {})()

(async ()  => {
try {
    await mongoose.connect(config.MONGODB_URL)
    console.log("DB Connected");

    app.on('error',(err) =>{
        console.log("ERROR",err);
    throw err
    })
   
    const onListening = () => {
        console.log(`Listening on ${config.PORT}`);
    }

    app.listen(config.PORT,onListening)
    
} catch (error) {
    console.log("ERROR",err);
    throw err
    
}


})()