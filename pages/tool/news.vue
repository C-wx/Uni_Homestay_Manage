<template>
	<view>
		<view class="cu-card" v-for="(item,index) in bulletinList" :key="index"  @tap="toNews(item.id)">
			<view class="cu-item">
				<view class="newsInfo">
					<view class="newsTitle">
						<text class="cuIcon-edit"/>
						{{item.title}}
					</view>
					<view class="auditStatus">
						<text v-if="item.auditStatus == 'SA'">审核通过</text>
						<text v-if="item.auditStatus == 'FA'">审核未通过</text>
						<text v-if="item.auditStatus == 'WA'">待审核</text>
					</view>
				</view>
				<view class="summary">
					{{item.summary}}
				</view>
				<view class="showTime">
					<text class="text">
						发表时间：
					</text>
					<text class="time">
						{{formatTime(item.createTime)}}
					</text>
				</view>
				<view class="showTime">
					<text class="text">
						展示时间：
					</text>
					<text class="time">
						{{formatTime(item.beginTime)}} ~ {{formatTime(item.endTime)}}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bulletinList: [],
				num: 0,
			};
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				this.getSelfBulletin();
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
			getSelfBulletin() {
				uni.request({
					url: this.prefix + "/getNewsList",
					data: {
						merchantId: this.getMerchantInfo().id
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.bulletinList = res.data.data
							console.log(this.bulletinList)
						} else {
							uni.showToast({
								title: "获取资讯异常",
								icon: "none"
							})
						}
					}
				})
			},
			toNews(id){
				uni.navigateTo({
					url:"./newsDetail?id="+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.cu-card{
		margin-bottom: -20upx;
	}
	.newsInfo{
		display: flex;
		width:100%;
		padding:2%;
		justify-content: space-between;
		.newsTitle{
			letter-spacing: 5upx;
			font-size: 35upx;
			font-weight: 800;
			font-family: kaiti;
		}
		.auditStatus{
			color: #f00;
			font-size: 26upx;
		}
	}
	.summary{
		margin: 0 2% 2% 4%;
		font-size: 28upx;
	}
	.showTime{
		margin: 0 2% 2% 2%;
		.text{
			font-size: 22upx;
			color: #4292bd;
		}
		.time{
			font-size: 25upx;
			color: #aa5e47;
		}
	}
</style>
