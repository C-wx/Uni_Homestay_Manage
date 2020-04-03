<template>
	<view class="manage">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#64887d"></uni-segmented-control>
		<view class="content">
			<view>
				<view class="one">
					<block v-for="(item,index) of list" :key="index">
						<view class="container" v-if="item.state!=current">
							<view class="pic"><img :src="item.images[0].url" /></view>
							<view class="desc">
								<view class="title">
									<view class='title_l'>{{item.title}}</view>
									<view class='des'>{{item.des}}</view>
								</view>
								<view class="price">¥ {{item.price}}</view>
								<view class="kc">
									<view class="xiaol">销量：{{item.sales}}</view>
								</view>
								<view class="btn">
									<view class="btn_01" @click="jump_edit(item.id)" v-if="item.status!='D'">编辑</view>
									<view class="btn_01" @click="pull(item.id,index)" v-if="item.status!='D'">下架</view>
									<view class="btn_01" @click="push(item.id,index)" v-if="item.status=='D'">上架</view>
									<view class="btn_01" @click="del(item.id,index)" v-if="item.status=='D'">删除</view>
								</view>
							</view>
						</view>
					</block>

					<view class="tjsp">
						<navigator url="./roomEdit?is_edit=false">
							<view class="flex flex-direction">
								<button class="cu-btn bg-cyan margin-tb-sm lg">添加商品</button>
							</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>

		<view style="height:100px;"></view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				list: [],
				items: ['上架商品', '下架商品'],
				current: 0
			}
		},
		onLoad() {
			let mid = this.getMerchantInfo().id;
			if(mid){
				this.getRoomList("E");
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
			getRoomList(status) {
				uni.request({
					url: this.prefix + "/getAllRoom",
					data: {
						merchantId: this.getMerchantInfo().id,
						status: status,
						size: 50
					},
					success: (res) => {
						this.list = res.data.data;
					}
				})
			},
			pull(id,index) {
				uni.showModal({
					title: '确定下架？',
					success: res => {
						if (res.confirm == true) {
							uni.request({
								url: this.prefix + "/doOpeRoom",
								data: {
									id: id,
									status: "D"
								},
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: "下架成功",
											icon: "none"
										})
										this.list.splice(index, 1);
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: "none"
										})
									}
								}
							})
						}
					}
				})
			},
			del(id,index) {
				uni.showModal({
					title: '确定删除？',
					success: res => {
						if (res.confirm == true) {
							uni.request({
								url: this.prefix + "/doOpeRoom",
								data: {
									id: id,
									status: "DELETE"
								},
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: "删除成功",
											icon: "none"
										})
										this.list.splice(index, 1);
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: "none"
										})
									}
								}
							})
						}
					}
				})
			},
			push(id,index) {
				uni.showModal({
					title: '确定上架？',
					success: res => {
						if (res.confirm == true) {
							uni.request({
								url: this.prefix + "/doOpeRoom",
								data: {
									id: id,
									status: "FR"
								},
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: "上架成功",
											icon: "none"
										})
										this.list.splice(index, 1);
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: "none"
										})
									}
								}
							})
						}
					}
				})
			},
			jump_edit(id) {
				uni.navigateTo({
					url: "./roomEdit?id=" + id + "&is_edit=true"
				})
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
				if (1 === index) {
					this.getRoomList("D")
				} else {
					this.getRoomList("E")
				}
			}
		}
	}
</script>

<style lang="less">
	.manage {
		.one {
			.container {
				display: flex;
				flex-direction: row;
				border-bottom: 1px solid #F2F2F2;
				justify-content: space-between;
				height: 294rpx;
				padding: 5px 11px;
				margin: 0 0 10px;
				background: #fff;

				.pic {
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 30%;
					height: 100%;
					vertical-align: middle;
				}

				.pic img {
					width: 100%;
					height: 77%;
					border-radius: 10rpx;
				}

				.desc {
					color: #8B8B8B;
					width: 70%;
					padding: 35rpx 20rpx;
					text-align: left;
					font-size: 12px;

					.title_l {
						font-weight: bold;
						color: #333;
						height: 18px;
						overflow: hidden;
						font-size: 18px;
						line-height: 18px;
					}

					.des {
						margin: 10upx 0;
						color: #797979;
						height: 36px;
						overflow: hidden;
						font-size: 14px;
						line-height: 18px;
					}

					.price {
						color: red;
						font-size: 16px;
						font-weight: 900;
					}

					.kc {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						line-height: 50rpx;

						.xiaol {
							color: #8B8B8B;
						}
					}

					.btn {
						display: flex;
						justify-content: flex-end;
						margin-top: -35upx;

						.btn_01 {
							border: 1px solid #8B8B8B;
							border-radius: 3px;
							text-align: center;
							margin-left: 10px;
							padding: 3px 8px;
						}
					}
				}
			}

			.tjsp {
				padding: 0 10px;
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				box-sizing: border-box;
				z-index: 99;
				background-color: #fff;
			}

		}
	}
</style>
