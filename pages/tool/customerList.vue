<template>
	<view>
		<view class="cu-card" v-for="(item,index) in customerList" :key="index">
			<view class="cu-item">
				<view class="info">
					<view class="cu-avatar round" :style="'background-image:url('+item.userInfo.avatarUrl+')'"></view>
					<view class="uname">{{item.userInfo.uname}}</view>
				</view>
				<view class="sales">
					<text class="text">订单量：</text>
					{{item.sales}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerList: [],
				num: 0,
			};
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				this.getCustomerList();
			}else{
				uni.showToast({
					title:"您还未认证商家",
					icon:"none"
				})
				setTimeout(()=>{
					uni.switchTab({
						url:"../tabbar/data"
					})
				},1000)
			}
		},
		methods: {
			getCustomerList() {
				uni.request({
					url: this.prefix + "/getCustomerList",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.customerList = res.data.data
							console.log(this.customerList)
						} else {
							uni.showToast({
								title: "获取k客户异常",
								icon: "none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.cu-card{
		margin-bottom: -20upx;
		.cu-item{
			display: flex;
			justify-content: space-between;
			.info{
				display: flex;
				height: 100upx;
				.cu-avatar{
					margin: 10%;
				}
				.uname{
					margin-left: 2%;
					font-size: 30upx;
					font-weight: 800;
					line-height: 100upx;
				}
			}
			.sales{
				.text{
					font-size: 26upx;
					color: #333;
				}
				line-height: 100upx;
				font-size: 30upx;
				font-weight: 800;
				color: #f00;
				margin-right: 3%;
			}
		}
	}
	
</style>
