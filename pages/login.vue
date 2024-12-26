<template>
  <view class="normal-login-container relative">
	<image class="left-bg login-bg" src="@/static/images/login/left-bg.png"></image>
	<image class="right-bg login-bg" src="@/static/images/login/right-bg.png"></image>
	<view class="login-header">
		<view class="title-name">HI，欢迎登录饭军师CRM系统</view>
	</view>
    <view class="login-form">
    	<view class="input-item">
			<view class="input-title">
				<image class="phone-icon fjs-m-r-14" src="@/static/images/login/phone-icon.png"></image>
				用户名/手机号
			</view>
			<view class="input-container">
				<u--input
					type="text"
					v-model="loginForm.username"
				    placeholder="请输入您的用户名/手机号"
				    border="bottom"
				    clearable
					:customStyle="{
						borderColor:'#ECECEC !important',
						paddingLeft: '0'
					}"
					:adjustPosition="false"
					:always-embed="true"
					always-system
				></u--input>
			</view>    		
    	</view>
    	<view class="input-item">
			<view class="input-title">
				<image class="password-icon fjs-m-r-14" src="@/static/images/login/password-icon.png"></image>
				密码
			</view>
			<view class="input-container">
				<u--input
					type="password"
					v-model="loginForm.password"
				    placeholder="请输入您的密码"
				    border="bottom"
					:customStyle="{
						borderColor:'#ECECEC !important',
						paddingLeft: '0'
					}"
					:adjustPosition="false"
					:always-embed="true"
					always-system
				></u--input>
			</view>		
    	</view>
		<view class="action-btn">
		  <button type="primary" plain @click="handleLogin" class="bg-ff9">立即登录</button>
		</view>
    </view>
	<image class="bottom-bg login-bg" src="@/static/images/login/bottom-bg.png"></image>
  </view>
</template>

<script>
  import { getCodeImg } from '@/api/login'

  export default {
    data() {
      return {
        codeUrl: "",
        captchaEnabled: true,
        // 用户注册开关
        register: false,
        globalConfig: getApp().globalData.config,
        loginForm: {
          username: "",
          password: "",
        }
      }
    },
    created() {
		
    },
    methods: {
      // 用户注册
      handleUserRegister() {
        this.$tab.redirectTo(`/pages/register`)
      },
      // 登录方法
      async handleLogin() {
        if (this.loginForm.username === "") {
          this.$modal.msgError("请输入您的账号")
        } else if (this.loginForm.password === "") {
          this.$modal.msgError("请输入您的密码")
        } else if (this.loginForm.code === "" && this.captchaEnabled) {
          this.$modal.msgError("请输入验证码")
        } else {
          this.$modal.loading("登录中，请耐心等待...")
          this.pwdLogin()
        }
      },
      // 密码登录
      async pwdLogin() {
		try {
			await this.$store.dispatch('Login', this.loginForm)
			this.$modal.closeLoading()
			this.loginSuccess()
		} catch(e) {
			// if (this.captchaEnabled) {
			//   this.getCode()
			// }
		}
      },
      // 登录成功后，处理函数
      loginSuccess(result) {
        // 设置用户信息
		this.$store.dispatch('GetDictData')
        this.$store.dispatch('GetInfo').then(res => {
          this.$tab.reLaunch('/pages/index/index')
        })
      }
    }
  }
</script>

<style lang="scss">
  .normal-login-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	background-color: #fff;
	.login-bg {
		display: block;
		position: absolute;
		z-index: 0;
	}
	.left-bg {
		left:0;
		width: 83%;
		height: 328rpx;
	}
	.right-bg {
		right:0;
		width: 340rpx;
		height: 480rpx;
	}
	.bottom-bg {
		position: fixed;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 638rpx;
	}
	.login-header {
		padding: 114rpx 0 112rpx 50rpx;
		color: #fff;
		position: relative;
		z-index: 1;
		letter-spacing: 2rpx;
		.title-name {
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
			z-index: 1;
		}
	}
	.login-form {
		padding: 0 50rpx;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		flex: 1 0 auto;
		position: relative;
		z-index: 1;
		.input-item {
			padding-bottom: 22rpx;
			margin-top: 46rpx;
			.input-title {
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				display: flex;
				align-items: center;
				padding-bottom: 24rpx;
				.phone-icon {
					width: 22rpx;
					height: 32rpx;
				}
				.password-icon {
					width: 26rpx;
					height: 28rpx;
				}
			}
			.input-container {
				flex: 1;
				input {
					font-size: 28rpx;
					color: #333;
					padding-right: 10rpx;
				}
			}
		}
	}
	.action-btn {
		margin-top: 146rpx;
		button {
			height: 82rpx;
			border-radius: 16rpx;
			color: #fff;
			font-size: 32rpx;
			width: 550rpx;
			background: #FF920F;
			box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(150,83,5,0.15);
			border-radius: 42rpx;
			border: none;
		}
	}
  }

</style>
