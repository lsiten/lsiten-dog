/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:47 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 23:35:03
 */
<template>
  <div class="record">
    <button @click="checkCamera">点击测试</button>
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
import cameraActionsheet from "../../common/cameraActionsheet";
export default {
  data() {
    return {
      isShow: false,
      menus: {
        album: "相册",
        takePhoto: "拍照"
      }
    };
  },
  methods: {
    checkCamera() {
      this.isShow = true;
    },
    cameraSuccess(url) {
      // 显示
      this.$vux.alert.show({
        title: "提示",
        content: url
      });
    },
    cameraError(message) {}
  },
  components: {
    cameraActionsheet
  }
};
</script>

<style lang="css">

</style>
