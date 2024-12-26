<template>
	<view class="user-details">
		<view class="header">
			<view class="user-card flex">
				<view class="user-img" @click="$util.previewImage(0,[detail.doorPic])">
					<image class="door-pic"  mode="aspectFill" :src="detail.doorPic ? detail.doorPic : '/static/images/shop-img.png'"></image>
				</view>
				<view class="user-info">
					<view class="shop-name flex flex-row-between">
						<view class="name">
							{{detail.shopName}}
						</view>
						<view class="color-primary flex flex-align-center" @click="toPage(`/pages/users/map/location?latitude=${detail.latitude}&longitude=${detail.longitude}&shopName=${detail.shopName}&address=${detail.address}`)">
							<image class="fjs-p-r-8" src="@/static/images/userDetails/navigation.png"></image>
							导航
						</view>
					</view>
					<view class="user-address color-info">
						{{detail.address}}
					</view>
					<view class="user-time flex fjs-m-t-16">
						<view class="type">驻</view>
						<text>{{detail.createTime}}</text>
					</view>
				</view>
			</view>
			<view class="user-tabel">
				<view class="item">
					<view class="title">
						¥{{detail.totalOrderAmount}}
					</view>
					<view class="descraption">
						订单总金额
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.totalOrders}}
					</view>
					<view class="descraption">
						订单总数
					</view>
				</view>
				<view class="item">
					<view class="title">
						¥{{detail.avgOrderValue}}
					</view>
					<view class="descraption">
						平均客单价
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.frequency}}
					</view>
					<view class="descraption">
						30天下单频次
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.avgSku?detail.avgSku:0}}
					</view>
					<view class="descraption">
						30天平均SKU
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.lastOrderAmount}}
					</view>
					<view class="descraption">
						最后下单金额
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.customerStageValue?detail.customerStageValue:'无'}}
					</view>
					<view class="descraption">
						客户阶段
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.customerTypeValue?detail.customerTypeValue:'无'}}
					</view>
					<view class="descraption">
						客户类型
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.categoryValue?detail.categoryValue:'无'}}
					</view>
					<view class="descraption">
						经营品类
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.customerLevelValue?detail.customerLevelValue:'无'}}
					</view>
					<view class="descraption">
						客户分层
					</view>
				</view>
				<view class="item">
					<view class="title">
						{{detail.customerGradeValue?detail.customerGradeValue:'无'}}
					</view>
					<view class="descraption">
						客户等级
					</view>
				</view>
				
				<view class="item">
					<view class="title">
						{{detail.lastFollowerName?detail.lastFollowerName:'无'}}
					</view>
					<view class="descraption">
						最后跟进人
					</view>
				</view>
				<view class="grid item-date-container">
					<view class="item">
						<view class="item-box">
							<view class="descraption">
								最后下单时间
							</view>
							<view class="title">
								{{detail.lastOrderTime?detail.lastOrderTime:'无'}}
							</view>
						</view>
					</view>
					<view class="item">
						<view class="item-box">
							<view class="descraption">
								最后跟进时间
							</view>
							<view class="title">
								{{detail.lastFollowTime?detail.lastFollowTime:'无'}}
							</view>
						</view>
					</view>
					<view class="item">
						<view class="item-box">
							<view class="descraption">
								营业状态
							</view>
							<view class="title">
								{{ $util.getDictLabelByValue('business_status', detail.businessStatus) }}
							</view>
						</view>
					</view>
					<view class="item">
						<view class="item-box">
							<view class="descraption">
								销售商品填报
							</view>
							<view class="title">
								{{ ['未完成','已完成'][detail.annexStatus]}}
							</view>
						</view>
					</view>
				</view>
				<view class="item gird-full" v-if="detail.customerLevel === 6">
					<view class="item-box">
						<view class="descraption flex" @click="isShowCause = true">
							<text class="fjs-m-r-20">流失原因</text>
							<view class="modify-cause">修改</view>
						</view>
						<view class="title">
							{{ detail.reason || '无' }}
						</view>
					</view>
				</view>
				<view class="item gird-full">
					<view class="item-box">
						<view class="descraption">
							备注
						</view>
						<view class="title">
							{{detail.remark || '无'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content fjs-m-t-34">
			<scroll-view scroll-x>
				<view class="user-info-tabs flex">
					<view class="item" :style="{flex:`1 0 ${tabsItemWidth}px`}" 
						v-for="item in tabsList"
						:key="item.value" :class="item.componentName === current ? 'active' : ''"
						@click="switchTabs(item)"
					>
						{{item.title}}
					</view>
				</view>
			</scroll-view>
			<view class="tabs-content">
				<component :is="componentList[current]" :nodeClass="rowsItem" :customerId="customerId" :isOwner="isOwner"/>
			</view>
		</view>
		<view class="footer-btns flex flex-row-between" v-if="isOwner">
			<view class="modify flex flex-column flex-row-center flex-align-center">
				<image class="edit-icon" src="@/static/images/userDetails/edit-icon.png"></image>
				<text class="fjs-m-t-8" @click="toModifyPage">修改</text>
			</view>
			<view class="btns-container flex">
				<button type="primary" plain="" class="contact-btn" @click.stop="checkUserPhone()">联系客户</button>
				<button type="primary" plain="" class="writer-btn" @click="openFollowPage()">写跟进</button>
			</view>
		</view>
		
		<!--  联系客户 -->
		<u-popup :show="isShowPhone" :round="10" mode="bottom">
			<view class="contact-container fjs-p-x-32 fjs-p-y-38">
				<view class="contact-title flex flex-row-between">
					<view class="font-bold fjs-font-36 color-black">联系客户</view>
					<u-icon @click="isShowPhone = false" name="close" color="#272636" size="23"></u-icon>
				</view>
				<view class="contatc-list">
					<view 
						class="contact-item flex flex-row-between fjs-p-y-26 flex-align-center" 
						v-for="item in contactList" :key="item.id"
						@click="makePhoneCall(item.mobile)"
					>
						<view class="contact-item-info color-black">
							<view class="contact-item-title fjs-font-28">
								<text class="fjs-p-r-10">{{item.realName}}</text>
								<text>{{item.mobile}}</text>
							</view>
							<view v-if="item.remark" class="contact-item-remark color-info fjs-p-t-12 fjs-font-20">{{item.remark}}</view>
						</view>
						<image class="call-icon" src="@/static/images/home/call.png"></image>
					</view>
				</view>
			</view>
		</u-popup>
		<u-modal 
			:show="isShowCause" 
			title="填写流失原因" 
			showCancelButton
			@confirm="handleModifyReason"
			@cancel="isShowCause = false"
			confirm-color="#FF920F"
		>
			<view class="slot-content width-full">
				<u--textarea v-model="reason" placeholder="请输入内容" count ></u--textarea>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import followUpRecord from './component/followUpRecord.vue'
	import contacts from './component/contacts.vue'
	import order from './component/order.vue'
	import goods from './component/goods.vue'
	import diary from './component/diary.vue'
	import coupon from './component/coupon.vue'
	import salesProduct from './component/salesProduct.vue'
	import negotiatePrice from './component/negotiatePrice.vue'
	import { setTimeout } from 'timers'
	import { customerDetail } from '@/api/index.js'
	import { contactsList } from '@/api/contact.js'
	import { mapGetters } from "vuex";
	import {
		updateCustomer
	} from '@/api/proxyRegister.js';
	export default {
		name: "userDetails",
		data() {
			return {
				tabsList: [{
						title: '跟进记录',
						value: 0,
						componentName: 'followUpRecord'
					},
					{
						title: '已购商品',
						value: 5,
						componentName: 'goods'
					},
					{
						title: '联系人',
						value: 1,
						componentName: 'contacts'
					},
					{
						title: '订单',
						value: 2,
						componentName: 'order'
					},
					{
						title: '议价商品',
						value: 3,
						componentName: 'negotiatePrice'
					},
					{
						title: '销售商品',
						value: 4,
						componentName: 'salesProduct'
					},
					{
						title: '优惠券',
						value: 6,
						componentName: 'coupon'
					},
					{
						title: '操作日志',
						value: 7,
						componentName: 'diary'
					}
				],
				componentList: {
					followUpRecord,
					contacts,
					order,
					salesProduct,
					goods,
					diary,
					coupon,
					negotiatePrice
				},
				current: 'followUpRecord',
				rowsItem: {
					value: 0,
					componentName: 'followUpRecord'
				},
				tabsItemWidth: 0,
				customerId: null,
				contactList: [],
				isShowPhone: false,
				detail: {
					doorPic: '',//门头照
					shopName: '',//门店名称
					address: '',//地址
					createTime: '',//入驻时间
					categoryValue: '',//经营品类
					customerTypeValue: '',//客户类别
					customerLevel: '', //客户分层
					customerLevelValue: '',//客户分层
					customerStageValue: '',//客户阶段
					customerGradeValue: '',//客户等级
					lastFollowerName: '',//最后跟进人
					lastFollowTime: '',//最后跟进时间
					lastOrderAmount: '',//最后下单金额
					lastOrderTime: '',//最后下单时间
					totalOrders: '',//订单总数
					totalOrderAmount: '',//订单总金额
					avgSku: '',//平均sku
					avgOrderValue: '',//平均客单价
					frequency: '',//下单频次
					remark: '',//备注
					beLongerId:'',
					businessStatus: '' ,//营业状态
					reason: '' ,//流失原因,
					annexStatus: '' ,// 附件完成状态
					latitude: '',// 经度
					longitude: '',// 纬度
				},
				reason: '',
				isOwner:false,
				isShowCause: false
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		components: {
			followUpRecord,
			contacts,
			order,
			salesProduct,
			goods,
			diary,
			coupon
		},
		onLoad(options) {
			if(!options.id) {
				uni.showToast({
					title:'客户ID为空',
					icon:'none',
					complete() {
						setTimeout(function(){
							uni.navigateBack()
						},1500)
					}
				})
				return
			}
			this.customerId = Number(options.id)
			this.tabsItemWidth = uni.getSystemInfoSync().screenWidth / 4.5
			uni.$off("upDetails")
			uni.$on("upDetails",()=>{
				this.getDetail()
			})
		},
		onReachBottom(){
			uni.$emit('onReachBottom');
		},
		onShow() {
			console.log('onShow')
			this.getDetail()
		},
		methods: {
			switchTabs(item) {		
				this.current = item.componentName
				this.rowsItem = item
			},
			openFollowPage(id) {
				uni.navigateTo({
					url: "/pages/users/followUp/index?id=" + this.customerId
				})
			},
			// 联系客户
			async checkUserPhone() {
				const { rows } = await contactsList({customerId:this.customerId})
				this.contactList = rows
				this.isShowPhone = true
			},
			// 拨打电话
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 获取客户详情
			async getDetail(){
				const { data } = await customerDetail(this.customerId);
				let detail = {
					doorPic: data.doorPic ? data.doorPic[0] : '',//门头照
					shopName: data.shopName,//门店名称
					address: data.province+data.city+data.district+data.address,//地址
					createTime: data.createTime,//入驻时间
					categoryValue: data.categoryValue,//经营品类
					customerTypeValue: data.customerTypeValue,//客户类别
					customerLevel: data.customerLevel,
					customerLevelValue: data.customerLevelValue,//客户分层
					customerStageValue: data.customerStageValue,//客户阶段
					customerGradeValue: data.customerGradeValue,//客户等级
					lastFollowerName: data.lastFollowerName,//最后跟进人
					lastFollowTime: data.lastFollowTime,//最后跟进时间
					lastOrderAmount: data.innerShopDataStatisticsResponse.lastOrderAmount,//最后下单金额
					lastOrderTime: data.innerShopDataStatisticsResponse.lastOrderTime,//最后下单时间
					totalOrders: data.innerShopDataStatisticsResponse.totalOrders,//订单总数
					totalOrderAmount: data.innerShopDataStatisticsResponse.totalOrderAmount,//订单总金额
					avgSku: data.innerShopDataStatisticsResponse.avgSku,//平均sku
					avgOrderValue: data.innerShopDataStatisticsResponse.avgOrderValue,//平均客单价
					frequency: data.innerShopDataStatisticsResponse.frequency,//下单频次
					remark: data.remark,//备注
					beLongerId: data.beLongerId,
					businessStatus: data.businessStatus,
					reason: data.reason || '',
					annexStatus: data.annexStatus,
					latitude: data.latitude,
					longitude: data.longitude
				}
				this.detail = detail;
				this.isOwner = this.$store.state.user.userInfo.userId == detail.beLongerId
			},
			toModifyPage() {
				uni.navigateTo({
					url:"/pages/users/proxyRegister/index?id="+this.customerId
				})
			},
			async handleModifyReason() {
				const params = {
					reason: this.reason,
					id: this.customerId,
					enableExtend: true
				}
				try {
					await updateCustomer(params)
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					})
					this.isShowCause = false
					this.getDetail()
				} catch(e) {
					console.log(e)
					//TODO handle the exception
				}
				
			},
			toPage(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		padding: 30rpx;
		background-color: #fff;

		.user-card {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx 0 36rpx 0;
			.user-img>image {
				width: 120rpx;
				height: 120rpx;
				display: block;
				border-radius: 8rpx;
			}

			.user-info {
				padding-left: 30rpx;
				font-size: 28rpx;
				flex: 1;

				.shop-name {
					color: #333;
					font-weight: bold;
				}

				.color-primary > image {
					width: 28rpx;
					height: 30rpx;
					display: block;
				}
			
			}

			.user-time {
				margin-top: 18rpx;
				color: #999;
				font-size: 24rpx;

				.type {
					border-radius: 4rpx;
					background-color: rgba(0, 199, 106, 0.3);
					color: #00C76A;
					font-size: 20rpx;
					padding: 2rpx 10rpx;
					margin-right: 14rpx;
				}
			}
		}

		.user-tabel {
			width: 100%;
			display: grid;
			gap: 20rpx 20rpx;
			grid-template-columns: repeat(3, 1fr);
			.item {
				border-radius: 16rpx;
				text-align: center;
				background-color: #F7F7F7;
				padding: 18rpx;

				&.gird-full {
					grid-column: 1/4;
					text-align: left;
					.title {
						margin: 10rpx 0 0;
					}
					.modify-cause {
						color: #FF920F;
					}
				}

				.title {
					font-weight: bold;
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}

				.descraption {
					color: #5F3605;
					font-size: 24rpx;
				}
			}

			.item-date-container {
				grid-column: 1/4;
				grid-template-columns: repeat(4, 1fr);
				gap: 20rpx;
				.item {
					text-align: left;
					&:nth-child(odd) {
						grid-column: 1/3;
					}
					&:nth-child(even) {
						grid-column: 3/5;
					}
				}
				.title {
					margin: 10rpx 0 0;
				}
			}
		}

		// .table-footer {
		// 	justify-content: space-between;
		// 	flex-wrap: wrap;
		// 	margin: 0 -10rpx;
		// 	.item-box {
		// 		padding: 18rpx;
		// 		background-color: #F7F7F7;
		// 		border-radius: 16rpx;
		// 	}
		// 	.item {
		// 		flex: 1 0 50%;
		// 		margin-top: 20rpx;
		// 		padding: 0 10rpx;
		// 		box-sizing: border-box;
		// 		text-align: left;
		// 		&:last-child {
		// 			margin-top: 20rpx;
		// 			text-align: left;
		// 		}
		// 		.title {
		// 			margin: 10rpx 0 0;
		// 		}
		// 	}

		// }

	}

	.content {
		padding-bottom: 160rpx;

		.user-info-tabs {
			font-size: 28rpx;
			color: #999;

			.item {
				// flex: 1 0 160rpx;
				text-align: center;
				padding: 20rpx 0;
				background-color: #ECECEC;

				&.active {
					background-color: #fff;
					//clip-path: polygon(100% 20%, 100% 80%, 0 0, 0 0);
				}
			}
		}
	}

	.footer-btns {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
		box-shadow: 10rpx 0 15rpx #ECECEC;

		.modify {
			color: #666;
			font-size: 24rpx;

			.edit-icon {
				width: 32rpx;
				height: 32rpx;
				display: block;
			}
		}

		.btns-container {
			button {
				width: 200rpx;
				height: 82rpx;
				font-size: 32rpx;
				border-radius: 12rpx;
				border: none;
				letter-spacing: 2rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.contact-btn {
				background-color: rgba(255, 146, 15, 0.3);
				color: #FF920F;
				margin-right: 20rpx;
			}

			.writer-btn {
				background-color: rgba(255, 146, 15, 1);
				color: #fff;
			}
		}
	}
	
	.contact-title {
		border-bottom: 2rpx solid #F7F7F7;
		padding-bottom: 40rpx;
	}
	
	
	.contact-item {
		border-bottom: 2rpx solid #F7F7F7;
		.call-icon {
			width: 40rpx;
			height: 40rpx;
			display: block;
		}
		&:last-child {
			border: none;
		}
	}
</style>