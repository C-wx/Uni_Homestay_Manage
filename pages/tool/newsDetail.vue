<template>
	<view class="container">
		<view v-if="showNews">
			<view class="title">
				{{news.title}}
			</view>
				<view class="line-cyan">{{formatTime(news.createTime)}}</view>
			<view class="richText">
				<rich-text :nodes="news.content" selectable="true"></rich-text>
			</view>
		</view>
		<view class="cu-load load-modal" v-if="!showNews">
			<view class="cuIcon-emojifill text-orange"></view>
			<view class="gray-text">加载中...</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: {},
				showNews:false
			}
		},
		onLoad(option) {
			uni.request({
				url: this.prefix + "/getNewsDetail",
				data:{
					id: option.id
				},
				success: (res) => {
					this.news = res.data.data
				}
			})
			setTimeout(()=>{
				this.showNews = true
			},1000)
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.container{
		background-color: #fff;
		padding: 3%;
		.title{
			text-align: center;
			font-size: 50upx;
			font-weight: 800;
		}
		.line-cyan{
			margin-left: 286upx;
		}
	}
</style>
