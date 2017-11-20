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
    }
  }
};
</script>
<style lang="less" scoped>

</style>
