<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="loadOrder(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length==0">
					<image src="../../static/imgs/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>
				<view class="row" v-for="(row,index) in list" :key="index">
					<view class="type">{{typeText[row.status]}}</view>
					<view class="order-info">
						<view class="left">
							<image :src="row.roomInfo.images[0].url"></image>
						</view>
						<view class="right">
							<view class="name">
								{{row.roomInfo.title}}
							</view>
							<view class="spec">{{row.roomInfo.des}}</view>
							<view class="price-number">
								￥<view class="price">{{row.roomInfo.price}}</view>
								x<view class="number">{{row.dayCount}}</view>
							</view>
						</view>

					</view>
					<view class="detail">
						<view class="number">共{{row.dayCount}}晚</view>
						<view class="sum">合计￥<view class="price">{{row.price}}</view>
						</view>
					</view>
					<view class="btns">
						<block>
							<view class="default line-cyan " @tap="showModal" :data-index = "index" data-target="bottomModal">查看</view>
							<view class="default line-red" @tap="cancelOrder(row,index)">删除</view>
						</block>
						<block v-if="row.status=='WDD'">
							<view class="default line-green" @tap="agree(row,index)">同意</view>
							<view class="pay line-orange" @tap="refuse(row)">拒绝</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" style="border-top-left-radius: 5%;border-top-right-radius: 5%;">
				<view class="padding-xl">
					<view class="heading">
						订单编号:
						<view class="detail">
							{{orderInfo.orderCode}}
						</view>
					</view>
					<view class="heading">
						下单时间:
						<view class="detail" style="color: #2C405A;">
							{{orderInfo.payTime?formatTime(orderInfo.payTime,true):'未下单'}}
						</view>
					</view>
					<view class="heading">
						入住人名称:
						<view class="detail">
							{{orderInfo.name}}
						</view>
					</view>
					<view class="heading">
						联系电话:
						<view class="detail">
							{{orderInfo.phone}}
						</view>
					</view>
					<view class="heading">
						身份证号码:
						<view class="detail">
							{{orderInfo.cardno}}
						</view>
					</view>
					<view class="heading">
						入住时间:
						<view class="detail">
							{{formatTime(orderInfo.beginTime)}}
						</view>
					</view>
					<view class="heading">
						退房时间:
						<view class="detail">
							{{formatTime(orderInfo.endTime)}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				modalName: null,
				headerPosition: "fixed",
				headerTop: "0px",
				orderInfo:null,
				typeText: {
					WP: '等待付款',
					WR: '等待用户评价',
					YR: '交易已完成',
					WDD: '退款处理中',
					DD: '订单已取消',
					SDD: '已退款',
					FDD: '拒绝退款'
				},
				orderType: ['全部', '待付款', '待评价', '已完成', '售后'],
				list: [],
				tabbarIndex: 0,
				status: null //订单状态: ALL:全部 WP:待付款 WR:待评价 DD:已取消 AS:售后
			};
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				this.loadOrder(0);
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
		onPageScroll(e) {
			return;
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
		},
		methods: {
			loadOrder(tbIndex) {
				switch (tbIndex) {
					case 0:
						this.status = "ALL";
						break;
					case 1:
						this.status = 'WP';
						break;
					case 2:
						this.status = 'WR';
						break;
					case 3:
						this.status = 'YR';
						break;
					case 4:
						this.status = 'DD';
						break;
				}
				setTimeout(() => {
					uni.request({
						url: this.prefix + "/orderPage",
						data: {
							status: this.status,
							mid: this.getMerchantInfo().id,
							size: 50
						},
						success: (res) => {
							this.list = res.data.data;
							this.tabbarIndex = tbIndex;
						},
					})
				}, 10)

			},
			//跳转
			toRoom(e) {
				uni.navigateTo({
					url: "../room/room?id=" + e
				})
			},
			//评价跳转
			toComment(oId, rId) {
				uni.navigateTo({
					url: "./comment?oId=" + oId + "&rId=" + rId
				})
			},
			//取消订单
			cancelOrder(row) {
				uni.showModal({
					title: '',
					content: '确定删除此订单？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.prefix + "/doOpeOrder",
								data: {
									status: "D",
									id: row.id
								},
								success: (res) => {
									this.list.splice(this.list.indexOf(row.id), 1);
								}
							})
						}
					}
				});
			},
			//退款
			agree(row) {
				uni.showModal({
					title: '',
					content: '是否同意退款？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.prefix + "/doOpeOrder",
								data: {
									status: "SDD",
									id: row.id
								},
								success: (res) => {
									uni.showToast({
										title: "退款成功",
										icon: "none"
									})
									this.loadOrder(4);
								}
							})
						}
					}
				});
			},
			//拒绝退款
			refuse(row) {
				uni.showModal({
					title: '',
					content: '是否拒绝退款？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.prefix + "/doOpeOrder",
								data: {
									status: "FDD",
									id: row.id
								},
								success: (res) => {
									uni.showToast({
										title: "已拒绝",
										icon: "none"
									})
									this.loadOrder(4);
								}
							})
						}
					}
				});
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
				this.orderInfo = this.list[e.currentTarget.dataset.index]
			},
			hideModal(e) {
				this.modalName = null
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.topTabBar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #f8f8f8;
		height: 80upx;
		display: flex;
		justify-content: space-around;

		.grid {
			width: 20%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #444;
			font-size: 28upx;

			.text {
				height: 76upx;
				display: flex;
				align-items: center;

				&.on {
					color: #5093bf;
					font-size: 32upx;
					border-bottom: solid 4upx #5093bf;
				}
			}

		}
	}

	.order-list {
		margin-top: 80upx;
		padding-top: 20upx;
		width: 100%;

		.list {
			width: 94%;
			margin: 0 auto;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.type {
					font-size: 26upx;
					color: #ec652f;
					height: 50upx;
					display: flex;
					align-items: center;
				}

				.order-info {
					width: 100%;
					display: flex;

					.left {
						flex-shrink: 0;
						width: 25vw;
						height: 25vw;

						image {
							width: 25vw;
							height: 25vw;
							border-radius: 10upx;
						}
					}

					.right {
						width: 100%;
						margin-left: 10upx;
						position: relative;

						.name {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.spec {
							color: #a7a7a7;
							font-size: 25upx;
							margin-top: 10upx;
						}

						.price-number {
							position: absolute;
							bottom: 0;
							width: 100%;
							display: flex;
							justify-content: flex-end;
							font-size: 22upx;
							color: #333;
							display: flex;
							align-items: flex-end;

							.price {
								font-size: 24upx;
								margin-right: 5upx;
							}

						}
					}
				}

				.detail {
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60upx;
					font-size: 26upx;

					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}
	.padding-xl{
		padding: 40upx;
		.heading{
			display: flex;
			justify-content: space-between;
			margin: 30upx;
			font-size: 34upx;
			font-weight: 800;
			.detail{
				font-size: 32upx;
				color: #f5623d;
				font-family: kaiti;
			}
		}
	}
</style>
