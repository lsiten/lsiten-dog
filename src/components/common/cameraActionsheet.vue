/*
 * @Author: lsiten 
 * @Date: 2017-11-15 16:23:18 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-16 16:15:56
 */
<template>
  <div>
      <actionsheet 
        v-model="isShow" 
        :menus="menus" 
        @on-click-menu="clickMenu" 
        show-cancel>
      </actionsheet>

  </div>
</template>
<script>
import Vue from "vue";
import { Actionsheet } from "vux";
import _ from "lodash";
export default {
  props: ["isShow", "menus", "imageOption"],
  components: {
    Actionsheet
  },
  data() {
    return {
      cordova: Vue.cordova
    };
  },
  watch: {
    isShow(val) {
      this.$emit("input", val); //触发 input 事件，并传入新值
    }
  },
  methods: {
    clickMenu(key) {
      let that = this;
      let option = {
        quality: 50,
        destinationType: this.cordova.camera.DestinationType.FILE_URI,
        sourceType: this.cordova.camera.PictureSourceType.SAVEDPHOTOALBUM,
        targetWidth: 640,
        targetHeight: 640
      };
      switch (key) {
        case "album":
          option.sourceType = this.cordova.camera.PictureSourceType.SAVEDPHOTOALBUM;
          break;
        case "takePhoto":
          option.sourceType = this.cordova.camera.PictureSourceType.CAMERA;
          option.allowEdit = true;
          break;
        case "video":
          option = {
                quality: 50,
                destinationType: this.cordova.camera.DestinationType.DATA_URL,
                sourceType: this.cordova.camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: 1
              };   
         break;
        case "takeVideo":
          this.captureVideo();
          return;
        break;
      }
      //扩展option
      if (this.imageOption) {
        option = _.assign(option, this.imageOption);
      }
      
      this.cordova.on("deviceready", () => {
        // your code here
        that.cordova.camera.getPicture(
          imageURI => {
            // 显示提示信息
            that.$emit("success", imageURI);
          },
          message => {
            // 显示提示信息
            that.$emit("error", message);
          },
          option
        );
      });
    },

    //录制视频
    captureVideo(){
      let that = this;
      this.cordova.on("deviceready", () => {
        //开始录像（最长录制时间：10秒）
        navigator.device.capture.captureVideo(function(mediaFiles){
          // 显示提示信息
          that.$emit("success", mediaFiles);
        }, function(error){
          // 显示提示信息
          that.$emit("error", error);
        }, {duration: 10});
      })
    }
  }
};
</script>
<style lang="less" scoped>

</style>
