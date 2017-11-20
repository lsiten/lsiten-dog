<template>
    <div class="login">
        <div class="header">
            快速登陆
        </div>
        <div class="conent">
            <group>
                <x-input type="tel" ref="phoneNumber" required placeholder="输入手机号" is-type="china-mobile" v-model="phoneNumber" class="input"></x-input>
                <x-input v-show="isVerify || step==2" type="number" ref="code" placeholder="输入验证码"  v-model="verifyCode" class="input" :show-clear="false">
                    <div slot="right" class="inputRight">
                        <div v-show="isVerify && step==2">
                            <countdown v-model="codeTime" @on-finish="countFinish" :start="isVerify"></countdown>s后重新获取
                        </div>
                        <div v-show="!isVerify && step==2" @click="submitVerify">
                            <x-button  :mini="true" class="btn">
                                重新获取
                            </x-button>
                        </div>
                    </div>
                </x-input>
            </group>
            <div class="btn-box">
                <x-button  class="btn" @click.native="submitVerify" v-show="step==1">
                    获取验证码
                </x-button>
                <x-button :show-loading="isLogin" class="btn" @click.native="doLogin" v-show="step==2">
                   登陆
                </x-button>
            </div>
        </div>
         <toast></toast>
    </div>
</template>
<script>
import { XInput, XButton, Countdown, Toast, Group } from "vux";
import { mapState } from "vuex";
export default {
  components: {
    XInput,
    XButton,
    Countdown,
    Toast,
    Group
  },
  computed: {
    ...mapState({
      config: state => state.config
    })
  },
  data() {
    return {
      isVerify: false,
      isLogin: false,
      step: 1,
      phoneNumber: "",
      verifyCode: "",
      codeTime: 60
    };
  },
  methods: {
    //登陆操作
    doLogin() {
      if (
        !this.phoneNumber ||
        Object.keys(this.$refs.phoneNumber.errors).length > 0
      ) {
        this.$vux.toast.text("手机号格式不正确！", "middle");
        return;
      }
      if (!this.verifyCode || Object.keys(this.$refs.code.errors).length > 0) {
        this.$vux.toast.text("验证码不正确！", "middle");
        return;
      }
      this.isLogin = true;
      let params = {};
      params.api = this.config.url.base + this.config.url.doLogin;
      params.body = {
        phoneNumber: this.phoneNumber,
        verifyCode: this.verifyCode
      };
      params.doLogin = this.doLoginCallback;
      this.$store.dispatch("doLogin", params);
    },
    //获取验证码
    submitVerify() {
      if (
        !this.phoneNumber ||
        Object.keys(this.$refs.phoneNumber.errors).length > 0
      ) {
        this.$vux.toast.text("手机号格式不正确！", "middle");
        return;
      }
      this.isVerify = true;
      this.step = 2;
      let params = {};
      params.api = this.config.url.base + this.config.url.verifyCode;
      params.body = {
        phoneNumber: this.phoneNumber
      };
      params.getVerifyCode = this.getVerifyCode;
      this.$store.dispatch("getVerifyCode", params);
    },
    //doLogin
    doLoginCallback(data) {
        
      if (data.success) {
        this.isLogin = false;
        let that = this;
        this.$vux.toast.show({
            text:"登陆成功",
            type:"success",
            onHide:()=>{
                that.$router.replace({ name: "user" });
            }
        });
         this.$store.commit("UPDATE_USER_ALL", data.data); 
      }
    },
    //获取验证码回掉
    getVerifyCode(data) {
      console.log(data);
    },
    countFinish() {
      this.isVerify = false;
      this.codeTime = 60;
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: #faf9fa;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px;
  font-size: 18px;
}
.conent {
  margin-top: 10px;
}
.input {
  background: #fff;
}
.btn-box {
  padding: 10px;
}
.btn {
  margin-top: 10px;
  background: transparent;
  color: #bc3108;
  border: 1px solid #bc3108;
}
</style>

