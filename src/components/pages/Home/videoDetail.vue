/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:53 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-14 15:43:51
 */
<template>
  <div style="height:100%;">
      <l-header style="margin-top:46px"></l-header>
      <div class="videoDetail">
            <video-player :src="videoSrc" :options="videoOptions"></video-player>
            <div class="infoBox">
                <img :src="video.author.avatar"/>
                <div class="descBox">
                   <p class="nickname">{{video.author.nickname}}</p>
                   <p class="title">{{video.title}}</p>
                </div>
            </div>
            <div class="commentArea">
                <textarea v-model="comentValue"  @focus="doComent" placeholder="敢不敢评论一下" ></textarea>
            </div>
            <div class="vux-1px-b comentTitle">
              <h5>精彩评论</h5>
            </div>
            <scroller 
                lock-x 
                @on-scroll-bottom = "onScrollBottom"
                ref="scrollerBottom"
                :scroll-bottom-offset=200>
                <div>
                    <div v-for="item in comentsLists" v-bind:key="item._id">
                      <div class="reply-infoBox">
                        <img :src="item.reply.avatar"/>
                        <div class="reply-descBox">
                          <p class="reply-nickname">{{item.reply.nickname}}</p>
                          <p class="reply-content">{{item.content}}</p>
                        </div>
                    </div>
                    </div>
                </div>
            </scroller>
      </div> 

      <!-- 弹出评论页 -->
      <div v-transfer-dom class="coment-from">
        <popup v-model="comentVisitable" position="bottom" height="100%">
            <div class="top">
                <span @click="_closeComent" class="vux-close" style="color:red;"></span>
            </div>
            <div class="dialog-commentArea">
              <group>
                <x-textarea style="margin-top:0" placeholder="敢不敢评论一下"  :max="200" :show-counter="true" v-model="comentValue"></x-textarea>
              </group>
              <div class="btn-sub">
              <x-button type="primary"  @click.native="submitComent" :show-loading="isSubmit">提交</x-button>
              </div>
            </div>
        </popup>
      </div>
  </div>
</template>

<script>
import {
  ViewBox,
  Scroller,
  TransferDom,
  Popup,
  XTextarea,
  Group,
  XButton
} from "vux";
import { mapState } from "vuex";
import axios from "axios";
import Mock from "mockjs";
import queryString from "query-string";
import store from "store";

import header from "../../common/header.vue";
import videoPlayer from "../../common/videoPlay";
export default {
  props: ["video"],
  directives: {
    TransferDom
  },
  created() {
    this.videoOptions.poster = this.video.thumb;
    this.videoSrc = this.video.video;
    this._initStore();
  },
  mounted() {
    this._getcomentsLists(0);
  },
  components: {
    ViewBox,
    Scroller,
    Popup,
    XTextarea,
    Group,
    XButton,
    "l-header": header,
    videoPlayer
  },
  methods: {
    _toBack() {
      this.$router.go(-1);
    },
    //提交评论
    submitComent() {
      let that = this;
      if (!this.comentValue){
           // 显示提示信息
          this.$vux.alert.show({
            title: "提示",
            content: "<span style='color:red'>评论内容不能为空！</span>",
            buttonText:"我知道了",
            onHide:function(){
              that.isSubmit = false;
            }
          });
      }
      if (this.isSubmit)
      {
        return;
      }
      this.isSubmit = true;
      let content = this.comentValue;
      let url = this.config.url.base + this.config.url.subComent;
      axios.post(url,{
        vid:this.video._id,
         content:content,
         accessToken:"11sk;ldfk"
      })
      .then((response)=>{
        response = Mock.mock(response).data;
        if (response.success){
          let item = {
            reply:{
              nickname:"狗狗说",
              avatar:"http://dummyimage.com/600x600/f28079)"
            },
            content:"这个app太好拉！"
          };
          this.comentsLists.unshift(item);
          this.comentValue = "";
          let total = store.get("comentTotal")+1;
          store.set("comentTotal", total);
          that._closeComent();
        }
        this.isSubmit = false;
        // 评论成功
        this.$vux.toast.text('评论成功', 'bottom');
      })
      .catch((err)=>{
        console.log(err);
        this.isSubmit = false;
         // 显示提示信息
          this.$vux.alert.show({
            title: "提示",
            content: "<span style='color:red'>评论失败，请稍后再试</span>",
            buttonText:"我知道了"
          });
      })
     
    },
    //关闭弹框
    _closeComent() {
      this.comentVisitable = false;
    },
    //评论功能
    doComent() {
      this.comentVisitable = true;
    },
    //初始化本地存储
    _initStore() {
      store.set("comentNextPage", 1);
      store.set("comentTotal", 0);
    },
    _getcomentsLists(page) {
      //设置正在获取
      this.onFetching = true;
      //获取视频数据列表
      let url = this.config.url.base + this.config.url.coment;
      let id = this.video._id;
      axios
        .get(
          url +
            "?" +
            queryString.stringify({
              accessToken: "11dsdf",
              page: page,
              vid: id
            })
        )
        .then(response => {
          response = Mock.mock(response);
          this.comentsLists = this.comentsLists.concat(response.data.data);
          store.set("comentTotal", response.data.total);
          store.set("comentNextPage", ++page);
          store.set("comentsLists", this.comentsLists);
          this.onFetching = false;
        })
        .catch(error => {
          this.onFetching = false;
          let comentsLists = store.get("comentsLists");
          this.comentsLists = comentsLists ? comentsLists : [];
          console.log(error);
        });
    },
    //判断是否有更多数据
    _hasMore() {
      return this.comentsLists.length < store.get("total");
    },
    //上拉加载
    onScrollBottom() {
      if (!this._hasMore() || this.onFetching) {
        return;
      } else {
        let nextPage = store.get("comentNextPage");
        if (!nextPage) {
          nextPage = 1;
          this._initStore();
        }
        this._getcomentsLists(nextPage);
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        });
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      config: state => state.config
    })
  },
  data() {
    return {
      videoSrc:"",
      videoOptions:{
        playStatus:null,
        muteStatus:'',
        height:"280",
        width:"100%",
        poster:""
      },
      comentsLists: [],
      comentVisitable: false,
      comentValue: "",
      isSubmit: false
    }
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/close.less";
.infoBox {
  display: flex;
  background-color: #fff;
  img {
    width: 60px;
    height: 60px;
    margin: 10px;
    border-radius: 30px;
  }
  .descBox {
    flex: 1;
    .nickname {
      font-size: 18px;
      font-weight: bold;
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
}
.reply-infoBox {
  background-color: #fff;
  display: flex;
  img {
    width: 40px;
    height: 40px;
    margin: 10px;
    border-radius: 20px;
  }
  .reply-descBox {
    flex: 1;
    .reply-nickname {
      font-size: 18px;
      font-weight: bold;
    }
    .reply-content {
      font-size: 16px;
      color: #333;
    }
  }
}

.commentArea {
  background-color: #fff;
  height: 70px;
  padding: 10px 40px 10px 20px;
  textarea {
    padding: 10px;
    width: 100%;
    height: 50px;
    border-radius: 5px;
  }
}

.comentTitle {
  background-color: #fff;
  margin-bottom: 10px;
  h5 {
    padding: 10px 15px;
  }
}

.coment-from {
  .top {
    width: 100%;
    padding: 10px 0;
    text-align: center;
  }
  .dialog-commentArea {
    background-color: #fff;
    margin-top: -1.4em;
  }
  .btn-sub {
    margin-top: 15px;
  }
}
</style>