<template>
	<view class="audit-details">
		<view class="audit-header">
			<view class="shop-info-item flex">
				<view class="info-item-title">门店ID：</view>
				<view class="info-item-content fjs-flex-1">{{details.shopId}}</view>
			</view>
			<view class="shop-info-item flex">
				<view class="info-item-title">门店名称：</view>
				<view class="info-item-content fjs-flex-1">{{details.shopName}}</view>
			</view>
			<view class="shop-info-item flex">
				<view class="info-item-title">门店地址：</view>
				<view class="info-item-content fjs-flex-1">{{details.address}} </view>
			</view>
			<view class="shop-info-item flex">
				<view class="info-item-title">门头照片：</view>
				<view class="info-item-content fjs-flex-1">
					<image class="shop-img" :src="details.doorImg"></image>
				</view>
			</view>
			<view class="shop-info-item flex" v-if="[2,3].includes(details.auditStatus)">
				<view class="info-item-title">审核备注：</view>
				<view class="info-item-content fjs-flex-1">{{details.reason || "无"}} </view>
			</view>
		</view>
		<view class="exceed-price-goods fjs-m-t-16">
			<view class="title-icon flex flex-align-center">超出议价底价的商品</view>
			<view class="product-list fjs-m-t-24" v-for="item in exceedPriceList" :key="item.productId">
				<view class="product-list-item">
					<view class="list-item-header flex flex-align-center">	
						<image class="list-item-image" :src="item.image"></image>
						<text class="color-primary">{{item.storeNo}}</text>
						<text class="fjs-m-l-20 color-black font-bold fjs-font-24">{{item.productName}}</text>
					</view>
					<view class="unit-list">
						<view class="unit-list-item grid" v-for="attValue in item.storeProductAttrValuePriceResponse" :key="attValue.attrValueId">
							<view class="unit-info">
								编号：{{attValue.skuNo}}
							</view>
							<view class="unit-info">
								规格：{{attValue.skuName}}
							</view>
							<view class="unit-info">
								原价：{{attValue.price}}
							</view>
							<view class="unit-info color-primary">
								原议价：{{attValue.sourceShopPrice || '无'}}
							</view>
							<view class="unit-info" :class="attValue.isOutFloorPrice === 1 ? 'color-error' : ''" >
								申请议价：{{attValue.shopPrice || '无'}}
								<text v-if="attValue.isOutFloorPrice === 1" >(超出底价)</text>
							</view>
							<view class="unit-info">
								日销量：{{attValue.daySalesNum || '无'}}
							</view>					
						</view>
					</view>
				</view>
			</view>
			<u-empty
				v-if="exceedPriceList.length === 0"
				mode="list"
				width="100"
				text="暂无数据"
				icon="/static/images/no-shop.png"
			/>
		</view>
		<view class="exceed-price-goods fjs-m-t-16">
			<view class="title-icon flex flex-align-center">未超出议价底价的商品</view>
			<view class="product-list fjs-m-t-24" v-for="item in notExceedPriceList" :key="item.productId">
				<view class="product-list-item">
					<view class="list-item-header flex flex-align-center">	
						<image class="list-item-image" :src="item.image"></image>
						<text class="color-primary">{{item.storeNo}}</text>
						<text class="fjs-m-l-20 color-black font-bold fjs-font-24">{{item.productName}}</text>
					</view>
					<view class="unit-list">
						<view class="unit-list-item grid" v-for="attValue in item.storeProductAttrValuePriceResponse" :key="attValue.attrValueId">
							<view class="unit-info">
								编号：{{attValue.skuNo}}
							</view>
							<view class="unit-info">
								规格：{{attValue.skuName}}
							</view>
							<view class="unit-info">
								原价：{{attValue.price}}
							</view>
							<view class="unit-info color-primary">
								原议价：{{attValue.sourceShopPrice || '无'}}
							</view>
							<view class="unit-info">
								申请议价：{{attValue.shopPrice || '无'}}
							</view>
							<view class="unit-info">
								日销量：{{attValue.daySalesNum || '无'}}
							</view>		
						</view>
					</view>
				</view>
			</view>
			<u-empty
				v-if="notExceedPriceList.length === 0"
				mode="list"
				width="100"
				text="暂无数据"
				icon="/static/images/no-shop.png"
			/>
		</view>
		<view class="footer-btns" v-if="isShowAuditbtn">
			<button  type="primary"  hover-class="none" plain @click="isShowAudit = true">审核</button>
		</view>
		<u-modal :show="isShowAudit" title="审核" :showConfirmButton="false">
			<view class="slot-content">
				<view class="modal-form">
					<view class="color-error fjs-font-28 fjs-p-b-16" v-if="exceedPriceList.length > 0">提示：超出了议价底价需要二次申请才能通过</view>
					<view class="audit-result flex flex-align-center fjs-m-b-34">
						<text class="fjs-m-r-20">审核结果：</text>
						<view class="audit-result-radio fjs-flex-1">
							<u-radio-group
								v-model="auditStatus"
								placement="row">
								<u-radio 
									class="fjs-m-r-60" 
									activeColor="#FF920F" 
									:name="isSecondaryAudti ? 4 : 2" 
									:label="isSecondaryAudti ? '申请' : '通过'"
								>
								</u-radio>
								<u-radio activeColor="#FF920F" :name="3" label="不通过"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="remark">	
						<u--textarea v-show="auditStatus === 3" v-model="reason" placeholder="备注:" count></u--textarea>
					</view>
				</view>
				<view class="modal-btns flex">
					<button type="primary" plain class="fjs-m-r-10 cancle-btn" @click="isShowAudit = false">取消</button>
					<button type="primary" plain class="fjs-m-l-10 confirm-btn" @click="$u.debounce(submit,500)">确认</button>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { productBargainingDetail,productBargainingAudit,productBargainingAuditCheck } from '@/api/userDetail'
	import { mapGetters } from "vuex"
	export default {
		data() {
			return {
				configId: "",
				details: {},
				isShowAudit: false,
				reason: '',
				auditStatus: 2,
				labelText: '通过',
				exceedPriceList: [],
				notExceedPriceList: [],
				isSecondaryAudti: false,//是否要二次审核
				isSubmit: true
 			}
		},
		onLoad(params) {
			this.configId = params.id
			this.getProductBargainingDetail()
		},
		computed: {
			...mapGetters(['userInfo']),
			isLeader() {
				return this.userInfo?.dept?.isLeader
			},
			isShowAuditbtn() {
				const auditStatus = this.details.auditStatus
				return auditStatus === 1 && this.$auth.hasPermi('customer:price:audti') || auditStatus === 4 && this.$auth.hasPermi('customer:price:approval')
			}
		},
		methods: {
			async getProductBargainingDetail() {
				try {
					const { data } = await productBargainingDetail({configId: this.configId})
					this.details = data
					this.exceedPriceList = data.customerPriceAttrList.filter(item => {
						return item.storeProductAttrValuePriceResponse.some(item => item.isOutFloorPrice === 1)
					})
					this.notExceedPriceList = data.customerPriceAttrList.filter(item => {
						return item.storeProductAttrValuePriceResponse.every(item => item.isOutFloorPrice !== 1)
					})
					this.isSecondaryAudti = data.auditStatus === 1 && this.exceedPriceList.length > 0
					this.auditStatus = this.isSecondaryAudti ? 4 : 2
				} catch(e) {
					//TODO handle the exception
					console.log('获取网络数据错误！',e)	
				}			
			},
			async submit() {
				if(!this.isSubmit) return
				this.isSubmit = false
				const params = {
					auditStatus: this.auditStatus,
					id: this.configId,
					reason: this.reason
				}
				try {
					await productBargainingAudit(params)
					this.isShowAudit = false
					this.$modal.msgSuccess(`${this.isSecondaryAudti ? '申请' : '审核'}成功！`)
					setTimeout(() => uni.navigateBack(),1000)					
				} catch(e) {
					console.log(e)
					//TODO handle the exception
				} finally {
					this.isSubmit = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.audit-details {
		padding: 30rpx 30rpx 190rpx;
	}
	.audit-header {
		border-radius: 16rpx;
		background-color: #fff;
		padding: 0 30rpx;
		.shop-info-item {
			padding: 30rpx 0 32rpx;
			border-bottom: 2rpx solid #F7F7F7;
			.info-item-title {
				color: #666;
				width: 200rpx;
			}
			&:last-child {
				border: none;
			}
			.shop-img {
				width: 68rpx;
				height: 68rpx;
				display: block;
			}
		}
	}
	.exceed-price-goods .title-icon::before {
		display: block;
		content: '';
		width: 12rpx;
		height: 32rpx;
		background-color: #FF920F;
		border-radius: 6rpx;
		margin-right: 18rpx;
	}
	.product-list-item {
		background-color: #fff;
		border-radius: 16rpx;
		.list-item-header {
			padding: 20rpx;
			.list-item-image {
				width: 38rpx;
				height: 38rpx;
				display: block;
				margin-right: 20rpx;
			}
		}
		.unit-list-item { 
			background-color: #FFF8EF;
			padding: 12rpx 20rpx;
			font-size: 24rpx;
			grid-template-columns: minmax(186rpx,1fr) 2fr minmax(126rpx,1fr);
			gap: 16rpx 10rpx;
			.shop-price {
				grid-column: 2/4;
			}
			.unit-info {
				color: #666;
				line-height: 40rpx;
			}
			&:nth-child(even) {
				background-color: #FEE8CD;
			}
			&:last-child {
				border-radius: 0rpx 0rpx 16rpx 16rpx;
			}
		}
	}
	.footer-btns {
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
			border: none;
		}
	}
	/deep/ .u-modal__title {
		border-bottom: 1px solid rgba(214, 215, 217,0.5);
		padding-bottom: 30rpx;
		padding-top: 30rpx;
		color: #333;
	}
	.slot-content {
		width: 100%;
		padding: 4rpx 14rpx 0 ;
	}
	.modal-btns {
		margin-top: 30rpx;
		.cancle-btn {
			background-color: #ECECEC;
		}
		.confirm-btn {
			background-color: #FF920F;
		}
		.cancle-btn,.confirm-btn {
			width: 50%;
			height: 80rpx;
			border-radius: 40rpx;
			border: none;
			color: #fff;
			font-size: 32rpx;
		}
	}
</style>