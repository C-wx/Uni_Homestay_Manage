<template>
	<view class="index">
		<!-- 公告 -->
		<uni-notice-bar showIcon="true" scrollable="true" single="true" :text="bulletin" @tap="toBulletin"></uni-notice-bar>
		<view class="head">
			<img src="../../static/imgs/bg.jpg" alt="">
		</view>
		<view class="more">
			<view class='mo'>
				<view class='mo_01'>数据统计</view>
				<navigator url="/pages/statistic/statistic">
					<view class='mo_02'>更多 <text class="cuIcon-right" style="font-size: 30upx; color:#D6D6D6"></text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="shuju">
			<view class="shuju_01">
				<view>今日订单/金额</view>
				<view class="shuju_01_s" v-if="salesData[0].totalCount != null">{{salesData[0].totalCount}}/ ¥ {{salesData[0].totalPrice}}</view>
				<view class="shuju_01_s" v-else>0 / ¥0</view>
			</view>
			<view class="shuju_01 no">
				<view>昨日订单/金额</view>
				<view class="shuju_01_s" v-if="salesData[1].totalCount != null">{{salesData[1].totalCount}}/ ¥ {{salesData[1].totalPrice}}</view>
				<view class="shuju_01_s" v-else>0 / ¥0</view>
			</view>

			<view class="shuju_01">
				<view>总订单数</view>
				<view class="shuju_01_s " v-if="totalData.totalCount != null">{{totalData.totalCount}}</view>
				<view class="shuju_01_s" v-else>0 </view>
			</view>
			<view class="shuju_01 no">
				<view>总销售金额</view>
				<view class="shuju_01_s" v-if="totalData.totalPrice != null">¥ {{totalData.totalPrice}} </view>
				<view class="shuju_01_s" v-else>¥ 0 </view>
			</view>
		</view>
		<view class="BH"></view>
		<view class="more">
			<view class='mo'>
				<view class='mo_01'>我的工具
				</view>
				<view class='mo_02'></view>
			</view>
		</view>
		<view class="six">
			<view class="jiu_01">
				<navigator url="../tool/roomManage">
					<text class="cuIcon-home"></text>
					<view>房源管理</view>
				</navigator>
			</view>
			<view class="jiu_01">
				<navigator url="/pages/tool/order_list">
					<text class="cuIcon-form"></text>
					<view>订单管理</view>
				</navigator>
			</view>
			<view class="jiu_01">
				<navigator url="/pages/tool/customerList">
					<text class="cuIcon-group_fill"></text>
					<view>客户查看</view>
				</navigator>
			</view>
		</view>
		<!-- 弹窗 -->
		<view v-if="tancl">
			<Tan @close_add="tan" :unreadCount="unreadCount" @doRead="doRead"></Tan>
		</view>
	</view>
</template>

<script>
	import Tan from "@/components/Tan.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		data() {
			return {
				tancl: false,
				shop: {},
				bulletin: null,
				salesData: [],
				totalData: {},
				unreadCount: null
			}
		},
		components: {
			Tan,
			uniNoticeBar
		},
		onShow() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				//获取今日/昨日销售数据
				this.getTodayAndYesterdayData();
				//获取总订单数/总销售额
				this.getTotalCountAndPrice();
				setInterval(() => {
					this.getUnreadOrderCount();
				}, 1000 * 6)
			}
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(!mid){
				uni.showToast({
					title:"您还未认证商家",
					icon:"none"
				})
			}
			//获取公告信息
			this.getBulletin();
		},
		methods: {
			getBulletin() {
				uni.request({
					url: this.prefix + "/getLastBulletin",
					success: (res) => {
						this.bulletin = res.data.data.content
					}
				})
			},
			//弹窗
			tan() {
				this.tancl = !this.tancl
			},
			getTodayAndYesterdayData() {
				uni.request({
					url: this.prefix + "/getTodayAndYesterdayData",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						this.salesData = res.data.data
					}
				})
			},
			getTotalCountAndPrice() {
				uni.request({
					url: this.prefix + "/getTotalCountAndPrice",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						this.totalData = res.data.data
					}
				})
			},
			getUnreadOrderCount() {
				uni.request({
					url: this.prefix + "/getUnreadOrderCount",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						this.unreadCount = res.data.data
						if (res.data.data > 0) {
							this.tancl = true;
						}
					}
				})
			},
			doRead() {
				uni.request({
					url: this.prefix + "/doRead",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						this.tancl = false;
						uni.navigateTo({
							url:"../tool/order_list"
						})
					}
				})
			},
			toBulletin(){
				uni.navigateTo({
					url:"../tool/bulletin"
				})
			}
		}
	}
</script>


<style lang="scss">
	.index {
		background: #fff;

		.H50 {
			height: 50px;
		}

		.head {
			height: 350upx;
			width: 100%;

			image {
				height: 350upx;
				width: 100%;
			}
		}

		.jiu {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
			color: #fff;
		}

		.jiu_01 {
			width: 33%;
			text-align: center;
			padding: 15px 10px 15px;
			box-sizing: border-box;
			font-size: 12px;
		}

		.jiu_01 text {
			font-size: 85upx;
			margin-bottom: 10px;
		}

		.mo {
			padding: 10px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #f0f0f0;
			line-height: 20px;
		}

		.mo_01 {
			padding-left: 10px;
			box-sizing: border-box;
			width: 80%;
			height: 20px;
			overflow: hidden;
			border-left: 3px solid #EC521B;
			font-size: 14px;
			font-weight: bold;
		}

		.mo_01 span {
			color: #8E8E8E;
			font-weight: 100;
			font-size: 12px;
			padding-left: 10px;
		}

		.mo_02 {
			color: #D6D6D6;
		}

		.shuju {
			display: flex;
			flex-wrap: wrap;
		}

		.shuju_01 {
			width: 50%;
			text-align: center;
			padding: 18px 10px;
			box-sizing: border-box;
			font-size: 14px;
			line-height: 25px;
			font-size: 14px;
			border-right: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
		}

		.shuju_01_s {
			color: #EB511B;
			font-weight: 800;
			font-size: 16px;
		}

		.no {
			border-right: none;
		}

		.BH {
			background-color: #F1F1F1;
			height: 5px;
		}

		.six {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
		}
	}
</style>
