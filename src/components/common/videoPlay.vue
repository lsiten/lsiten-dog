<template>
  <div>      
    <div class="video-play-box">
        <video ref="myvideo" :src="src" :muted="options.muteStatus" :poster="options.poster" :height="options.height" v-bind:style={width:options.width} preload="auto" @click="pauseVideo">
               your browser does not support the video tag
        </video>
        <div class="video-play-button" v-show="isLoaded && !isPlay">
            <div class="button-icon" @click="playVideo">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#dog-play-white-copy"></use>
                </svg>
            </div>
        </div>
        <div class="video-play-button" v-show="isLoaded && isPause">
            <div class="button-icon" @click="playVideo">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#dog-play-white-copy"></use>
                </svg>
            </div>
        </div>
        <div class="video-play-loading" v-show="!isLoaded">
            <div class="loading-icon" @click="playVideo">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#dog-jiazai"></use>
                </svg>
            </div>
        </div>
        <div class="video-play-progress">
        <div v-bind:style="{ width: screenW*precent/100 + 'px' }" class="video-play-progress-bar"></div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["src","options"],
  mounted () {
    this.screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.video = this.$refs.myvideo;
    let that = this;
    this.video.addEventListener('canplaythrough',function(){
        if(that.options.playStatus && "autoplay"==that.options.playStatus){
            that.playVideo();
        }
    });
    this.video.addEventListener('canplay', ()=>{
         this.isLoaded = true;
      })
    this.video.addEventListener('playing', ()=>{
      if(!this.duration){
          this.duration = this.video.duration;
        }
      this.$emit("playing");
    })
    this.video.addEventListener('pause', ()=>{
      this.$emit("pause");
    })
    this.video.addEventListener('waiting', ()=>{
      this.$emit("waiting");
    })
    
    this.video.addEventListener('play', ()=>{
      this.$emit("play");
    })
  },
  data(){
    return {
      video:null,
      screenW: 0,
      isPlay:false,
      isPause:false,
      precent: 0,
      duration: 0,
      isLoaded:false
    }
  },
  methods: {
    reloadvideo(){
      this.video.load();
    },
      //播放视频
    playVideo(){
      this.isPlay = true;
      this.isPause = false;
      this.video.play();
      if(!this.isPlay)
      {
        this.precent = 0;
        this.video.currentTime = 0;
      }
      this.video.addEventListener('durationchange', ()=>{
        console.log(this.video.duration+"durationchange");      
        this.duration = this.video.duration;
      })
      
      this.video.addEventListener('timeupdate', this.timeline)
      this.video.addEventListener('ended', (e) => {
            this.isPlay = false;
            this.isPause = false;
            this.precent = 100;
            this.$emit("videoEnd");
        })
    },
    pauseVideo(){
      this.isPause = true;
      this.video.pause();
    },
    timeline () {
        if(this.duration)
        {
          this.precent = Math.floor((this.video.currentTime / this.duration)*100)
          this.$emit("process",{precent:this.precent,currentTime:this.video.currentTime});
        }
    },
  }
}
</script>
<style lang="less" scoped>
.video-play-box{
  width: 100%;
  height: 280px;
  background: #000;
  position: relative;
  .video-play-button{
    position: absolute;
    top:0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width:100%;
    height: 280px;
    background: rgba(0, 0, 0, 0.65);
    .button-icon{
      font-size: 40px;
    }
  }

  .video-play-loading{
    position: absolute;
    top:0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width:100%;
    height: 280px;
    background: #000;
    .loading-icon{
      font-size: 40px;
    }
  }
  .video-play-progress{
    width: 100%;
    height: 2px;
    background: rgba(230, 230, 230, 0.5);
    position: absolute;
    bottom:0;
    left:0;
    .video-play-progress-bar{
      height: 2px;
      width: 0px;
      background: rgb(246, 114, 82);
    }
  }
}
</style>


