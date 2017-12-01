/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:32:32 
 * @Last Modified by:   lsiten 
 * @Last Modified time: 2017-11-13 11:32:32 
 */
<template>
  <div id="app" style="height:100%">
     <transition
        @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
        :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
           <router-view></router-view>
     </transition>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex';
export default {
  name: 'app',
  computed: {
    ...mapState({
      direction: state => state.direction
    })
  },
  methods:{
    ...mapActions([
     'updateDemoPosition'
   ])
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
body {
  background-color: #e5e5e8;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.router-view {
  width: 100%;
  top: 46px;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
