/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:47 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 23:35:03
 */
<template>
  <div class="record">
    <my-video :sources="videoCongfig.sources" :options="videoCongfig.options" v-show="videoCongfig.sources[0].src"></my-video>
    <div class="recordBox" @click="showCamera" v-show="!videoCongfig.sources[0].src">
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
import myVideo from 'vue-video';
import cameraActionsheet from "../../common/cameraActionsheet";
console.log(myVideo);
export default {
  created(){
    console.log(window);
    console.log(cordova);
  },
  data() {
    return {
      isShow: false,
      menus: {
        video: "选择已有视频",
        takeVideo: "拍摄10s视频"
      },
      videoCongfig: {
        sources: [{
            src: '',
            type: 'video/mp4'
           }],
        options: {
            autoplay: true,
            volume: 0.6,
            poster: ''
          }
      }
    };
  },
  methods: {
    showCamera() {
      this.isShow = true;
    },
    cameraSuccess(files) {
      //相册
     // /storage/emulated/0/tencent/MicroMsg/WeiXin/wx_camera_1499468951109.mp4
     //录制
    //  [MediaFile]
    //   0: MediaFile
    //   end: 0
    //   fullPath: "file:///storage/emulated/0/DCIM/Video/V71123-171743.mp4"
    //   lastModified: null
    //   lastModifiedDate: 1511428674000
    //   localURL: "cdvfile://localhost/sdcard/DCIM/Video/V71123-171743.mp4"
    //   name: "V71123-171743.mp4"
    //   size: 11421408
    //   start: 0
    //   type: "video/ext-mp4"
    //   __proto__: utils.extend.F
    //   constructor: (name, localURL, type, lastModifiedDate, size)
    //   getFormatData: (successCallback, errorCallback)
    //   __proto__: File
    //   length: 1
    //   __proto__: Array[0]
      // 显示
    let url = "";
      if(files[0].fullPath)
      {
        url = files[0].localURL;
        this.videoCongfig.sources[0].src = url;
      }
      else
      {
        url = "file://"+files;
        let that = this;
        window.resolveLocalFileSystemURL(url,function(enter){
          url = enter.toInternalURL();
          that.videoCongfig.sources[0].src = url;
        })
      }
      // let options = {
      //       successCallback: function() {
      //         console.log("Video was closed without error.");
      //       },
      //       errorCallback: function(errMsg) {
      //         console.log("Error! " + errMsg);
      //       },
      //       orientation: 'landscape',
      //       shouldAutoClose: true,  // true(default)/false
      //       controls: true // true(default)/false. Used to hide controls on fullscreen
      //     };
      //     window.plugins.streamingMedia.playVideo(videoUrl, options);
    },
    cameraError(message) {
       // 显示
      this.$vux.alert.show({
        title: "提示",
        content: message,
        type:"warn"
      });
    }
  },
  components: {
    cameraActionsheet,
    myVideo
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

</style>
