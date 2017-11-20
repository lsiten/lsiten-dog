/*
 * @Author: lsiten 
 * @Date: 2017-11-18 15:55:43 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-19 15:57:41
 */
'use strict'
let fs =require('fs')
let path = require('path')
let mongoose = require('mongoose')

let db = 'mongodb://localhost/dog-app'
mongoose.Promise = require('bluebird')
mongoose.createConnection(db)
let model_path = path.join(__dirname,'/app/models')

//引入model文件
let walk = function (modelPath){
    fs
    .readdirSync(modelPath)
    .forEach(function(file){
        let filePath = path.join(modelPath,'/'+file)
        let stat = fs.statSync(filePath)
        if(stat.isFile())
        {
            if(/(.*)\.(js|coffee)/.test(file))
            {
                require(filePath)
            }
            else if(stat.isDirectory()){
                walk(filePath)
            }
        }
    })
}

walk(model_path)


let koa = require('koa')
let logger = require('koa-logger')
let session = require('koa-session')
let bodyParser = require('koa-bodyparser')

let app = new koa()
//用于session,cookie加密的键
app.keys = ['imooc']
//使用中间件
app.use(logger()) 
app.use(session(app)) 
app.use(bodyParser())

let router = require('./config/routes')()

app
.use(router.routes())
.use(router.allowedMethods())
//监听一个端口
app.listen(1234)

console.log('listening:1234')
