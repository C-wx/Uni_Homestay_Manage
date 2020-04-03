<template>
	<view>
		<view class="tips color_fff size_12 align_c" :class="{ 'show':ajax.loading }" @tap="getChatList">{{ajax.loadText}}</view>
		<view class="box-1" id="list-box">
			<view class="talk-list">
				<view v-for="(item,index) in chatList" :key="index" :id="`msg-${item.id}`">
					<view class="item flex_col" :class=" item.isSelf == 'true' ? 'push':'pull' ">
						<image :src="item.avatarUrl" mode="aspectFill" class="pic"></image>
						<view class="content">{{item.content}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="box-2">
			<view class="flex_col">
				<view class="flex_grow">
					<input type="text" class="content" v-model="content" placeholder="请输入聊天内容" placeholder-style="color:#DDD;" :cursor-spacing="6">
				</view>
				<button class="send" @tap="send">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				InputBottom: 0,
				chatList:[],
				uid: null,
				content: '',
				loadText:'正在获取消息'
			};
		},
		onLoad(e) {
			this.uid = e.receiveId;
			this.getChatList();
		},
		methods: {
			getChatList(){
				uni.request({
					url: this.prefix + "/getMerChats",
					data:{
						uid : this.uid,
						mid : this.getMerchantInfo().id
					},
					success: (res) => {
						this.chatList = res.data.data;
					}
				})
			},
			send(){
				if(!this.content){
					uni.showToast({
						title:'请输入有效的内容',
						icon:'none'
					})
					return;
				}
				
				uni.request({
					url: this.prefix + "/doSendReply",
					data:{
						receiveId: this.uid,
						mid : this.getMerchantInfo().id,
						content : this.content
					},
					success: (res) => {
						if(res.data.code == 200){
							this.content = '';
							this.getChatList();
							uni.pageScrollTo({
							    scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
							    duration: 0
							});
						}else{
							uni.showToast({
								title:"发送失败",
								icon:"none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 根元素样式 设置页面背景、字体大小、字体颜色，字符间距、长单词换行 */
	page {
	  background-color: #f3f3f3;
	  font-size: 28rpx;
	  box-sizing: border-box;
	  color: #333;
	  letter-spacing: 0;
	  word-wrap: break-word;
	}
	
	/* 设置常用元素尺寸规则 */
	view,textarea,input,label,form,button,image{box-sizing: border-box;}
	/* 按钮样式处理 */
	button{font-size: 28rpx;}
	/* 取消按钮默认的边框线效果 */
	button:after{border:none;}
	/* 设置图片默认样式，取消默认尺寸 */
	image{display: block;height: auto;width: auto;}
	/* 输入框默认字体大小 */
	textarea,input{font-size: 28rpx;};
	
	/* 列式弹性盒子 */
	.flex_col {
	  display: flex;
	  flex-direction: row;
	  flex-wrap: nowrap;
	  justify-content: flex-start;
	  align-items: center;
	  align-content: center;
	}
	/* 行式弹性盒子 */
	.flex_row {
	  display: flex;
	  flex-direction: column;
	  flex-wrap: nowrap;
	  justify-content: flex-start;
	  align-items: flex-start;
	  align-content: flex-start;
	}
	 
	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow{width:0;flex-grow: 1;}
	.flex_row .flex_grow{flex-grow: 1;}
	 
	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap{flex-wrap: wrap;}
	 
	/* 弹性盒子居中对齐 */
	.flex_col.flex_center,.flex_row.flex_center{justify-content: center;}
	 
	/* 列式弹性盒子两端对齐 */
	.flex_col.flex_space{justify-content: space-between;}
	
	/* 弹性盒子快速分栏 ,这里非常郁闷 uniapp 居然不支持 * 选择器 */
	.flex_col.flex_col_2>view{width: 50%;}
	.flex_col.flex_col_3>view{width: 33.33333%;}
	.flex_col.flex_col_4>view{width: 25%;}
	.flex_col.flex_col_5>view{width: 20%;}
	.flex_col.flex_col_6>view{width: 16.66666%;}
	
	/* 字体颜色 */
	.color_fff {color: #fff;}
	 
	/* 背景色*/
	.bg_fff{background-color: #ffffff;}
	 
	/* 字体大小 */
	.size_12 {font-size: 24rpx;}
	 
	/* 字体加粗 */
	.font_b{font-weight: bold;}
	 
	/* 对齐方式 */
	.align_c{text-align: center;}
	 
	/* 遮罩 */
	.shade{
	  position: fixed;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;
	  background-color: rgba(0,0,0,0.8);
	  z-index: 100;
	}
	 
	/* 弹窗 */
	.shade_box{
	  position: fixed;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;
	  margin: auto;
	  z-index: 101;
	  min-width: 200rpx;
	  min-height: 200rpx;
	}
	
	/* 加载数据提示 */
	.tips{
		position: fixed;
		left: 0;
		top:var(--window-top);
		width: 100%;
		z-index: 9;
		background-color: rgba(0,0,0,0.15);
		height: 72rpx;
		line-height: 72rpx;
		transform:translateY(-80rpx);
		transition: transform 0.3s ease-in-out 0s;
		
		&.show{
			transform:translateY(0);
		}
	}
	
	.box-1{
		width: 100%;
		height: auto;
		padding-bottom: 100rpx;
		box-sizing: content-box;
		
		/* 兼容iPhoneX */
		margin-bottom: 0;  
		margin-bottom: constant(safe-area-inset-bottom);  
		margin-bottom: env(safe-area-inset-bottom);  
	}
	.box-2{
		position: fixed;
		left: 0;
		width: 100%;
		bottom: 0;
		height: auto;
		z-index: 2;
		border-top: #e5e5e5 solid 1px;
		box-sizing: content-box;
		background-color: #F3F3F3;
		
		/* 兼容iPhoneX */
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		
		>view{
			padding: 0 20rpx;
			height: 100rpx;
		}
		
		.content{
			background-color: #fff;
			height: 64rpx;
			padding: 0 20rpx;
			border-radius: 32rpx;
			font-size: 28rpx;
		}
		
		.send{
			background-color: #42b983;
			color: #fff;
			height: 64rpx;
			margin-left: 20rpx;
			border-radius: 32rpx;
			padding: 0;
			width: 120rpx;
			line-height: 62rpx;
			
			&:active{
				background-color: #5fc496;
			}
		}
	}
	
	.talk-list{
		padding-bottom: 20rpx;
		
		/* 消息项，基础类 */
		.item{
			padding: 20rpx 20rpx 0 20rpx;
			align-items:flex-start;
			align-content:flex-start;
			color: #333;
			
			.pic{
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				border: #fff solid 1px;
			}
			
			.content{
				padding: 20rpx;
				border-radius: 4px;
				max-width: 500rpx;
				word-break: break-all;
				line-height: 52rpx;
				position: relative;
			}
			
			/* 收到的消息 */
			&.pull{
				.content{
					margin-left: 32rpx;
					background-color: #fff;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-right: 20rpx solid #fff;
						position: absolute;
						top: 30rpx;
						left: -18rpx;
					}
				}
			}
			
			/* 发出的消息 */
			&.push{
				/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
				flex-direction: row-reverse;
				
				.content{
					margin-right: 32rpx;
					background-color: #a0e959;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-left: 20rpx solid #a0e959;
						position: absolute;
						top: 30rpx;
						right: -18rpx;
					}
				}
				.data{
					float: right;
				}
			}
		}
	}
</style>
