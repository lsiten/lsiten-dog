/*
 * @Author: lsiten 
 * @Date: 2017-11-18 16:20:21 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-18 16:39:48
 */
'use strict'
exports.signature = function* (next) {
  this.body = {
    success: true
  }
}
