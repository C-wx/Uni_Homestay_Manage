<template>
	<view class="container">
		<!-- 头部占位 -->
		<view class="center_top">
			<view class="mask"></view>
		</view>
		<!-- 用户信息 -->
		<view class="user" v-if="isLogin">
			<!-- 头像 -->
			<view class="left margin-lr-xl">
				<image :src="avatarUrl"></image>
			</view>
			<!-- 昵称-->
			<view class="right">
				<view class="username">{{nickName}}</view>
			</view>
		</view>
		<view class="user" v-if="!isLogin">
			<!-- 头像 -->
			<view class="left margin-lr-xl">
				<image src="../../static/imgs/user.png"></image>
			</view>
			<button class="right cu-btn block bg-cyan margin-lr-xl margin-tb-xl" type='primary' open-type="getUserInfo"
			 withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
				<text class="cuIcon-forward cuIconfont-spin margin-right-sm"></text>授权登录
			</button>
		</view>
		<view class="list-content">
			<view class="list"></view>
			<view class="list">
				<view class="li" @tap="toPage('login')" v-if="!isMerchant">
					<view class="icon">
						<text class="cuIcon-people"></text>
					</view>
					<view class="text">认证商家</view>
					<text class="cuIcon-right"></text>
				</view>
				<view class="li" @tap="toPage('edit')">
					<view class="icon">
						<text class="cuIcon-write"></text>
					</view>
					<view class="text">信息编辑</view>
					<text class="cuIcon-right"></text>
				</view>
				<view class="li" @tap="toPage('bulletin')">
					<view class="icon">
						<text class="cuIcon-text"></text>
					</view>
					<view class="text">我的资讯</view>
					<text class="cuIcon-right"></text>
				</view>
				<view class="li" @tap="toPage('kefu')">
					<view class="icon">
						<text class="cuIcon-dianhua"></text>
					</view>
					<view class="text">联系客服</view>
					<text class="cuIcon-right"></text>
				</view>
				<view class="li" @tap="toPage('logout')">
					<view class="icon">
						<text class="cuIcon-exit"></text>
					</view>
					<view class="text">退出登录</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isMerchant:false,
				isLogin: false,
				//个人信息
				nickName: null,
				avatarUrl: null,
			}
		},
		onShow() {
			var oid = this.getLoginStatus();
			var merchant = this.getMerchantInfo();
			if(merchant){
				this.isMerchant = true;
			}
			if (oid) {
				this.isLogin = true;
				this.nickName = uni.getStorageSync("nickName");
				this.avatarUrl = uni.getStorageSync("avatarUrl");
			}
		},
		methods: {
			toPage(row) {
				switch (row) {
					case "login":
						uni.navigateTo({
							url: "../login/login"
						})
						break;
					case "kefu":
						uni.makePhoneCall({
							phoneNumber: '17689400062'
						});
						break;
					case "edit":
						uni.navigateTo({
							url: "../tool/editInfo"
						})
						break;
					case "bulletin":
						uni.navigateTo({
							url: "../tool/news"
						})
						break;
					case "logout":
						uni.showModal({
							content: '确认退出吗？',
							success: (res) => {
								if (res.confirm) {
									uni.showToast({
										title: "退出成功",
										icon: "none"
									})
									setTimeout(() => {
										uni.removeStorageSync("LOGIN_MERCHANT");
										this.isMerchant = false;
									}, 500)

								}
							}
						});
						break;
				}
			},
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								uni.request({
									url: _this.prefix + "/getJscode2session",
									data: {
										js_code: loginRes.code,
										uname: nickName,
										avatarUrl: avatarUrl,
										appId: "wx4f95fe4f776749b2",
										secret: "ffd17322cb8d52d4096dad2e9078738c",
										loginType: "wxapp"
									},
									success: (res) => {
										let data = res.data
										if (data.code === 200) {
											console.log(data)
											uni.setStorageSync("oid", data.data.openId);
											uni.setStorageSync("nickName", data.data.uname);
											uni.setStorageSync("avatarUrl", data.data.avatarUrl);
											_this.modalName = null;
											_this.successModel = 'Modal';
											setTimeout(() => {
												_this.isLogin = true;
												_this.successModel = null;
												_this.nickName = nickName;
												_this.avatarUrl = avatarUrl;
											}, 500)
										} else {
											uni.showToast({
												title: res.data.msg,
												icon: "none"
											})
										}
									},
								})
							}
						})
					}
				});
			}
		}
	}
</script>
<style lang="scss">
	.cu-dialog {
		margin-left: 5%;
	}

	.successModel {
		margin-left: 20%;
		width: 500upx;
	}

	page {
		position: relative;
		background-color: #fff;
		height: 100%;
	}

	.container {
		height: 100%;

		.center_top {
			height: 28%;
			background: url('../../static/imgs/bg.jpg') no-repeat 0% 50%;
		}
	}

	.user {
		height: 25%;
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;
		position: relative;
		top: -80upx;
		display: flex;
		align-items: center;

		.left {
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20upx;
			border: solid 1upx #fff;
			border-radius: 30%;

			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}

		}

		.right {
			width: 50%;

			.username {
				margin-left: 20upx;
				font-weight: 800;
				font-size: 35upx;
			}

			.signature {
				color: #eee;
				font-size: 28upx;
			}
		}
	}

	.list-content {
		background: #fff;
	}

	.list {
		width: 100%;
		border-bottom: 15upx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: 1px solid rgb(243, 243, 243);
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				margin-left: 20upx;
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;
				align-items: center;
				justify-items: center;

				text {
					font-size: 40upx;
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666;
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}
	}
</style>
