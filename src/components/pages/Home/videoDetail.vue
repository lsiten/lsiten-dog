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
                <textarea ref="comentButton" @focus="doComent" placeholder="敢不敢评论一下" ></textarea>
            </div>
            <div class="vux-1px-b comentTitle">
              <h5>精彩评论</h5>
            </div>
            <scroller
                height="-500"
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
      <coment-model :videoid="video.id" :visitabal="comentVisitable" @closeModel="_closeComent" @comentSuccess="cbcoment">
      </coment-model>
  </div>
</template>

<script>
import {
  ViewBox,
  Scroller
} from "vux";
import { mapState,mapGetters } from "vuex";

import header from "../../common/header.vue";
import videoPlayer from "../../common/videoPlay";
import comentModel from "./Comentmodel";
export default {
  props: ["video"],
  created() {
    this.videoOptions.poster = this.video.thumb;
    this.videoSrc = this.video.video;
     this._getcomentsLists();
  },
  mounted() {
    this.screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({top : 0});
          this.onFetching = false;
     });
  },
  components: {
    ViewBox,
    Scroller,
    "l-header": header,
    videoPlayer,
    comentModel
  },
  methods: {
    _toBack() {
      this.$router.go(-1);
    },
    //评论功能
    doComent() {
      this.$refs.comentButton.blur();
      this.comentVisitable = true;
    },
    cbcoment(item){
      this.comentsLists.unshift(item);
    },
    _closeComent(){
      this.comentVisitable = false;
    },
    _getcomentsLists() {
      //设置正在获取
      this.onFetching = true;
      //获取视频数据列表
      this.$store.dispatch("getComentLists",this.video.id);
    },
    //上拉加载
    onScrollBottom() {
      if(!this.hasMore)
      {
        this.$refs.scrollerBottom.reset();
        this.onFetching = false;
      }
      if (this.onFetching) {
        return;
      } else {
        this._getcomentsLists();
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
          this.onFetching = false;
        });
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
    }),
    ...mapGetters({
      comentsLists:"getComentList",
      hasMore:"getComentMore",
      user:"getUser"
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
      comentVisitable: false,
      screenH:0
    }
  }
};
</script>

<style lang="less" scoped>
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


</style>