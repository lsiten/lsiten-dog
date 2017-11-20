/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:37 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-15 17:03:51
 */
<template>
  <div class="index">
      <scroller 
            lock-x 
            use-pulldown
            use-pullup
            :pulldown-config="pulldownConfig" 
            :pullup-config = "pullupConfig"
            @on-pulldown-loading = "refreshData"
            @on-pullup-loading = "onScrollBottom"
            ref="scrollerBottom">
            <div>
               <div class="card-list" v-for="item in videoLists" v-bind:key="item._id">
                    <video-row :item="item"></video-row>
               </div>
            </div>
           <load-more tip="loading"></load-more>
        </scroller>
  </div>
</template>

<script>
import { LoadMore, Scroller } from "vux";
import videoRow from "./videoRow"
import { mapState } from "vuex";
import axios from "axios";
import Mock from "mockjs";
import queryString from "query-string";
import store from "store";
export default {
  created() {
    this._initStore();
    this._getVideoLists(0,'down');
  },
  mounted() {
    this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({top : 0});
          this.$refs.scrollerBottom.donePulldown();
        });
  },
  methods: {
    //初始化本地存储
    _initStore() {
      store.set("nextPage", 1);
      store.set("total", 0);
    },
    _getVideoLists(page, type) {
      //设置正在获取
      this.onFetching = true;
      //获取视频数据列表
      let url = this.config.url.base + this.config.url.videoList;
      axios
        .get(
          url +
            "?" +
            queryString.stringify({ accessToken: "11dsdf", page: page })
        )
        .then(response => {
          response = Mock.mock(response.data);
          if (response.success) {
            if ("up" == type) {
              this.videoLists = this.videoLists.concat(response.data);
            }

            if ("down" == type) {
              this.videoLists = response.data;
            }

            store.set("total", response.total);
            store.set("nextPage", ++page);
            store.set("videoLists", this.videoLists);
          }
          this.onFetching = false;
          
        })
        .catch(error => {
          this.onFetching = false;
          let videoLists = store.get("videoLists");
          this.videoLists = videoLists ? videoLists : [];
          console.log(error);
        });
    },
    //判断是否有更多数据
    _hasMore() {
      return this.videoLists.length < store.get("total");
    },
    //上拉加载
    onScrollBottom() {
      if (!this._hasMore()) {
        this.$refs.scrollerBottom.reset();
        this.$refs.scrollerBottom.disablePullup();
        return;
      }
      if (this.onFetching) return;
      let nextPage = store.get("nextPage");
      if (!nextPage) {
        nextPage = 1;
        this._initStore();
      }
      this._getVideoLists(nextPage,'up');
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset();
        this.$refs.scrollerBottom.donePullup();
      });
    },
    //下拉刷新
    refreshData() {
      if (this.onFetching) {
        return;
      } else {
        this._initStore();
        this._getVideoLists(0,'down');
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({top : 0});
          this.$refs.scrollerBottom.donePulldown();
        });
      }
    }
  },
  data() {
    return {
      videoLists: [],
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