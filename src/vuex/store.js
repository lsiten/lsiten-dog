/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:18 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-17 15:39:07
 */
import Vue from 'vue';
import Vuex from 'vuex';
import store from "store";
import api from './api';
import * as types from './types';
Vue.use(Vuex);
const state = {
  demoScrollTop: 0,
  isLoading: false,
  direction: 'forward',
  drawerVisibility: false,
  rightOptions:{
                  option:{showMore: false},
                  rightContent:"",
                  action:function(){
                    return ;
                  }
     },
  //配置信息
  config: {
    url: {
      //base: 'http://rapapi.org/mockjs/28885',
      base: 'http://api.lsiten.cn/api.php',
      videoList: '/api/videoList',
      like: '/api/like',
      coment: '/api/coment',
      subComent: '/api/subComent',
      verifyCode: '/api/user/signup',
      doLogin: '/api/user/verify',
      imageSignature: '/api/index/signature',
      update: '/api/user/update',
      video: '/api/video/saveInfo',
      saveCloudinaryInfo: '/api/video/saveCloudinaryInfo',
      MergeVideo: '/api/video/MergeVideo',
    },
    qiniu:{
      upload:"http://upload.qiniu.com/",
      fileUrl: "http://ozuexev9i.bkt.clouddn.com"
    },
    cloudinary: {
      cloud_name: 'lsiten',
      api_key: '384266963481284',
      api_secret: 'p0qzfk-ibGWPydz7DGr5jzL_F3Q',
      base: 'http://res.cloudinary.com/lsiten',
      apiBase: 'https://api.cloudinary.com/v1_1/lsiten',
      image: '/image/upload',
      video: '/video/upload',
      audio: '/raw/upload',

    }
  },
  //用户登陆
  user: null

}

const getters = {
  //用户,图片上传
  getImageSignature: state => state.imageSignature,
  getUser:state => {
    if(state.user){
      return state.user;
    }
    else
    {
      state.user = store.get("user");
      return state.user;
    }
  },
}

const mutations = {
  updateDemoPosition(state, payload) {
    state.demoScrollTop = payload.top
  },
  updateLoadingStatus(state, payload) {
    state.isLoading = payload.isLoading
  },
  updateDirection(state, payload) {
    state.direction = payload.direction
  },
  updateDrawerVisibility(state) {
    state.drawerVisibility = !state.drawerVisibility
  },
  updateDrawerVisibilityByFlag(state, flag) {
    state.drawerVisibility = flag
  },

  //用户登陆
  [types.UPDATE_USER_ALL](state, user) {
    state.user = user;
    store.set("user",user);   
  },
  [types.USER_LOGOUT](state, user) {
    store.remove("user");
    state.user = {}; 
  },
  [types.SET_HEADER_RIGHT](state, rightOptions) {
    console.log(rightOptions);
    state.rightOptions = rightOptions; 
  }

}
const actions = {
  updateDemoPosition({
    commit
  }, top) {
    commit({
      type: 'updateDemoPosition',
      top: top
    })
  },
  //用户登陆
  getVerifyCode({
    commit
  }, params) {
    api.getVerifyCode(params.api, params.body, params.getVerifyCode);
  },
  doLogin({
    commit
  }, params) {
    api.doLogin(params.api, params.body, params.doLogin);
  },
  //获取图片signature
  getSignature({
    commit
  }, params) {
    api.getSignature(params.api, params.body, params.cb)
  },

  //上传文件
  uploadFile({
    commit
  }, params) {
    api.uploadFile(params.api, params.body, params.header, params.cb, params.uploading)
  },
  //更新用户信息
  updateUser({
    commit
  }, params) {
    api.updateUser(params.api, params.body, params.cb);
  },


  //保存上传七牛视频的信息
  saveVideoInfo({
    commit
  }, params) {
    api.saveVideoInfo(params.api, params.body, params.cb);
  },
//合并视频音频，并保存更新video，记录audio
  MergeVideo({
  commit
  }, params){
    api.MergeVideo(params.api, params.body, params.cb);
  },
  //保存上传cloudinary视频的信息
  addCloudinaryVideoInfo({
    commit
  }, params){
    api.addCloudinaryVideoInfo(params.api, params.body, params.cb);
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
