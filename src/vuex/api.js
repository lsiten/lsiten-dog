/*
 * @Author: lsiten 
 * @Date: 2017-11-15 16:23:04 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-16 23:04:07
 */
import axios from 'axios'
import Mock from 'mockjs'
let fun_axios_get = (api, cb) => {
  axios.get(api)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        cb(res.data);
      }
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

let fun_axios_post = (api, body, cb) => {
  axios.post(api, body)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        //let data = Mock.mock(res.data);
        cb(res.data);
      }
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

let fun_axios_upload = (api, body, header, cb, loading) => {
  axios({
      method: 'post',
      url: api,
      data: body,
      headers: header,
      onUploadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          loading(progressEvent);
        }
      }
    })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        cb(res.data);
      }
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

export default {
  //获取验证码
  getVerifyCode: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
  //登陆操作
  doLogin: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
  //获取图片signature
  getSignature: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
  //上传文件
  uploadFile: (api, body, header, cb, uploading) => {
    fun_axios_upload(api, body, header, cb, uploading)
  },

  //更新用户信息
  updateUser: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },

  //保存上传七牛视频的信息
  saveVideoInfo: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
  //合并视频音频，并保存更新video，记录audio
  MergeVideo: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
   //保存上传cloudinary视频的信息
   addCloudinaryVideoInfo: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },
  //保存视频创意的信息
  creation: (api, body, cb) => {
    fun_axios_post(api, body, cb)
  },

  //获取视频数据
  getVideoList(api,cb){
    fun_axios_get(api,cb);
  },

  //点赞功能
  dolike(api,cb){
    fun_axios_get(api,cb);
  },

  getComentLists(api,cb){
    fun_axios_get(api,cb);
  },

  //提交评论
  subComment(api, body, cb){
    fun_axios_post(api, body, cb)
  }
}
