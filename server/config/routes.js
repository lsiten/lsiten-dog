'use strict'

let Router = require('koa-router')
let User = require('../app/controllers/user')
let App = require('../app/controllers/app')
module.exports = function(){
    let router = new Router({
        prefix:'/api/1'
    })

    //user
    router.get('/u/signup',User.signup)
    router.post('/u/verify',User.verify)
    router.post('/u/update',User.update)
    //app
    router.post('/signature',App.signature)
    return router
}