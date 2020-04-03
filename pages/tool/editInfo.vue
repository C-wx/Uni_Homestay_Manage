<template>
	<view class="container">
		<!-- 头部占位 -->
		<view class="center_top">
			<view class="mask"></view>
		</view>
		<view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					请上传头像
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="姓名" v-model="merInfo.mname"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">联系电话</view>
				<input placeholder="请输入联系电话" v-model="merInfo.mphone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">个人介绍</view>
				<textarea maxlength="-1" v-model="merInfo.mdesc" placeholder="请输入申请说明"></textarea>
			</view>

			<view class="cu-form-group margin-top">
				<text style="font-size: 24upx;color: #f00;">以下为不可修改信息，若要修改请联系管理员</text>
			</view>
			<view class="cu-form-group">
				<view class="title">账号:</view>
				<text>{{merInfo.maccount}}</text>
			</view>
			<view class="cu-form-group">
				<view class="title">身份证号码:</view>
				<text>{{merInfo.apply.mcardno}}</text>
			</view>
			<view class="cu-form-group">
				<view class="title">住址:</view>
				<text>{{merInfo.apply.maddr}}</text>
			</view>
			<view class="margin-tb-xl">
				<button class="cu-btn bg-brown" style="width: 100%;" @tap="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [],
				merInfo: {}
			};
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				uni.getStorage({
					key: "LOGIN_MERCHANT",
					success: (res) => {
						this.merInfo = res.data;
						this.imgList.push(this.merInfo.avatarUrl)
					}
				})
			}else{
				uni.showToast({
					title:"您还未认证商家",
					icon:"none"
				})
				setTimeout(()=>{
					uni.switchTab({
						url:"../tabbar/user"
					})
				},1000)
			}
		},
		methods: {
			ChooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						let file = res.tempFilePaths;
						this.imgList = file;
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '确认删除吗',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			submit() {
				uni.showLoading({
					title: "提交中"
				})
				console.log(this.imgList[0].indexOf('tmp'))
				if (this.imgList[0].indexOf('tmp') < 0) {
					uni.request({
						url: this.prefix + "/doEditInfo",
						data: {
							id: this.merInfo.id,
							mname: this.merInfo.mname,
							mphone: this.merInfo.mphone,
							mdesc: this.merInfo.mdesc
						},
						success: (res) => {
							if (res.data.code === 200) {
								setTimeout(() => {
									uni.hideLoading();
									uni.showToast({
										title: "修改成功",
										icon: "success"
									});
								}, 800)
								setTimeout(() => {
									uni.setStorageSync("LOGIN_MERCHANT", res.data.data)
									uni.reLaunch({
										url: "../tabbar/user"
									})
								}, 1600)
							} else {
								uni.showToast({
									title: "修改信息异常",
									icon: "none"
								})
							}
						}
					})
				} else {
					uni.uploadFile({
						url: this.prefix + "/doEditInfo",
						filePath: this.imgList[0],
						name: 'file',
						header: {
							"Content-Type": "multipart/form-data"
						},
						formData: {
							id: this.merInfo.id,
							mname: this.merInfo.mname,
							mphone: this.merInfo.mphone,
							mdesc: this.merInfo.mdesc
						},
						success: (res) => {
							if (res.data.code === 200) {
								setTimeout(() => {
									uni.hideLoading();
									uni.showToast({
										title: "修改成功",
										icon: "success"
									});
								}, 800)
								setTimeout(() => {
									uni.setStorageSync("LOGIN_MERCHANT", res.data.data)
									uni.reLaunch({
										url: "../tabbar/user"
									})
								}, 1600)
							} else {
								uni.showToast({
									title: "修改信息异常",
									icon: "none"
								})
							}
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.cu-dialog {
		margin-left: 5%;
	}

	.container {
		height: 100%;

		.center_top {
			height: 240upx;
			background: url('../../static/imgs/bg.jpg') no-repeat 0% 50%;
		}

		.pass {
			width: 70%;
			margin: 0 auto;
			font-size: 36upx;
			font-weight: 800;

			.head {
				margin: 10upx;
			}

			.title {
				margin: 10upx;
				display: inline-block;
			}
		}

		.fail {
			text-align: center;
			font-size: 36upx;
			font-weight: 800;

			.title {
				margin: 10upx;
				font-size: 32upx;
			}

			.reason {
				margin: 10upx;
				font-size: 32upx;
				font-weight: 400;
				color: red;
				display: inline-block;
			}

			.reApply {
				margin: 10upx;
				font-size: 28upx;
				color: #3a707f;
			}
		}

		.wait {
			width: 90%;
			margin: 40upx auto;
			font-size: 36upx;
			font-weight: 800;
		}
	}

	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
