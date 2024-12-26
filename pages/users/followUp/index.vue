<template>
	<view class="followUp">
		<view class="header-tips">
			如果是到店拜访，请在客户位置附近100米内提交。请确保设置好应用的位置权限。
			<!-- <text class="to-seeting">去设置</text> -->
		</view>
		<view class="to-add-sales-product fjs-m-x-30 fjs-m-t-30" @click="toAddSalesProduct">
			<button type="primary" plain>销售商品填报</button>
		</view>
		<view class="content">
			<view class="main-type">
				<view class="item">
					<view class="title"><text class="is-required">*</text>跟进类型</view>
					<view class="title-info" @click="followTypeShow=true">
						<view :class="form.followType?'select-value':'placeholder'">
							{{form.followType?form.followTypeName:'请输入跟进类型'}}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon>
					</view>
				</view>
				<u-picker @confirm="followTypeConfirm" confirmColor="#FF920F" :show="followTypeShow" :columns="[followTypes]" keyName="dictLabel" @cancel="followTypeShow=false"></u-picker>
				<view class="item">
					<view class="title"><text class="is-required">*</text>营业状态</view>
					<view class="title-info" @click="businessStatusVisible = true">
						<view :class="form.businessStatus ? 'select-value' : 'placeholder'">
							{{ $util.getDictLabelByValue('business_status', form.businessStatus) ||  '请选择营业状态' }}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon>
					</view>
				</view>
				<u-picker
					@confirm="businessStatusConfirm" 
					confirmColor="#FF920F" 
					:show="businessStatusVisible" 
					:columns="[businessStatusList]"
					keyName="dictLabel"
					@cancel="businessStatusVisible = false"
				>			
				</u-picker>
				<view class="item">
					<view class="title"><text class="is-required">*</text>拜访目的</view>
					<view class="title-info" @click="purposeTypeShow=true">
						<view :class="form.purposeType?'select-value':'placeholder'">
							{{form.purposeType?form.purposeTypeName:'请选择拜访目的'}}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon>
					</view>
				</view>
				<u-picker @confirm="purposeTypeConfirm" confirmColor="#FF920F" :show="purposeTypeShow" :columns="[purposeTypes]" keyName="dictLabel" @cancel="purposeTypeShow=false"></u-picker>
				<view class="item">
					<view class="title"><text class="is-required">*</text>本次跟进时间</view>
					<!-- <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange"> -->
					<view class="title-info">
						<view :class="form.followTime?'select-value':'placeholder'">
							{{form.followTime?form.followTime:'请输入本次跟进时间'}}
						</view>
						<!-- <u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon> -->
					</view>
				</view>
				<u-datetime-picker :show="followTimeShow" v-model="defaultDate" mode="datetime"
					@cancel="followTimeShow=false" confirmColor="#FF920F" @confirm="followTimeConfirm"></u-datetime-picker>
				<view class="item">
					<view class="title"><text class="is-required">*</text>联系人</view>
					<view class="title-info" @click="contactPopupShow=true">
						<view :class="form.contactsId?'select-value':'placeholder'">
							{{form.contactsId?form.contactName:'请选择联系人'}}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">下次跟进时间</view>
					<view class="title-info" @click="nextFollowShow=true">
						<view :class="form.nextFollowTime?'select-value':'placeholder'">
							{{form.nextFollowTime?form.nextFollowTime:'请输入下次跟进时间'}}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="18" color="#333"></u-icon>
					</view>
				</view>
				<u-datetime-picker :show="nextFollowShow" v-model="defaultDate" mode="datetime"
					@cancel="nextFollowShow=false" :minDate="defaultDate" confirmColor="#FF920F" @confirm="nextFollowConfirm"></u-datetime-picker>
			</view>
			<view class="shop-photo fjs-m-t-30 " v-if="form.followType==1">
				<view class="title fjs-p-y-30">
					<view><text style="color:#C60203">*</text>拜访照片</view>
					<view class="pic-desc">包含人脸与门头的水印相机照片</view>
				</view>
				<view class="upload-btn fjs-p-b-14">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="9">
					</u-upload>
				</view>
			</view>

			<view class="remark fjs-m-t-30">
				<view class="item">
					<view class="title"><text class="is-required">*</text>内容</view>
					<view class="title-info">
						<textarea :autoHeight="true" style="min-height: 200rpx;width: 100%;" maxlength="1000" v-model="form.content" placeholder="请输入内容" />
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="contactPopupShow" :round="10" mode="bottom" :closeable="true" @close="contactPopupShow=false">
			<view class="contact-container fjs-p-x-32 fjs-p-y-24">
				<view class="contact-title flex flex-row-between">
					<view class="font-bold fjs-font-36 color-black">联系人</view>
				</view>
				<view class="contatc-list">
					<view class="contact-item flex flex-row-between fjs-p-y-26 flex-align-center"
						v-for="item in contactList" :key="item.id" @click="selectContact(item.id)">
						<view class="contact-item-info color-black">
							<view class="contact-item-title fjs-font-28">
								<text class="fjs-p-r-10">{{item.realName}}</text>
								<text>{{item.mobile}}</text>
							</view>
							<view v-if="item.remark" class="contact-item-remark color-info fjs-p-t-12 fjs-font-20">
								{{item.remark}}</view>
						</view>
						<!-- <image class="call-icon" src="@/static/images/home/call.png"></image> -->
					</view>
				</view>
			</view>
		</u-popup>
		<view class="submit-button">
			<button @click="$u.debounce(onSubmit,500)">立即提交</button>
		</view>
	</view>
</template>

<script>
	import {
		getCodeImg
	} from '@/api/login'
	import {
		dictDataType
	} from '@/api/utils.js';
	import {
		contactsList
	} from '@/api/contact.js'
	import {
		followSave,followDetail
	} from '@/api/follow.js'
	import {
		mapGetters
	} from 'vuex'
	import dictConstants from '@/utils/dictConstants.js'
	export default {
		data() {
			return {
				form: {
					id:'',
					customerId: '',
					followType: '',
					followTypeName: '',
					purposeType: '',
					purposeTypeName: '',
					followTime: '',
					nextFollowTime: '',
					contactsId: '',
					contactName: '',
					doorPic: [],
					content: '',
					businessStatus: ''
				},
				defaultDate: Number(new Date()),
				defaultNextDate: Number(new Date()),
				followTimeShow: false,
				nextFollowShow: false,
				valueRegion: [],
				fileList1: [],
				followTypes: [],
				purposeTypes: [],
				contactList: [],
				businessStatusList: [],
				contactPopupShow: false,
				followTypeShow:false,
				purposeTypeShow:false,
				businessStatusVisible: false,
				EvUrl: '',
				isSubmit: true
			}
		},
		computed: mapGetters(['token', 'isLogin', 'dictDataType']),
		onLoad(options) {
			let that = this;
			if (options.id) {
				if(options.followUpId){
					that.form.id = options.followUpId;
					uni.setNavigationBarTitle({
						title:'修改跟进记录'
					})
				}
				that.EvUrl = that.$config.baseUrl + '/crm/upload/image?model=shop&pid=0'
				that.form.customerId = options.id;
				that.initData();
			}
			this.businessStatusList = this.dictDataType['business_status']

		},
		methods: {
			async initData() {
				let that = this;
				dictDataType("follow_type").then(res => {
					that.followTypes = res.data
					if(!that.form.id){
						that.form.followType = that.followTypes[0].dictValue;
						that.form.followTypeName = that.followTypes[0].dictLabel;
					}
				})
				this.purposeTypes = this.dictDataType.purpose_type.map(item => ({dictLabel:item.dictLabel,dictValue:item.dictValue}))
				let customerId = that.form.customerId;
				const { rows } = await contactsList({ customerId })
				that.contactList = rows
				that.defaultNextDate = this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:00:00');
				if(that.form.id){
					followDetail(that.form.id).then(res=>{
						if(res.code == 200 && res.data){
							res.data.followTypeName = this.$util.getDictLabelByValue(dictConstants.DICT_TYPE_FOLLOW_TYPE,res.data.followType)
							res.data.purposeTypeName = this.$util.getDictLabelByValue(dictConstants.DICT_TYPE_PURPOSE_TYPE,res.data.purposeType)
							if(res.data.doorPic && res.data.doorPic.length>0){
								res.data.doorPic.forEach(item=>{
									that.fileList1.push({url:item})
								})
							}
							res.data.contactName = that.getConstactNameById(that.contactList,res.data.contactsId);
							that.form = res.data;
							// console.log("that.form.contactName:",that.form.contactName)
						}
					});
				}else{
					that.form.followTime = this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss')
					if(that.contactList && that.contactList.length == 1){
						that.form.contactsId = that.contactList[0].id;
						that.form.contactName = that.contactList[0].realName;
					}
				}
			},
			getConstactNameById(arr,id){
				for(var i = 0; i<arr.length; i++){
				    if(arr[i].id==id){
				        return arr[i].realName
				    }
				}
			},
			onSubmit() {
				let that = this;
				let checkResult = that.checkParams();	
				if (checkResult) {
					uni.showToast({
						title: checkResult,
						icon: 'none',
						duration: 3000
					})
					return;
				}
				let processedPicUrls = []
				that.fileList1.forEach(item => {
					processedPicUrls.push(item.url)
				})
				that.form.doorPic = processedPicUrls;
				if(!this.isSubmit) return
				this.isSubmit = false
				//console.log("that.form.followType:",that.form.followType)
				followSave(that.form).then(res => {		
					uni.$emit('followUpUpdateEvent');
					uni.showToast({
						title: "提交成功",
						icon: 'success'
					})
					setTimeout(function(){
						uni.navigateBack()
					},1500)
				}).finally(e => {
					this.isSubmit = true
				})
			},
			checkParams() {
				if (!this.form.followType) {
					return '请选择跟进类型'
				}
				if (!this.form.businessStatus) {
					return '请选择营业状态'
				}
				if (!this.form.purposeType) {
					return '请选择拜访目的'
				}
				if (!this.form.followTime) {
					return '请选择本次跟进时间'
				}
				if (!this.form.contactsId) {
					return '请选择联系人'
				}
				console.log("this.form.followType:",this.form.followType)
				if (this.form.followType == 1 && (!this.fileList1 || this.fileList1.length == 0)) {
					return '请上传至少一张拜访照片'
				}
				if (!this.form.content) {
					return '请输入内容'
				}
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			async afterRead(event) {
				console.log(event)
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					let item = this[`fileList${event.name}`][fileListLen]
					try {
						const result = await this.uploadFilePromise(lists[i].url);
						console.log("result:", result)
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url
						}))
						fileListLen++
					} catch (data) {
						this[`fileList${event.name}`].splice(fileListLen, 1)
						//TODO handle the exception
					}
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.EvUrl,
						filePath: url,
						name: 'multipart',
						header: {
							// #ifdef MP
							"Content-Type": "multipart/form-data",
							// #endif
							['AuthoriZation']: this.token
						},
						success: (res) => {
							const data = res.data ? JSON.parse(res.data) : {};
							if (data.code === 200) {
								resolve(data.data);
							} else if ([410000, 410001, 410002, 401].indexOf(data.code) !== -1) {
								uni.showToast({
									icon: 'none',
									title: '登录失效，请重新登录'
								})
								reject(data);
							} else {
								this.$u.toast(data.msg)
								reject(data)
							}
						},
						fail: (res) => {
							uni.showToast({
								title: res,
								icon: 'error'
							})
							reject(res)
						}
					});
				})
			},
			selectContact(contactsId) {
				let that = this;
				this.contactList.forEach(res => {
					if (res.id == contactsId) {
						that.form.contactsId = contactsId;
						that.form.contactName = res.realName;
						that.contactPopupShow = false;
					}
				})
			},
			followTimeConfirm(e) {
				let selectedDateStr = this.$u.timeFormat(new Date(e.value), 'yyyy-mm-dd hh:MM:ss');
				this.form.followTime = selectedDateStr
				this.followTimeShow = false
			},
			nextFollowConfirm(e) {
				let selectedDateStr = this.fomartDate(new Date(e.value));
				this.form.nextFollowTime = selectedDateStr
				this.nextFollowShow = false
			},
			fomartDate(date) {
				return this.$u.timeFormat(date, 'yyyy-mm-dd hh:MM:ss')
				// console.log("date:", date)
				// let year = date.getFullYear(); // 年份，例如 2023
				// let month = date.getMonth(); // 月份，0-11，0 表示一月，11 表示十二月
				// let day = date.getDate(); // 日期，1-31
				// let hour = date.getHours(); // 小时，0-23
				// let minute = date.getMinutes(); // 分钟，0-59
				// let second = date.getSeconds();
				// return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
			},
			followTimeClose(e) {
				console.log("followTimeClose:", e.value)
				this.followTimeShow = false
			},
			
			followTypeConfirm(e) {
				let selectItem = e.value[0];
				this.form.followType = selectItem.dictValue;
				this.form.followTypeName = selectItem.dictLabel;
				this.followTypeShow = false;
			},
			purposeTypeConfirm(e) {
				let selectItem = e.value[0];
				this.form.purposeType = selectItem.dictValue;
				this.form.purposeTypeName = selectItem.dictLabel;
				this.purposeTypeShow = false;
			},
			businessStatusConfirm({value}) {
				this.form.businessStatus = value[0].dictValue
				this.businessStatusVisible = false
			},
			toAddSalesProduct() {
				uni.redirectTo({
					url: `/pages/users/addSalesProduct/index?customerId=${this.form.customerId}`
				})
			}
		} 
	}
</script>

<style lang="scss">
	.followUp {
		padding-bottom: 200rpx;
	}
	.to-add-sales-product button {
		background-color: #FF920F;
		border-radius: 12rpx;
		color: #fff;
		font-size: 26rpx;
		border: none;
		width: 230rpx;
		margin: 0;
	}
	.header-tips {
		background: rgba(255, 146, 15, 0.16);
		padding: 22rpx 34rpx;
		font-size: 28rpx;
		color: #333;
		width: 100%;
		box-sizing: border-box;
	}

	.content {
		padding: 30rpx 30rpx;
	}

	.shop-photo,
	.remark,
	.main-type {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 0 30rpx;

		.item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 36rpx 0rpx 36rpx 0;
			border-bottom: 2rpx solid #F7F7F7;

			.title {
				width: 32%;
				font-size: 28rpx;

				text {
					color: #C60203;
				}
			}

			picker {
				flex: 1;
				height: 40rpx;
			}

			.iconfont {
				font-size: 37rpx;
			}

			.title-info {
				display: flex;
				flex: 1;
				align-items: center;
				width: 100%;

				.select-value {
					flex: 1;
				}

				input {
					font-size: 28rpx;
					color: #333;
					flex: 1;
					padding-right: 10rpx;
				}

				textarea {
					font-size: 28rpx;
				}

				// /deep/ .u-icon {
				// 	width: 32rpx;
				// 	height: 32rpx;
				// }
			}

			&:last-child {
				border: none;
			}
		}
	}

	.remark {
		.item {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}

		.title-info {
			margin-top: 20rpx;
		}
	}


	.shop-photo {
		.title {
			font-size: 28rpx;
		}

		.pic-desc {
			color: #FF920F;
			font-size: 24rpx;
			margin-top: 6rpx;
		}
	}

	.select-value {
		color: #333;
		font-size: 28rpx;
	}

	.submit-button {
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 40rpx 30rpx;
		background-color: #fff;
		width: 100%;
		box-sizing: border-box;

		button {
			background-color: #FF920F;
			color: #fff;
			border-radius: 16rpx;
			height: 82rpx;
			font-size: 32rpx;
		}
	}

	.main-type {
		padding: 0 30rpx;
	}

	.to-seeting {
		color: #FF920F;
	}

	.placeholder {
		color: #999999;
		flex: 1;
		font-size: 28rpx;
	}

	.contact-container {
		min-height: 600rpx;

		.contact-title {
			padding-bottom: 24rpx;
			border-bottom: 2rpx solid #F7F7F7;
		}
	}

	.contact-item {
		border-bottom: 2rpx solid #F7F7F7;

		.call-icon {
			width: 40rpx;
			height: 40rpx;
			display: block;
		}

		&:last-child {
			// border: none;
		}
	}
</style>