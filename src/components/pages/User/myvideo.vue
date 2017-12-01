<template>
  <div class="myvideo">
      <scroller
            height="-40"
            lock-x 
            @on-scroll-bottom = "onScrollBottom"
            :scroll-bottom-offset=200
            ref="scrollerBottom">
            <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="1/2" v-for="item in videoLists" v-bind:key="item.id">
                    <div class="flex-box">
                    <div class="thumb">
                        <img :src="item.thumb">
                    </div>
                    <div class="play-button">
                        <div class="button" @click="goDetail(item)">
                            <svg class="icon" aria-hidden="true" slot="icon">
                                    <use xlink:href="#dog-play-outline"></use>
                                </svg>
                        </div>
                    </div>
                    </div>
                </flexbox-item>
            </flexbox>
            <load-more tip="loading" v-show="hasMore && onFetching"></load-more>
    </scroller>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, Scroller,LoadMore} from 'vux';
import { mapGetters } from "vuex";
export default {
    created () {
        this._getMyvideoLists();
        let backurl = {name:'user'};
        this.$store.dispatch("setBackurl",backurl);
    },
    destroyed () {
        this.$store.dispatch("setBackurl","");
    },
    data(){
        return {
        };
    },
    components: {
        Flexbox,
        FlexboxItem,
        Scroller,
        LoadMore
    },
    methods: {
        // 视频详情页
        goDetail(row){
          this.$router.push({name:'videoDetail',params:{video:row}});
        },
        _getMyvideoLists(){
            //设置正在获取
            this.onFetching = true;
            //获取视频数据列表
            this.$store.dispatch("getMyvideoLists",this.user.id);
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
            this._getMyvideoLists();
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset();
                this.onFetching = false;
            });
        }
        }
    },
    computed: {
        ...mapGetters({
            videoLists:"getMyvideoList",
            hasMore:"getMyvideoMore",
            user:"getUser"
        })
    }

}
</script>
<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .thumb{
        padding: 10px;
        position: relative;
        img{
            width:100%;
            max-height: 200px;
            border-radius: 5px;
        }
        .mask{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
        }
    }
    .play-button{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .button{
            width: 40px;
            height: 40px;
            border-radius: 20px;
            border:1px solid #fff;
            text-align: center;
            line-height: 40px;
            font-size: 20px;
        }
    }
}
</style>


