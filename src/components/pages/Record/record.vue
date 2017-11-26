/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:47 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 23:35:03
 */
<template>
  <div class="record">
    <div class="videoBox" v-show="isUpload || videoSrc">
        <div class="videoRecoding" v-show="videoSrc && !isChangeVideo">
          <video-player 
            ref="videoPlay" 
            :src="videoSrc"  
            :options="videoOptions" 
            v-on:videoEnd="endRecord" 
            v-on:process="onVideoProcess" 
            v-on:playing="onPlaying" 
            v-on:play="onPlay" 
            v-on:waiting="onWaiting"></video-player>
          <div class="progressBox" v-show="isRecording">
              <x-progress :percent="recordPrecent" :show-cancel="false"></x-progress>
              <p class="tips">正在录制声音{{recordPrecent}}%</p>
          </div>
          <div class="recording-btn-box">
              <div class="recording-btn-icon" :style="isRecording?{background:'#c7c0bf'}:{}"  @click="doPrepareRecord">
                <svg class="icon" aria-hidden="true" v-show="!prepareRecord && recorded">
                  <use xlink:href="#dog-zhongxin"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-show="!prepareRecord && !recorded">
                  <use xlink:href="#dog-record-white-copy"></use>
                </svg>
                <div class="count-down-text" v-show="prepareRecord">
                  <div>
                     {{recordText}}
                  </div>
                  <countdown v-model="recordPreload" @on-finish="preRecord" :start="prepareRecord"></countdown>
                </div>
              </div>
          </div>
          <div class="preview-video-box" v-show="!prepareRecord && recorded">
              <div class="preview-video"  @click="PlayPreview">
                 <svg class="icon" aria-hidden="true" >
                   <use xlink:href="#dog-yulan"></use>
                 </svg>
                 预览
             </div>
         </div>
        </div>
        <div class="loadvideo" v-show="!videoSrc || isChangeVideo && isUpload">
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
import {XProgress,Countdown} from 'vux';
import cameraActionsheet from "../../common/cameraActionsheet";
import videoPlayer from "../../common/videoPlay";
export default {
  created () {
    let that = this;
    this.cordova.on("deviceready", () => {
      that.media = new Media(this.audioName,this.recordSuccess,this.recordError,this.recordStatus);
    })
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
      cordova:Vue.cordova,
      audioName:"videoRecord.wav",
      media:null,
      recordPreload:3,
      recordText:"",
      prepareRecord:false,
      isRecording:false,
      recorded:false,
      recordPrecent: 0,
      isPreview:false,      

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
      isChangeVideo:false,
      rightOption:{
           option:{showMore: false},
           rightContent:"更改视频",
           action:this.changeVideo
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
    PlayPreview(){
      this.isPreview = true;
      this.$refs.videoPlay.playVideo();
      this.readReadFile();
    },
    readReadFile(){
          let that = this;
          resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
              dirEntry.getFile(that.audioName,{},function(fileEntry){
                  fileEntry.file(function(file){
                    //读取文件
                    let Reader = new FileReader();
                    Reader.onloadend = function(){
                      console.log("Successful file read"+this.result);

                    }
                    Reader.readAsDataURL(file);
    
                  })
              })
            })
    },
    doPrepareRecord(){
      if(this.prepareRecord)
       return;
      this.prepareRecord = true;
      this.recorded = false;
    },
    preRecord(){
      this.recordText = "GO";
      this.recordPreload = 3;
      let that = this;
      let videoPlay = this.$refs.videoPlay;
      setTimeout(() => {
        that.recordText = "";
        that.prepareRecord = false;
        that.isRecording = true;
        that.recordPrecent = 0;
        that.$nextTick(()=>{
          videoPlay.playVideo();
          // Record audio
          this.media.startRecord();
        })
      }, 1000);
    },
    endRecord(){
      if(this.isRecording){
        this.isRecording = false;
        this.recordPrecent = 0;
        this.recorded = true;
        this.media.stopRecord();
        console.log("videoEnd");
      }
      else if(this.isPreview)
      {
        this.media.stop();
      }
    },
    onPlay(){
      this.media.seekTo(0);
    },
    onWaiting(){
      this.media.pause();
    },
    onPlaying(){
      if(!this.isRecording){
        this.media.play();
        this.media.setVolume("1.0");
      }
    },
    onVideoProcess(present){
      this.recordPrecent = present;
    },
    recordSuccess(){
      console.log("start recording");
    },
    recordError(err){
      console.log("Error recording"+err);
    },
    recordStatus(option){
      if(Media.MEDIA_RUNNING==option)
      {
        this.media.getCurrentAmplitude(function(sec){
          console.log(sec)
        });
        console.log(this.media.getDuration());
      }
    },
    changeVideo(){
      this.isChangeVideo = true;
      this.showCamera();
    },
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
      //上传视频说明录制重新开始
      this.recorded = false;
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
      let dataString = data.response;
      data = JSON.parse(dataString);
      this.videoSrc = this.config.qiniu.fileUrl + "/" +data.key;
      this.isUpload = false;
      this.isChangeVideo = false;      
      this.precent = 0;
      this.$store.commit("SET_HEADER_RIGHT", this.rightOption);
      let params = {
        api:this.config.url.base + this.config.url.video,
        body:{
          accessToken: this.user.accessToken,
          video: dataString,
          videoSrc: this.videoSrc
        },
        cb:this.cbSaveVideoinfo
      };
      this.$store.dispatch("saveVideoInfo",params);
    },
    cbuploadVideoFail(error){
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    },
    cbSaveVideoinfo(data){
      if(data.success){
        let fileSrc = data.obj.video.src;
        let key = data.obj.video.qiniu_key;
         let params = {
            api:this.config.url.base + this.config.url.saveCloudinaryInfo,
            body:{
              accessToken: this.user.accessToken,
              qiniu_key: key,
              src:fileSrc
            },
            cb:(data)=>{ console.log(data)}
          };
         this.$store.dispatch("addCloudinaryVideoInfo",params);
      }
    }

  },
  components: {
    cameraActionsheet,
    XProgress,
    videoPlayer,
    Countdown
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
    background:#EBEBEB;
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
.videoRecoding{
  position: relative;
  .progressBox{
    position: absolute;
    background:#EBEBEB;
    bottom: -28px;
    left: 0;
    width: 100%;
    .tips{
      width: 100%;
      height: 25px;
      font-size: 14px;
      text-align: left;
      line-height: 25px;
    }
  }

  .recording-btn-box{
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: -28px;
    left: 0;
    .recording-btn-icon{
     background: #ee735c;
     width: 60px;
     height: 60px;
     border-radius: 30px;
     font-size: 40px;
     text-align: center;
    }
    .count-down-text{
      font-size: 25px;
      line-height: 60px;
      font-weight: bold;
      color: #fff;
      text-align: center;
    }
  }
}
.preview-video-box{
  position: absolute;
  width: 100%;
  height: 280px;
  left: 0;
  top: 0;
}
.preview-video{
  position: absolute;
  bottom: 65px;
  right: 10px;
  font-size: 16px;
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  background: #ee735c;
  text-align: center;
}
</style>
