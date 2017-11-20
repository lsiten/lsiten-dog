/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:31:23 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-17 15:33:59
 */
<template>
  <div>
    <l-header></l-header>
     <view-box body-padding-top="46px" body-padding-bottom="55px">
        <transition>
          <router-view></router-view>
        </transition>
     </view-box>
    <l-footer></l-footer>
  </div>
</template>

<script>
  import { ViewBox } from 'vux';
  import header from '../common/header.vue';
  import footer from '../common/footer.vue';
  import {mapGetters} from 'vuex'
  import store from "store";
  export default {
    components: {
      'l-header':header,
      'l-footer':footer,
      ViewBox
    },
    computed: {
      ...mapGetters({
        user:"getUser"
      })
    },
    created () {
      let user = this.user || {};
      if(!user.accessToken)
      {
        this.$router.push({name:"login"});
      }
    }
  }
</script>

<style>

</style>