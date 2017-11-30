/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:18 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-17 15:39:07
 */
import Vue from 'vue';
import Vuex from 'vuex';
import store from "store";
import queryString from "query-string";
import api from './api';
import * as types from './types';
Vue.use(Vuex);
const state = {
  demoScrollTop: 0,
  isLoading: false,
  direction: 'forward',
  backurl: "",
  drawerVisibility: false,
  rightOptions:{
                  option:{showMore: false},
                  rightContent:"",
                  action:function(){
                    return ;
                  }
     },
  //我的视频列表
  getMyVideoMore:true,
  myVideoList:[],
  myVideoPage:0,
  //视频列表
  videoList:[],
  videoPage:0,
  getVideoMore:true,
  //评论列表
  comentLists:[],
  comentPage:0,
  getComentMore:true,

  //配置信息
  config: {
    url: {
      //base: 'http://rapapi.org/mockjs/28885',
      base: 'http://api.lsiten.cn/api.php',
      videoList: '/api/video/videoList',
      like: '/api/video/like',
      coment: '/api/video/coment',
      subComent: '/api/video/subComent',
      verifyCode: '/api/user/signup',
      doLogin: '/api/user/verify',
      imageSignature: '/api/index/signature',
      update: '/api/user/update',
      video: '/api/video/saveInfo',
      saveCloudinaryInfo: '/api/video/saveCloudinaryInfo',
      MergeVideo: '/api/video/MergeVideo',
      creation: '/api/video/creation',
    },
    qiniu:{
      upload:"http://upload.qiniu.com/",
      fileUrl: "http://data.lsiten.cn"
    },
    cloudinary: {
      cloud_name: 'lsiten',
      api_key: '384266963481284',
      api_secret: 'p0qzfk-ibGWPydz7DGr5jzL_F3Q',
      base: 'http://res.cloudinary.com/lsiten',
      apiBase: 'https://api.cloudinary.com/v1_1/lsiten',
      image: '/image/upload',
      video: '/video/upload',
      audio: '/video/upload',

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
  getVideoList:state=>state.videoList,
  getVideoMore:state=>state.getVideoMore,
  getComentList:state=>state.comentLists,
  getComentMore:state=>state.getComentMore,
  getMyvideoList:state=>state.myVideoList,
  getMyvideoMore:state=>state.getMyVideoMore,
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
  [types.SET_BACK_URL](state, backurl) {
    state.backurl = backurl;
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
    state.rightOptions = rightOptions; 
  },

  //视频列表页
  [types.SET_VIDEO_NUM_REFRESH](state){
    state.videoPage = 0;
    state.getVideoMore = true;
  },
  [types.SET_VIDEO_LISTS_REFRESH](state, data){
    state.videoList = data.data;
    state.getVideoMore = data.obj.hasMore;
  },
  [types.SET_VIDEO_LISTS](state, data){
    state.videoList = state.videoList.concat(data.data);
    state.getVideoMore = data.obj.hasMore;
  },
  [types.SET_VIDEO_NUM](state){
    state.videoPage += 1; 
    state.getVideoMore = false;
  },

  //评论列表
  [types.SET_COMENT_LISTS](state, data){
    state.comentLists = state.comentLists.concat(data.data);
    state.getComentMore = data.obj.hasMore;
  },
  [types.SET_COMENT_NUM](state){
    state.comentPage += 1; 
    state.getComentMore = false;
  },
  //我的视频列表
  [types.SET_MY_VIDEO_LISTS](state, data){
    state.myVideoList = state.myVideoList.concat(data.data);
    state.getMyVideoMore = data.obj.hasMore;
  },
  [types.SET_MY_VIDEO_NUM](state){
    state.myVideoPage += 1; 
    state.getMyVideoMore = false;
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
  },
  //保存视频创意的信息
  creation({
    commit
  }, params){
    api.creation(params.api, params.body, params.cb);
  },
  //刷新列表
  getVideolistsFresh({commit}){
    let url = state.config.url.base + state.config.url.videoList + '?_t=' + new Date()*1 + "&page=1";
    commit(types.SET_VIDEO_NUM_REFRESH);
    api.getVideoList(url,function(res){
        commit(types.SET_VIDEO_LISTS_REFRESH,res)
    });
  },
  //获取视频列表
  getVideolists({
    commit
  }){
    if(state.getVideoMore)
    {
      let url = state.config.url.base + state.config.url.videoList + '?_t=' + new Date()*1 + "&page=" + state.videoPage;
      commit(types.SET_VIDEO_NUM);
      api.getVideoList(url,function(res){
          commit(types.SET_VIDEO_LISTS,res)
      });
    }
  },

  //点赞功能
  dolike({
    commit
  }, data){
    let user = {};
    if(state.user){
      user = state.user;
    }
    else
    {
      user = store.get("user");
    }
    let url = state.config.url.base + state.config.url.like+'?_t=' + new Date()*1 + "&"+queryString.stringify({ accessToken: user.accessToken, isLike: data.isLike ,videoid:data.videoid});
    api.dolike(url,data.cb);
  },


  //获取视频评论列表 getComentLists
  getComentLists({
    commit
  }, videoid){
    if(state.getComentMore){
      let user = {};
      if(state.user){
        user = state.user;
      }
      else
      {
        user = store.get("user");
      }
      commit(types.SET_COMENT_NUM);
      let url = state.config.url.base + state.config.url.coment +'?_t=' + new Date()*1 + "&"+queryString.stringify({ accessToken: user.accessToken, page: state.comentPage ,videoid:videoid});
      api.getComentLists(url,function(res){
        commit(types.SET_COMENT_LISTS,res);
      });
    }
  },

  //提交评论信息
  subComment({
    commit
  }, params){
    api.subComment(params.api, params.body, params.cb);
  },

  //获取我的视频
  getMyvideoLists({
    commit
  },userid){
    if(state.getMyVideoMore)
    {
      let url = state.config.url.base + state.config.url.videoList + '?_t=' + new Date()*1 + "&page=" + state.myVideoPage + "&userid="+userid;
      commit(types.SET_MY_VIDEO_NUM);
      api.getVideoList(url,function(res){
          commit(types.SET_MY_VIDEO_LISTS,res)
      });
    }
  },

  //
  setBackurl({commit},backurl){
    commit(types.SET_BACK_URL,backurl);
  }

}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
