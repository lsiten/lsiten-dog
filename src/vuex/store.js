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
  //配置信息
  config: {
    url: {
      //base: 'http://rapapi.org/mockjs/28885',
      base: 'http://192.168.1.62/api.php',
      videoList: '/api/videoList',
      like: '/api/like',
      coment: '/api/coment',
      subComent: '/api/subComent',
      verifyCode: '/api/user/signup',
      doLogin: '/api/user/verify',
      imageSignature: '/api/index/signature',
      update: '/api/user/update',
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
  getImageSignature({
    commit
  }, params) {
    api.getImageSignature(params.api, params.body, params.cb)
  },

  //获取图片signature
  uploadImage({
    commit
  }, params) {
    api.uploadImage(params.api, params.body, params.header, params.cb, params.uploading)
  },
  //更新用户信息
  updateUser({
    commit
  }, params) {
    api.updateUser(params.api, params.body, params.cb);
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
