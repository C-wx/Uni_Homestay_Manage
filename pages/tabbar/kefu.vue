<template>
	<view>
		<view class="cu-list menu-avatar" >
			<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(chat,index) in chatList" :key="index"  style="padding: 40upx;"
			 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
				<view class="cu-avatar round lg" :style="[{backgroundImage:'url('+chat.avatarUrl+')'}]"></view>
				<view class="content" @tap="toChat(chat)">
					<view class="text-grey">{{chat.sendName}}</view>
					<view class="text-gray text-sm" style="margin-top: 6upx;">
						<text class="cuIcon-message text-red  margin-right-xs"></text>
						{{chat.content}}
						<view class="cu-tag round bg-red sm" v-if="chat.unreadCount != null && chat.unreadCount>0" style="float: right;">{{chat.unreadCount}}</view>
						<view class="cu-tag round bg-grey sm" v-else style="float: right;">已读</view>
					</view>
				</view>
				<view style="position: absolute; top: 40upx;">
					<view class="text-grey text-xs">{{chat.createTime}}</view>
				</view>
				<view class="move">
					<view class="bg-red" @tap="removeMsg(chat.receiveId,chat.sendId,index)">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatList: [],
				modalName: null,
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			let mid = this.getMerchantInfo().id;
			if (!mid) {
				uni.showToast({
					title:"您还未认证商家",
					icon:"none"
				})
			} else {
				//获取聊天列表
				uni.request({
					url: this.prefix + "/getMerMsgList",
					data: {
						mid: mid
					},
					success: (res) => {
						this.chatList = res.data.data
						console.log(this.chatList)
					}
				})
			}
		},
		methods: {
			toChat(chat) {
				uni.navigateTo({
					url: "chat/chat?receiveId=" + chat.sendId
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			removeMsg(mid,uid,index) {
				uni.request({
					url: this.prefix + '/removeMsg',
					data: {
						mid: mid,
						uid: uid
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.chatList.splice(index, 1);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F1F1;
	}
</style>
