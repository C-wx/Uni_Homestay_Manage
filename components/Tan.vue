<template>
	<view class="AddTan">
		<view class='' v-if="add">
		    <view class="two" >
				<view class='two_con'><img src="../static/imgs/12.png"></img></view>
		      <view  class='t_tit'>您有<text style="color:#f00;font-weight: 800;">{{unreadCount}}</text>条新的订单未查看</view>
		      <view class='t_btn'>
				  <view class="t_btn_l"  @click="close_add">取消</view>
				  <view class="t_btn_r" @click="doRead">查看</view>
			  </view>
		    </view>
		    <Black></Black>
		</view>
	</view>
</template>

<script>
	import Black from './Black.vue'
	export default {
		data() {
			return {
				add:true
			};
		},
		props:{
			unreadCount:String
		},
		components: {
			Black
		},
		methods:{
			close_add(){
				this.$emit("close_add");
			},
			doRead(){
				this.$emit("doRead");
			}
		},
		mounted() {
		}
	}
</script>

<style lang="less">
.AddTan{
	.two{position: fixed;top: 100px;left: 8%;width: 84%;border-radius: 15px;background-color: #fff;box-sizing: border-box;
	z-index: 10001;text-align: center;padding: 45px 0 35px;}
	.t_tit{font-size: 16px;text-align: center;padding: 15px 10px 40px;}
	.two_con img{width: 70px ;height: 70px;margin-bottom: 10px}
	.t_btn{display: flex;justify-content: space-around;}
	.t_btn_l{background-color: #BFBCBC;color: #fff;padding: 13px 0px;border-radius: 20px;width: 40%;}
	.t_btn_r{background-color: #E0451D;color: #fff;padding: 13px 0px;border-radius: 20px;width: 40%;}
	.two_close{position: absolute;bottom: -60px;left: 42%;color: #BDB4AD;}

}
</style>
