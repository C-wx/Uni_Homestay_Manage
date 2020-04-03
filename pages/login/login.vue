<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/imgs/logo.png" mode=""></image>
		</view>
		<view class="uni-form-item uni-column">
			<input type="tel" class="uni-input" name="" placeholder="请输入账号" v-model="account" />
		</view>
		<view class="uni-form-item uni-column">
			<input type="password" class="uni-input" name="" placeholder="请输入密码" v-model="pwd"/>
		</view>
		<button type="primary" style="border-radius: 60upx;" @tap="doLogin">认证</button>
		<view class="links">
			<view @tap="gotoForgetPassword">忘记密码？</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account:null,
				pwd:null
			}
		},
		onLoad() {

		},
		methods: {
			doLogin(){
				uni.request({
					url:this.prefix + "/doLogin",
					data:{
						maccount: this.account,
						mpwd: this.pwd,
						loginType: "wxapp"
					},
					success: (res) => {
						if(res.data.code == 200){
							uni.showToast({
								title:"认证成功",
								icon:"none"
							})
							uni.setStorageSync("LOGIN_MERCHANT",res.data.data)
							setTimeout(()=>{
								uni.switchTab({
									url:"../tabbar/data"
								})
							},800)
						}else{
							uni.showToast({
								title:"认证失败",
								icon:"none"
							})
						}
					}
				})
			},
			gotoForgetPassword: function() {
				uni.navigateTo({
					url: 'forget-password'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #b49950;

	.content {
		padding: 100upx;
	}

	.logo {
		text-align: center;

		image {
			height: 200upx;
			width: 200upx;
			margin: 0 0 60upx;
		}
	}

	.uni-form-item {
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;

		.uni-input {
			font-family: 'Courier New', Courier, monospace;
			font-size: 30upx;
			height: 70upx;
			padding: 7px 0;
		}
	}

	button[type="primary"] {
		background-color: $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 60upx;
	}

	.links {
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}

		.link-highlight {
			color: $color-primary
		}
	}
</style>
