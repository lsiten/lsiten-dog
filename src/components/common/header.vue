<template>
<div class="header">
  <x-header slot="header"
    :left-options="leftOptions"
    :right-options="rightOptions"
    :title="websiteTitle"
    :transition="headerTransition"
    @on-click-back = "clickBack"
    style="background-color:#F67252;width:100%;position:absolute;left:0;top:0;z-index:100;">
  </x-header>
</div>
</template>

<script>
import { XHeader } from 'vux';
import {mapState,mapMutations} from 'vuex';
export default {
  methods: {
    ...mapMutations(['updateDrawerVisibility']),
    clickBack(){
      let from = this.route.from;
      if (/\/http/.test(from.path)) {
        let url = from.path.split('http')[1];
        window.location.href = `http${url}`;
      } else {
        let backUrl = {name:from.name,params:from.params};
        this.$router.replace(backUrl);
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      direction: state => state.direction,
      drawerVisibility: state => state.drawerVisibility,
      websiteTitle: state => state.websiteTitle
    }),
    websiteTitle () {
      if (this.route.path === '/') return '首页'
      if (this.route.path === '/record') return '录制'
      if (this.route.path === '/user') return '我的'
      if (this.route.name === 'videoDetail') return '视频详情'
      if (this.route.name === 'error') return '页面错误'
      return '首页'
    },
    leftOptions () {
      return {
        showBack: this.route.path !== '/',
        preventGoBack:true
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    }
  },
  components:{
    XHeader
  }
}
</script>

<style>
</style>
