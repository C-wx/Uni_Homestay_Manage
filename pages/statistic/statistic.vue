<template>
	<view class="tongji">
		<view class="t_tit">经营数据</view>
		<view class="t_time">统计时间截止{{formatTime(nowData)}}</view>
		<view class="card">
			<view class="card_01">经营收入</view>
			<view class="card_02">¥ {{totalData.totalPrice != null ? totalData.totalPrice :0}}</view>
			<view class="card_03">
				<view class="card_03_1">
					订单数<br /><span>{{totalData.totalCount != null ? totalData.totalCount :0}}</span>
				</view>
				<view class="card_03_1">
					消费人数<br /><span>{{totalData.totalCount != null ? totalData.totalCount :0}}</span>
				</view>
			</view>
		</view>
		<view class="name">用户数据</view>
		<view class="uhsj">
			<view class="uhsj_l">
				<span>{{userCount.totalCount != null ? userCount.totalCount :0}}</span> <br />用户总数
			</view>
			<view class="uhsj_l">
				<span>{{userCount.currentAddCount != null ? userCount.currentAddCount :0}}</span> <br />本月新增用户
			</view>
		</view>
		<view class="name">其他数据</view>
		<view class="shuju">
			<view class="sj_01">
				<view class="sj_01_1">{{salesData[0].totalCount != null ? salesData[0].totalCount :0}}<br />今日订单</view>
				<view class="sj_01_1">¥ {{salesData[0].totalPrice != null ? salesData[0].totalPrice : 0}}<br />今日收益</view>
			</view>
			<view class="sj_01">
				<view class="sj_01_1">{{salesData[1].totalCount != null ? salesData[1].totalCount :0}}<br />昨日订单</view>
				<view class="sj_01_1">¥ {{salesData[1].totalPrice != null ? salesData[1].totalPrice :0}}<br />昨日收益</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				totalData: {},
				nowData: null,
				userCount: {},
				salesData: [],
			};
		},
		onShow() {
			let mid = this.getMerchantInfo().id;
			if(!mid){
				uni.showToast({
					title:"您还未认证商家",
					icon:"none"
				})
				setTimeout(()=>{
					uni.switchTab({
						url:"../tabbar/data"
					})
				},1000)
			}else{
				this.nowData = new Date()
				//获取总订单数/总销售额
				this.getTotalCountAndPrice();
				//获取本月新增用户
				this.getUserCount();
				//获取今日/昨日销售数据
				this.getTodayAndYesterdayData();
			}
			
		},
		methods: {
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
			getUserCount() {
				uni.request({
					url: this.prefix + "/getUserCount",
					data: {
						mid: this.getMerchantInfo().id
					},
					success: (res) => {
						this.userCount = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.tongji {
		padding: 10px;

		.t_tit {
			font-size: 22px;
			font-weight: 900;
			padding-left: 10px;
			border-left: 3px solid #EC521B;
		}

		.t_time {
			padding: 10px 0px 15px;
			color: #B8B8B8;
			font-size: 14px;
		}

		.card {
			margin: 10px 0;
			background: linear-gradient(to bottom, #FA7458, #EB511B);
			border-radius: 5px;
			padding: 10px;
			color: #FCE8E3;
			box-shadow: 2px 2px 5px 3px #FCEAE8
		}

		.card_01 {
			padding: 5px 0 10px;
			color: #FCE8E3
		}

		.card_02 {
			font-size: 20px;
			border-bottom: 1px solid #FFE4DC;
			padding-bottom: 15px;
		}

		.card_03 {
			display: flex;
			line-height: 20px;
			padding: 10px 0 5px;
		}

		.card_03_1 {
			width: 35%;
		}

		.name {
			margin: 25px 0 15px;
			font-size: 18px;
			font-weight: bold;
			padding-left: 10px;
			border-left: 3px solid #EC521B;
		}

		.uhsj {
			display: flex;
			justify-content: space-around;
		}

		.uhsj_l {
			width: 40%;
			text-align: center;
			box-shadow: 0px 0px 5px #E5E5E5;
			border-radius: 5px;
			line-height: 25px;
			padding: 15px 10px;
		}

		.uhsj_l span {
			font-size: 18px;
			font-weight: bold;
		}

		.shuju {
			background-color: #F8F8F8;
			border-radius: 5px;
		}

		.sj_01 {
			display: flex;
			justify-content: space-between;
		}

		.sj_01_1 {
			width: 50%;
			text-align: center;
			line-height: 25px;
			padding: 10px;
		}

		.sj_02 {
			height: 1px;
			background-color: #fff;
		}
	}
</style>
