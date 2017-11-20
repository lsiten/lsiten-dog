/*
 * @Author: lsiten 
 * @Date: 2017-11-13 11:30:59 
 * @Last Modified by: lsiten
 * @Last Modified time: 2017-11-13 13:03:59
 */
<template>
  <div>
         <card>
            <div slot="header">
                <p class="header">{{item.title}}</p>
            </div>
             <div slot="content" class="content" @click="goDetail(item)">
                <img class="thumb" :src="item.thumb"/>
                <span class="video-play">
                    <svg class="icon" aria-hidden="true" slot="icon">
                         <use xlink:href="#dog-play-outline"></use>
                    </svg>
                </span>
             </div>
              <div slot="footer" class="footer">
                    <flexbox orient="Honrizontal" :gutter="0">
                        <flexbox-item>
                            <div class="like">
                              <svg class="icon" aria-hidden="true" slot="icon" @click="like" v-if="item.isLike == 0">
                                  <use xlink:href="#dog-xihuan1"></use>
                              </svg>
                              <svg class="icon" aria-hidden="true" slot="icon" @click="like" v-if="item.isLike == 1">
                                  <use xlink:href="#dog-xihuan"></use>
                              </svg>
                              <span class="label"  @click="like(item)">喜欢</span>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div class="comment" @click="comment(item)">
                              <svg class="icon" aria-hidden="true" slot="icon">
                                  <use xlink:href="#dog-pinglun"></use>
                              </svg>
                              <span class="label">评论</span>
                            </div>
                        </flexbox-item>
                   </flexbox>
                </div>
            </card>
  </div>
</template>
<script>
import { Card, Flexbox, FlexboxItem } from "vux";
import { mapState } from "vuex";
import axios from "axios";
import Mock from "mockjs";
import queryString from "query-string";
export default {
  props: ["item"],
  methods: {
    //点赞功能
    like() {
      let url = this.config.url.base + this.config.url.like;
      let isLike = 0 == this.item.isLike ? 1 : 0;
      axios
        .get(
          url +
            "?" +
            queryString.stringify({ accessToken: "11dsdf", isLike: isLike })
        )
        .then(response => {
          response = Mock.mock(response);
          if (response.data.success) {
            this.item.isLike = isLike;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 视频详情页
    goDetail(row){
      this.$router.push({name:'videoDetail',params:{video:row}});
    },
    // 评论功能，唤出评论页
    comment(row){

    }
  },
  components: {
    Card,
    Flexbox,
    FlexboxItem
  },
  computed: {
    ...mapState({
      config: state => state.config,
      route: state => state.route
    })
  }
};
</script>
<style lang="less" scoped>
.icon {
  font-size: 20px;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.header {
  padding: 15px 10px;
}
.content {
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
  .video-play {
    width: 2em;
    height: 2em;
    border: 1px solid #dbdbdb;
    position: absolute;
    z-index: 9;
    bottom: 15px;
    right: 15px;
    text-align: center;
    line-height: 2em;
    border-radius: 50%;
  }
}

.footer {
  padding: 15px 0;
  .like,
  .comment {
    text-align: center;
    color: #a5a2a2;
    span {
      padding: 0 5px;
    }
  }
}
</style>
