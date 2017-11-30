/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:47 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 23:35:03
 */
<template>
  <div class="record">
    <div class="loading-box" v-show="isMerge || isUploadAudio">
      <div class="loading-box-content">
          <div class="loading-box-icon">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#dog-jiazai"></use>
                </svg>
          </div>
          <div class="loading-box-text">
                {{loadingTips}}
          </div>
      </div>
    </div>
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
            v-on:pause="onPause" 
            v-on:waiting="onWaiting"></video-player>
          <div class="progressBox" v-show="isRecording">
              <x-progress :percent="recordPrecent" :show-cancel="false"></x-progress>
              <p class="tips">正在录制声音{{recordPrecent}}%</p>
          </div>
          <div class="progressBox" v-show="disableRecord && !isRecording">
              <p class="tips">正在初始化录音设备...</p>
          </div>
          <div class="recording-btn-box">
              <div class="recording-btn-icon" :style="disableRecord?{background:'#c7c0bf'}:{}"  @click="doPrepareRecord">
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
          <div class="preview-video-box" v-show="isPreview">
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
      <div class="next-step" v-show="isPreview">
              <x-button plain style="border-radius:30px;" class="custom-primary-button" @click.native="dopublishModel">下一步</x-button>
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
     <!-- 弹出评论页 -->
      <div v-transfer-dom class="publish-from">
        <popup v-model="publishModel" position="bottom" height="100%">
            <div class="top">
                <span @click="_closePublishModel" class="vux-close" style="color:red;"></span>
            </div>
            <div class="dialog-PublishArea">
              <group>
                <x-textarea style="margin-top:0" placeholder="给狗狗一句宣言吧" v-model="videoTitle" :max="200" :show-counter="true"></x-textarea>
              </group>
              <div class="btn-sub">
              <x-button type="primary"  @click.native="publish" :show-loading="isPublish">提交</x-button>
              </div>
            </div>
        </popup>
      </div>
  </div>
</template>

<script>
import Vue from "vue";
import {mapGetters,mapState} from 'vuex';
import {XProgress,Countdown,XButton,Popup,TransferDom, XTextarea, Group} from 'vux';
import cameraActionsheet from "../../common/cameraActionsheet";
import videoPlayer from "../../common/videoPlay";
export default {
  directives: {
    TransferDom
  },
  created () {
    let that = this;
    this.cordova.on("deviceready", () => {
      that.media = new Media(this.audioName,this.recordSuccess,this.recordError);
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
      publishModel:false,
      isPublish:false,
      videoTitle:"",

      audioName:"videoRecord.wav",
      audioData:"",
      isUploadAudio:false,      
      isMerge:false,
      loadingTips:"",
      timestamp:"",
      media:null,
      recordPreload:3,
      recordText:"",
      disableRecord:true,
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
      video_public_id:"",
      qiniu_key:"",
      videoOptions:{
        playStatus:"autoplay",
        muteStatus:true,
        height:"280",
        width:"100%",
        poster:""
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
    dopublishModel(){
      this.publishModel = true;
    },
    publish(){
      if(this.isPublish)
      return ;
      this.isPublish = true;
      let title = this.videoTitle;
      if(!title)
      {
        this.isPublish = false;
        this.$vux.toast.show({
          text:"狗狗还没有宣言哟！",
          type:"warn"
        });
        return ;
      }
      let body = {
        title: title,
        qiniu_key: this.qiniu_key,
        accessToken:this.user.accessToken
      }
      let creationUrl = this.config.url.base + this.config.url.creation;
      let params = {
        api:creationUrl,
        body:body,
        cb:this.cbCreation
      };
      this.$store.dispatch("creation",params);
    },
    cbCreation(data){
      this.isPublish = false;
      if(data.success)
      {
        let that = this;
        this.videoTitle = "";
        this.initData();
        this._closePublishModel();
        this.$vux.toast.show({
            text:"视频创建成功",
            type:"success",
            onHide:()=>{
                that.$router.replace({ name: "index" });
            }
        });
      }
      else
      {
        this.$vux.toast.show({
          text:data.obj.errorMsg,
          type:"warn"
        });
      }
    },
    _closePublishModel(){
      this.publishModel = false;
    },
    PlayPreview(){
      this.isPreview = true;
      let that = this;
       that.$nextTick(()=>{
      let video = that.$refs.videoPlay;
        console.log(video.video.duration);
        video.reloadvideo();
        video.video.autoplay=true;
         video.playVideo(); 
       })
    },
    readAudioFile(isUpload){
          let that = this;
          resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
              dirEntry.getFile(that.audioName,{},function(fileEntry){
                  fileEntry.file(function(file){
                    //读取文件
                    let Reader = new FileReader();
                    Reader.onloadend = function(){
                      that.audioData = this.result;
                      if(isUpload)
                        that.uploadAudio();
                    }
                    Reader.readAsDataURL(file);
                  })
              })
            })
    },
    uploadAudio(){
      //获取签名的id
      let urlConfig = this.config.url;
      let signatureUrl = urlConfig.base + urlConfig.imageSignature;
      this.timestamp = Date.now();
      //cloudinary实现
      let body = {
          accessToken: this.user.accessToken,
          timestamp:this.timestamp,
          type: "audio",
          cloud:"cloudinary"
        }; 
      let param = {
        api: signatureUrl,
        body: body,
        cb: this.cbAudioSignature
      };
      this.$store.dispatch("getSignature", param);
    },
    cbAudioSignature(data){
      if (data.success) {
         let signature = data.obj.signature;
         let body = new FormData();
         let audioURL = "";
        //cloudinary上传
          let folder = data.obj.folder;
          let tags = data.obj.tags;
          let key = data.obj.key;
          body.append("folder", folder);
          body.append("signature", signature);
          body.append("timestamp", this.timestamp);
          body.append("tags", tags);
          body.append("public_id", key);
          body.append("api_key", this.config.cloudinary.api_key);
          body.append("resource_type", "video");
          body.append("file", this.audioData);
          audioURL = this.config.cloudinary.apiBase + this.config.cloudinary.audio;
          let param = {
          api: audioURL,
          body: body,
          header: {
            "Content-Type": "multipart/form-data"
          },
          cb: this.cbuploadAudeo,
          uploading: this.onAudioUploading
          };
          this.$store.dispatch("uploadFile", param);
      }
    },
    cbuploadAudeo(data){
      if(data.public_id)
      {
        this.isUploadAudio = false;
        this.isMerge = true;
        this.loadingTips = "正在合并视频音频...";
        //保存audio到数据库并且合并视频音频
        if(!this.video_public_id)
        {
          this.recorded = false;
          this.$vux.toast.show({
              text:"视频合并失败，请重新录音",
              type:"warn"
          })
        }
        let audio = {
          public_id:data.public_id,
          video_public_id:this.video_public_id,
          qiniu_key:this.qiniu_key
        };
        let MergeVideoURL = this.config.url.base + this.config.url.MergeVideo;
        let param = {
          api: MergeVideoURL,
          body: {
            accessToken: this.user.accessToken,
            audio:JSON.stringify(audio)
          },
          cb: this.cbMergeVideo,
        };
        try {
          this.$store.dispatch("MergeVideo", param);
        } catch (error) {
          console.log(error);
          this.recorded = false;
          this.$vux.toast.show({
              text:"录音上传失败，请重新录音",
              type:"warn"
          })
        }
      }
      else{
        this.recorded = false;
        this.$vux.toast.show({
            text:"录音上传失败，请重新录音",
            type:"warn"
        })
      }
      
    },
    onAudioUploading(progressEvent){
      return ;
    },
    cbMergeVideo(data){
      this.isMerge = false;
      this.loadingTips = "";
      if(data.success){
        this.videoSrc = this.config.qiniu.fileUrl + "/" +data.obj.video_key;
        this.videoOptions = {
                playStatus:"false",
                muteStatus:false,
                height:"280",
                width:"100%",
                poster: this.config.qiniu.fileUrl + "/" +data.obj.poster_key
        }
        this.$nextTick(()=>{
          this.$refs.videoPlay.reloadvideo();
        });
        this.isPreview = true;
      }
      else{
        this.recorded = false;
        this.$vux.toast.show({
            text:data.obj.errorMsg,
            type:"warn"
        })
      }
    },
    doPrepareRecord(){
      if(this.prepareRecord)
       return;
      if(this.disableRecord)
        return;
      this.prepareRecord = true;
      this.recorded = false;
    },
    preRecord(){
      this.recordText = "GO";
      this.recordPreload = 3;
      let that = this;
      setTimeout(() => {
        that.recordText = "";
        that.prepareRecord = false;
        that.isRecording = true;
        that.disableRecord = true;
        that.recordPrecent = 0;
        that.isPreview = false;
        that.videoOptions.muteStatus = true;
        that.$nextTick(()=>{
          let videoPlay = that.$refs.videoPlay;
          videoPlay.playVideo();
          // Record audio
          this.media.startRecord();
        })
      }, 1000);
    },
    endRecord(){
      if(this.disableRecord)
      {
        //播放完视频就允许开始录制
        this.disableRecord = false;
      }
      if(this.isRecording){
        this.isRecording = false;
        this.recordPrecent = 0;
        this.recorded = true;
        this.media.stopRecord();
        console.log("videoEnd");
      }
    },
    onPause(){
      console.log("onPause");
    },
    onPlay(){
      console.log("play");
    },
    onWaiting(){
      console.log("onWaiting");
      if(this.isRecording)         
        this.media.pauseRecord();
    },
    onPlaying(){
      console.log("onPlaying");      
      if(this.isRecording){
        this.media.resumeRecord();
      }
    },
    onVideoProcess(data){
      console.log("onVideoProcess");   
      console.log(data);   
      if(this.isRecording){
        this.recordPrecent = data.precent;
      }    
    },
    recordSuccess(){
      console.log("start recording");
      if(this.recorded)
      {
        this.isUploadAudio = true;
        this.loadingTips="正在上传音频...";
        this.readAudioFile(true);
      }
    },
    recordError(err){
      console.log("Error recording"+err);
    },
    initData(){
      this.audioData = "";
      this.recorded = false;
      this.recordPrecent =  0;
      this.isPreview = false;
      this.disableRecord = true;
      this.prepareRecord = false;
      this.isRecording = false;
      this.isPublish = false;
      this.isMerge = false;
      this.isUploadAudio = false;
      this.videoSrc = "";
      this.videoSrc= "";
      this.video_public_id= "";
      this.qiniu_key= "";
      this.videoOptions = {
            playStatus:"autoplay",
            muteStatus:true,
            height:"280",
            width:"100%",
            poster:""
          };
    },
    changeVideo(){
      this.isChangeVideo = true;
      this.showCamera();
    },
    showCamera() {
      this.isShow = true;
    },
    cameraSuccess(files) {
      this.initData();
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
       console.log(message);
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
        this.qiniu_key = data.obj.video.qiniu_key;
         let params = {
            api:this.config.url.base + this.config.url.saveCloudinaryInfo,
            body:{
              accessToken: this.user.accessToken,
              qiniu_key: this.qiniu_key,
              src:fileSrc
            },
            cb:(data)=>{
              this.video_public_id = data.obj.video.public_id;
            }
          };
         this.$store.dispatch("addCloudinaryVideoInfo",params);
      }
    }
  },
  components: {
    cameraActionsheet,
    XProgress,
    videoPlayer,
    Countdown,
    XButton,
    Popup,
    XTextarea,
    Group
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/close.less";
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
.record{
  position: relative;
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
    bottom: -26px;
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

.loading-box{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 310px;
  background: rgba(0,0,0,0.85);
  z-index: 99;
  top: 0;
  color: #fff;
  left: 0;
  .loading-box-icon{
    text-align: center;
    font-size: 50px;
  }
}

.custom-primary-button{
  border-radius: 30px!important;
  border-color: #ee735c!important;
  color: #ee735c!important;
  &:active {
    border-color: #ee735c!important;
    color: #ee735c!important;
    background-color: transparent;
  }
}
.next-step{
  margin-top:40px;
}
.publish-from {
  .top {
    width: 100%;
    padding: 10px 0;
    text-align: center;
  }
  .dialog-PublishArea {
    background-color: #fff;
    margin-top: -1.4em;
  }
  .btn-sub {
    margin-top: 15px;
  }
  }
</style>
