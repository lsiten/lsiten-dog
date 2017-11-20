<template>
<div class="footer">
  <tabbar  slot="bottom">
    <tabbar-item selected link="/" :selected="route.path === '/'">
      <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#dog-xiangji"></use>
      </svg>
      <span slot="label">首页</span>
    </tabbar-item>
    <tabbar-item show-dot link="/record" :selected="route.path === '/record'">
      <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#dog-jia"></use>
      </svg>
      <span slot="label">录制</span>
    </tabbar-item>
    <tabbar-item badge="5" link="/user" :selected="route.path === '/user'">
      <svg class="icon" aria-hidden="true" slot="icon">
          <use xlink:href="#dog-user"></use>
      </svg>
      <span slot="label">我</span>
    </tabbar-item>
  </tabbar>
</div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux';
import {mapState} from 'vuex';
export default {
  computed:{
    ...mapState({
      route: state => state.route,
      path: state => state.route.path
    })
  },
  components: {
    Tabbar,
    TabbarItem
  }
}
</script>

<style>
.footer .icon{
  font-size: 20px;
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
