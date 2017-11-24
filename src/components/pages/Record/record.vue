/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:47 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 23:35:03
 */
<template>
  <div class="record">
    <div class="videoBox" v-show="isUpload || videoSrc">
        <div v-show="videoSrc">
          <video-player :src="videoSrc" :options="videoOptions"></video-player>
        </div>
        <div class="loadvideo" v-show="!videoSrc">
            <div class="doglook">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#dog-hashiqi"></use>
              </svg>
            </div>
            <div class="loading">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#dog-jiazai"></use>
              </svg>
            </div>
            <div class="progressBox">
              <x-progress :percent="precent" :show-cancel="false"></x-progress>
              <p class="tips">正在生成静音文件,已完成{{precent}}%</p>
            </div>
          </div>
      </div>
    <div class="recordBox" @click="showCamera" v-show="!isUpload && !videoSrc">
      <div class="recordIcon">
        <div class="Dogrecording">
          <svg class="icon" aria-hidden="true">
              <use xlink:href="#dog-record"></use>
          </svg>
        </div>
        <div class="Dog">
          <svg class="icon" aria-hidden="true">
              <use xlink:href="#dog-sdglogo"></use>
          </svg>
        </div>
      </div>
      <div class="recordTitle">点击上传视频</div>
      <div class="recordDesc">建议视频不要超过10s</div>
    </div>
    <camera-actionsheet
     :isShow="isShow"
     :menus="menus"
     @input="val=>{isShow=val}"
     v-on:success = "cameraSuccess"
     v-on:error = "cameraError" ></camera-actionsheet>
  </div>
</template>

<script>
import Vue from "vue";
import {mapGetters,mapState} from 'vuex';
import {XProgress} from 'vux';
import cameraActionsheet from "../../common/cameraActionsheet";
import videoPlayer from "../../common/videoPlay"
export default {
  created () {
    this.$store.commit("SET_HEADER_RIGHT", this.rightOption);
  },
  mounted () {
    //获取宽高
    // this.screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    // this.screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  },
  destroyed(){
    this.$store.commit("SET_HEADER_RIGHT", {
                  option:{showMore: false},
                  rightContent:"",
                  action:function(){
                    return ;
                  }
              });
  },
  data() {
    return {
      isShow: false,
      videoUri:"",
      isUpload:false,
      precent: 0,
      menus: {
        video: "选择已有视频",
        takeVideo: "拍摄10s视频"
      },
      videoSrc:"",
      videoOptions:{
        playStatus:"autoplay",
        muteStatus:true,
        height:"280",
        width:"100%"
      },
      rightOption:{
           option:{showMore: false},
           rightContent:"更改视频",
           action:this.showCamera
      }
    };
  },
  computed: {
    ...mapGetters({
      user:"getUser"
    }),
    ...mapState({
      config: state => state.config
    })
  },
  methods: {
    showCamera() {
      this.isShow = true;
    },
    cameraSuccess(files) {
      let file = "";
      if(files[0].fullPath)
      {
        file = files[0].fullPath;
      }
      else
      {
        file = "file://"+files;
      }
      this.videoUri = file;
      //上传视频
      this.uploadVideo();
    },
    cameraError(message) {
       // 显示
      this.$vux.alert.show({
        title: "提示",
        content: message,
        type:"warn"
      });
    },
    //上传视频
    uploadVideo() {
      this.isUpload = true;
      //获取签名的id
      let urlConfig = this.config.url;
      let signatureUrl = urlConfig.base + urlConfig.imageSignature;
      //七牛图床实现
      let body = {
          accessToken: this.user.accessToken,
          type: "video",
          cloud:"qiniu"
        };    
      let param = {
        api: signatureUrl,
        body: body,
        cb: this.cbSignature
      };
      this.$store.dispatch("getSignature", param);
    },
    cbSignature(data){
     if (data.success) {
         let signature = data.obj.signature;
         let imageURL = this.config.qiniu.upload;
         let key = data.obj.key;

         //七牛上传
          let options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = key;
          options.mimeType = "video/mp4";
          var params = {};
          params.key = key;
          params.token = signature;
          options.params = params;

          let ft = new FileTransfer();
          ft.onprogress = this.onUploading;
          ft.upload(this.videoUri, encodeURI(imageURL), this.cbuploadVideo, this.cbuploadVideoFail, options);
      }
      else
      {
        this.$vux.toast.show({
            text:data.obj.errorMsg,
            type:"warn"
        })
      }
    },
    onUploading(progressEvent){
      if (progressEvent.lengthComputable) {
          let that = this;
          let loaded = progressEvent.loaded,
            total = progressEvent.total;
          that.$nextTick(() => {
            that.precent = Math.round(loaded / total * 100);
          });
      }
    },
    cbuploadVideo(data){
      data = JSON.parse(data.response);
      
      this.videoSrc = this.config.qiniu.fileUrl + "/" +data.key;
      this.isUpload = false;
      this.precent = 0;
    },
    cbuploadVideoFail(error){
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }

  },
  components: {
    cameraActionsheet,
    XProgress,
    videoPlayer
  }
};
</script>

<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
body{
  background-color:#fff;
}

.recordBox{
  display: flex;
  margin: 85px 30px 30px 30px;
  padding: 25px;
  border:1px solid #ee735c; 
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
}
.recordIcon{
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    .Dogrecording{
      font-size: 30px;
      align-items: flex-end;
      padding-bottom:20px; 
    }
    .Dog{
      font-size:80px;
    }
}
.recordTitle{
  font-size: 18px;
}
.recordDesc{
  font-size: 14px;
  color:#999;
}

.videoBox{
  position: relative;
  width:100%;
  height: 280px;
  .loadvideo{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction:column;
      width: 100%;
      height: 280px;
      .doglook{
        font-size: 80px;
        width: 80px;
        height: 100px;
        padding: 0;
        margin: 0;
      }
      .loading{
        font-size: 30px;
        width: 30px;
        height: 30px;
        padding: 0;
        margin: 0;
      }
  }
  .progressBox{
    position: absolute;
    background:rgba(244,244,244,0.65);
    bottom: 0;
    left: 0;
    width: 100%;
    .tips{
      width: 100%;
      height: 25px;
      font-size: 14px;
      text-align: center;
      line-height: 25px;
    }
  }
}

</style>
