/*
 * @Author: lsiten 
 * @Date: 2017-11-19 10:59:35 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-19 15:48:32
 */
'use strict'
let mongoose = require('mongoose')
//表约束
let UserSchema = new mongoose.Schema({
    phoneNumber:{
        unique:true,
        type:String
    },
    areaCode:String,
    verifyCode:String,
    accessToken:String,
    nickname:String,
    sex:String,
    breed:String,
    age:String,
    avatar:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

UserSchema.pre('save',(next)=>{
    if(this.isNew){
        this.meta.createAt  = this.meta.updateAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
        
    }

    next()
})

module.exports = mongoose.model('User',UserSchema);