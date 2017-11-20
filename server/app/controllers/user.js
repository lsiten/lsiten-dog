'use strict'
let mongoose = require('mongoose')
let User = mongoose.model('User')
let xss = require('xss')

exports.signup =async function(ctx, next) {
  let phoneNumber =  ctx.query.phoneNumber
  let user = await new Promise((resolve, reject) => {
                      let data =  User.findOne({
                          phoneNumber: phoneNumber
                        }).exec()
                        if(data)
                        {
                          console.log(1)
                          resolve(data)
                        }
                        else
                        {
                          console.log(2)                          
                          reject(data)                          
                        }
                      })
                      .then(async (data) => {
                        console.log(3)  
                        return data
                      })
                      console.log(user)
                      
   if (!user) {
    user = new User({
      phoneNumber: xss(phoneNumber)
    })
    
  } else {
    user.verifyCode = '1212'
  }
    user = await new Promise((resolve, reject) => {
      let user = user.save()
      if(user) {
        resolve(user)
			} else {
				reject("error:保存错误")
			}
    })
    .then(
      async(data) => {
        return data
      }, function(err) {
        console.log(err)
      })
  ctx.body = {
    success: true
  }
}

exports.verify = function* (next) {
  this.body = {
    success: true
  }
}

exports.update = function* (next) {
  this.body = {
    success: true
  }
}
