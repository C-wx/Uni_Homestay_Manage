<template>
	<view>
		<view class='mo margin-top'>
			<view class='mo_01'>参数填写</view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title"><text class="text-red">*</text>房间标题:</view>
			<input v-model="roomInfo.title" placeholder="请输入标题"></input>
		</view>
		<view class="cu-form-group align-start">
			<view class="title"><text class="text-red">*</text>房间描述:</view>
			<textarea maxlength="-1" v-model="roomInfo.des" placeholder="请输入房间描述"></textarea>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>房间价格:</view>
			<input type="number" v-model="roomInfo.price" placeholder="请输入价格"></input>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>房间类型:</view>
			<picker @change="PickerChange" :value="index" :range="picker">
				<view class="picker">
					{{index>-1?picker[index]: roomInfo.type}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>是否参加活动:</view>
			<switch class='red radius' @change="joinActive" :class="isActive?'checked':''" :checked="isActive?true:false"></switch>
		</view>
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="text-red">*</text>请选择房间图片
			</view>
			<view class="action">
				{{imgList.length}}/3
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length<3">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view class='mo margin-top'>
			<view class='mo_01'>属性填写</view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title"><text class="text-red">*</text>卧室数量:</view>
			<input v-model="roomInfo.bedRoomCount" type="number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>床位数量:</view>
			<input v-model="roomInfo.bedCount" type="number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>卫生间数量:</view>
			<input v-model="roomInfo.bathRoomCount" type="number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title"><text class="text-red">*</text>最多可住:</view>
			<input v-model="roomInfo.peopleCount" type="number"></input>
		</view>
		<view class="cu-form-group"></view>
		<view class="cu-form-group"></view>
		<view class="p_btn">
			<view class="flex flex-direction" v-if="is_edit == 'false'">
				<button @click="sub_add()" class="cu-btn bg-red margin-tb-sm lg">提交新增</button>
			</view>
			<view class="flex flex-direction" v-if="is_edit == 'true'">
				<button @click="sub_edit()" class="cu-btn bg-red margin-tb-sm lg">提交修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: 0,
				imgList: [],
				picker: ['大床房', '单人间', '双人间'],
				isActive: false,
				roomInfo: {
					type: "大床房"
				},
				is_edit: false
			};
		},
		onLoad(option) {
			this.is_edit = option.is_edit;
			console.log(this.is_edit)
			if(option.id){
				this.getRoomDetail(option.id);
			}
		},
		methods: {
			getRoomDetail(id) {
				uni.request({
					url: this.prefix + "/getRoomDetail",
					data: {
						rid: id
					},
					success: (res) => {
						this.roomInfo = res.data.data
						if (this.roomInfo.isActive == 'Y') {
							this.isActive = true
						}
						this.roomInfo.images.forEach((image) => {
							this.imgList.push(image.url)
						});
						[this.roomInfo.bedRoomCount, this.roomInfo.bathRoomCount, this.roomInfo.peopleCount, this.roomInfo.bedCount] = [
							this.roomInfo.propertyInfo.bedRoomCount, this.roomInfo.propertyInfo.bathRoomCount, this.roomInfo.propertyInfo
							.peopleCount, this.roomInfo.propertyInfo.bedCount
						]
					},
				})
			},
			PickerChange(e) {
				this.index = e.detail.value
				this.roomInfo.type = this.picker[this.index]
			},
			joinActive(e) {
				this.isActive = e.detail.value
			},
			ChooseImage() {
				uni.chooseImage({
					count: 3, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if(this.roomInfo.id){
							uni.uploadFile({
								url: this.prefix + "/doSaveRoomImages",
								filePath: res.tempFilePaths[0],
								name: 'file',
								header: {
									"Content-Type": "multipart/form-data"
								},
								formData: {
									rid: this.roomInfo.id
								},
								success: (res) => {
									if (res.data.code === 200) {
										uni.showToast({
											title: res.data.code,
											icon: "none"
										})
									} else {
										uni.showToast({
											title: res.data.code,
											icon: "none"
										})
									}
								}
							})
						}
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '确认删除吗',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							let url = this.imgList[e.currentTarget.dataset.index];
							if(this.roomInfo.id){
								uni.request({
									url: this.prefix + "/merchant/delImage",
									data: {
										url: url
									}
								})
							}
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				})
			},
			sub_edit() {
				uni.showLoading({
					title: "提交中"
				})
				this.roomInfo.isActive = this.isActive?"on":"off"
				uni.request({
					url: this.prefix + "/merchant/doSaveRoom",
					data: {
						mid: this.getMerchantInfo().id,
						roomInfo: JSON.stringify(this.roomInfo)
					},
					success: (res) => {
						if (res.data.code === 200) {
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: "修改成功",
									icon: "success"
								});
							}, 800);
							setTimeout(()=>{uni.reLaunch({url:"./roomManage"})},1500)
						} else {
							uni.showToast({
								title: "修改异常",
								icon: "none"
							})
						}
					}
				})
			},
			sub_add(){
				uni.showLoading({
					title: "提交中"
				})
				this.roomInfo.isActive = this.isActive?"off":"on"
				var arr = Object.keys(this.roomInfo);
				if(arr.length < 10){
					uni.showToast({
						title:"请填写必填字段",
						icon:"none"
					})
					return 
				}
				uni.request({
					url: this.prefix + "/merchant/doSaveRoom",
					data: {
						mid: this.getMerchantInfo().id,
						roomInfo: JSON.stringify(this.roomInfo)
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.imgList.forEach(image=>{
								uni.uploadFile({
								    url:this.prefix + "/doSaveRoomImages", 
									filePath: image,
									name: "file",
								    formData: {
										rid: res.data.data
									},
								    header:{"Content-Type": "multipart/form-data"},
								})
							})
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: "发布成功",
									icon: "success"
								});
							}, 800)
							setTimeout(()=>{uni.reLaunch({url:"./roomManage"})},1500)
						} else {
							uni.showToast({
								title: "发布异常",
								icon: "none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.mo {
		padding: 10px;
		display: flex;
		height: 55px;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		line-height: 39px;
		background-color: #cecece;

		.mo_01 {
			padding-left: 10px;
			box-sizing: border-box;
			width: 80%;
			height: 35px;
			overflow: hidden;
			border-left: 3px solid #009688;
			font-size: 20px;
			font-family: kaiti;
			font-weight: bold;
		}
	}

	.p_btn {
		background: #F7F6FB;
		padding: 0 10px 0px;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 9999;
	}

	.pro_btn {
		background-color: #E5E5E5;
		padding: 10px;
		text-align: center;
		border-radius: 20px;
		background-color: #DF421D;
		color: #fff;
		width: 100%;
	}
</style>
