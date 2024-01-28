const mongoose = require('mongoose')

const UserSchema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    }
},
{timestamps:true}
)
const UserModel= mongoose.model('User',UserSchema);
module.exports=UserModel
