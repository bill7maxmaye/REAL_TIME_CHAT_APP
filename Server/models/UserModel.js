const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Provide name"]
    },
    password:{
        type:String, 
        required: [true, 'Provide password'],
    },
    email:{
        type:String, 
        required :[true, 'provide email']
    },
    profilePic: 
})