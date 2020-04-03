<template>
	<view class="">
		<view class="cu-timeline">
			<view class="cu-item cuIcon-noticefill cur text-red" v-for="(item,index) in bulletinList" :key="index">
				<view class="content shadow-blur">
					<view class="cu-capsule radius">
						<view class="cu-tag line-cyan">{{formatTime(item.createTime)}}</view>
					</view>
					<view class="margin-top">{{item.content}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bulletinList: []
			}
		},
		onLoad(option) {
			uni.request({
				url: this.prefix + "/getBulletinList",
				success: (res) => {
					this.bulletinList = res.data.data
				}
			})
		},
		methods: {
		}
	}
</script>

<style>
</style>
