<template>
  <div class="comentModel">
      <div v-transfer-dom class="coment-from">
        <popup v-model="visitabal" position="bottom" height="100%">
            <div class="top">
                <span @click="_closeComent" class="vux-close" style="color:red;"></span>
            </div>
            <div class="dialog-commentArea">
              <group>
                <x-textarea ref="comentArea" style="margin-top:0" placeholder="敢不敢评论一下"  :max="200" :show-counter="true" v-model="comentValue"></x-textarea>
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
import { mapState,mapGetters } from "vuex";
import {
  TransferDom,
  Popup,
  XTextarea,
  Group,
  XButton
} from "vux";
export default {
  props: ["visitabal","videoid"],
  directives: {
    TransferDom
  },
  components: {
    Popup,
    XTextarea,
    Group,
    XButton
  },
  computed: {
    ...mapState({
      config: state => state.config
    }),
    ...mapGetters({
      user:"getUser"
    })
  },
  watch: {
    visitabal(val){
        if(val)
        {
            this.$refs.comentArea.$el.getElementsByTagName("textarea")[0].focus();
        }
    }  
  },
  methods: {
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
        let params = {
            api:url,
            body:{
            vid:this.videoid,
            content:content,
            accessToken:this.user.accessToken
            },
            cb:this.cbSubComent
        }
        this.$store.dispatch("subComment",params);
      },
      cbSubComent(data){
            if(data.success)
            {
                this.$emit("comentSuccess",data.obj.item);
                this.comentValue = "";
                this._closeComent();
                this.isSubmit = false;
                this.$vux.toast.text('评论成功', 'bottom');
            }
            else
            {
                this.isSubmit = false;
                // 显示提示信息
                this.$vux.alert.show({
                title: "提示",
                content: "<span style='color:red'>"+data.obj.errorMsg+"</span>",
                buttonText:"我知道了"
                });
            }
       },
       //关闭弹框
       _closeComent() {
           this.$emit("closeModel");
       }
  },
  data(){
      return {
        comentValue: "",
        isSubmit: false 
      }
  }
}
</script>
<style lang="less" scoped>
@import "~vux/src/styles/close.less";
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

