/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:37 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 17:03:51
 */
<template>
  <div class="index">
      <scroller
            height="-40"
            lock-x 
            use-pulldown
            use-pullup
            :pulldown-config="pulldownConfig" 
            :pullup-config = "pullupConfig"
            @on-pulldown-loading = "refreshData"
            @on-pullup-loading = "onScrollBottom"
            ref="scrollerBottom">
            <div>
               <div class="card-list" v-for="item in videoLists" v-bind:key="item.id">
                    <video-row :item="item"></video-row>
               </div>
            </div>
           <load-more tip="loading" v-show="videoMore && onFetching"></load-more>
        </scroller>
  </div>
</template>

<script>
import { LoadMore, Scroller } from "vux";
import videoRow from "./videoRow"
import { mapState,mapGetters } from "vuex";
export default {
  created() {
    this._getVideoLists();
  },
  mounted() {
    this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({top : 0});
          this.$refs.scrollerBottom.donePulldown();
          this.onFetching = false;
     });
  },
  methods: {
    _getVideoLists() {
      //设置正在获取
      this.onFetching = true;
      //获取视频列表
      this.$store.dispatch("getVideolists");
    },
    //上拉加载
    onScrollBottom() {
      if(!this.videoMore)
      {
          this.$refs.scrollerBottom.reset();
          this.$refs.scrollerBottom.donePulldown();
      }
      if (this.onFetching) return;
      this._getVideoLists();
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset();
        this.$refs.scrollerBottom.donePullup();
        this.onFetching = false;
      });
    },
    //下拉刷新
    refreshData() {
      if (this.onFetching) {
        return;
      } else {
        //获取视频列表
        this.$store.dispatch("getVideolistsFresh");
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({top : 0});
          this.$refs.scrollerBottom.donePulldown();
          this.onFetching = false;
        });
      }
    }
  },
  data() {
    return {
      onFetching: false,
      pulldownConfig: {
        content: "下拉刷新",
        downContent: "下拉刷新",
        upContent: "释放刷新",
        loadingContent: "正在加载..."
      },
      pullupConfig: {
        upContent: " ",
        downContent: " ",
        loadingContent: " "
      }
    };
  },
  computed: {
    ...mapState({
      config: state => state.config
    }),
    ...mapGetters({
      videoLists:"getVideoList",
      videoMore:"getVideoMore"
    })
  },
  components: {
    videoRow,
    Scroller,
    LoadMore
  }
};
</script>

<style lang="less" scoped>
.card-list {
  margin-top: 10px;
  &:first-child {
    margin: 0;
  }
}
</style>