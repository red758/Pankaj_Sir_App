const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    phone:{
        type:String, 
        match:['/^\d{10}$/'],
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    photoUrl:{
        type:String
    },
    preferredLanguage:{
        type:String,
        default:"Hindi"
    },
})