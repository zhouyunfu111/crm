<template>
	<view class="addNegotiate">
		<view class="header fjs-p-t-20">
			<view class="select-btn" @click="showSelectGoods">选择商品</view>
		</view>
		
		<view class="content fjs-m-t-30" v-show="selectedProductList.length > 0">
			<view class="product-list" v-for="(item,index) in selectedProductList" :key="item.productId">
				<view class="product-list-item">
					<view class="list-item-header flex flex-align-center">	
						<image class="list-item-image" :src="item.image"></image>
						<text class="color-primary">{{item.storeNo}}</text>
						<text class="fjs-m-l-20 color-black font-bold fjs-font-24">{{item.productName}}</text>
					</view>
					<view class="unit-list">
						<view class="unit-list-item grid flex-wrap" v-for="(attrValue,attrIndex) in item.storeProductAttrValueResponse" :key="attrValue.attrValueId">
							<view class="unit-info">
								编号：{{attrValue.storeNo}}
							</view>
							<view class="unit-info">
								规格：{{attrValue.skuName}}
							</view>
							<view class="unit-info">
								原价：{{attrValue.price}}
							</view>
							<view class="item-info flex flex-align-center"
								@click="eidtProattrPrice({
									shopPrice: attrValue.shopPrice || '',
									price: attrValue.price,
									daySalesNum: attrValue.daySalesNum || '',
									index,
									attrIndex
								})">
								<text>议价：{{attrValue.shopPrice}}</text>
								<image class="edit-icon fjs-m-l-10" src="../../../static/images/home/edit.png"></image>
							</view>
							<view class="unit-info flex-align-center">
								日销量：{{attrValue.daySalesNum || '无'}}
							</view>
						</view>
					</view>
				</view>		
			</view>
		</view>
		<view class="footer-btns flex">
			<button class="staging-btn fjs-m-r-14" hover-class="none" type="primary" plain @click="submitNegotiate(0)">暂存</button>
			<button class="submit-btn fjs-m-l-14" hover-class="none" type="primary" plain  @click="submitNegotiate(1)">提交</button>
		</view> 
		<select-goods-modal 
			:show.sync="selectGoodsVisible"
			:list="productList"
			:loadingVisible="loadingVisible"
			:loadmoreStatus="loadmoreStatus"
			title="选择商品"
			type="checkbox"
			valueName="productId"
			labelName="productName"
			@confirm="selectGoodsConfirm"
			@search="searchGoods"
			@scrolltolower="scrolltolower"
		/>
		<u-modal 
			:show="eidtProattrPriceVisible" 
			title="修改议价" 
			showCancelButton
			@confirm="editProattrPriceConfirm"
			@cancel="eidtProattrPriceVisible = false"
		>
			<view class="slot-content">
				<view class="product-price flex flex-align-center">
					<text class="form-item-title">原价</text>
					<text>{{curItem.price}}</text>
				</view>
				<view class="shop-price flex flex-align-center fjs-p-t-24">
					<text class="form-item-title">议价</text>
					<u--input
					    placeholder="请输入价格"
						type="digit"
					    border="surround"
					    v-model="curItem.shopPrice"
						:customStyle="{height:36+'rpx'}"
					  ></u--input>
				</view>
				<view class="day-sales-volume flex flex-align-center fjs-p-t-24">
					<text class="form-item-title">日销量</text>
					<u--input
					    placeholder="请输入日销量"
						type="digit"
					    border="surround"
					    v-model="curItem.daySalesNum"
						:customStyle="{height:36+'rpx'}"
					  ></u--input>
					  <text class="fjs-p-l-10">包</text>
				</view>
				<view class="color-error fjs-p-t-24" v-show="isShopPriceTips">
					提示：议价低于了原价的90%
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import SelectGoodsModal from '@/components/select-goods-modal'
	import { bargainingSelectProductList,productBargainingApply,productBargainingAttrDetail,productBargainingDetail,productBargainingChange } from '@/api/userDetail.js'
	export default {
		name: "addNegotiate",
		components: {
			SelectGoodsModal
		},
		data() {
			return {
				id: '',
				selectGoodsVisible: false,
				customerId: '',
				productList: [],
				selectedProductList: [],
				loadingVisible: false,
				eidtProattrPriceVisible: false,
				pageParams: {
					pageSize: 10,
					pageNum: 1,
					total: 0
				},
				loadmoreStatus: 'loadmore',
				curItem: {
					price: '',
					shopPrice: '',
					index: 0,
					daySalesNum: 0,
					attrIndex: 0
				},
				configId: '',
				status: 1,
				isSubmit: true
			}
		},
		onLoad(params) {
			this.customerId = params.customerId
			if(+params.status === 0) {		
				this.status = params.status
				uni.setNavigationBarTitle({title:'修改议价申请单'})
				this.configId = params.id
				this.getProductBargainingDetail()			
			}
		},
		computed:{
			isShopPriceTips() {
				const {shopPrice,price} = this.curItem
				return shopPrice && shopPrice < price * 0.9
			}
		},
		methods: {
			async getStoreProductList(keyWord = "") {
				try {
					const { rows,total } = await bargainingSelectProductList({keyWord,...this.pageParams,customerId:this.customerId})
					this.productList = this.pageParams.pageNum === 1 ? rows : this.productList.concat(rows)
					total < this.pageParams.pageSize && (this.loadmoreStatus = 'nomore')
					this.pageParams.total = total
				} finally {
					this.loadingVisible = false
				}
			},
			async getProductBargainingDetail() {
				try {
					const { data } = await productBargainingDetail({configId: this.configId})
					this.selectedProductList = data.customerPriceAttrList.map(item => ({...item,storeProductAttrValueResponse:item.storeProductAttrValuePriceResponse}))
				} catch(e) {
					console.log(e)
				}	
			},
			searchGoods(keyWord) {
				this.pageParams.pageNum = 1
				this.loadingVisible = true
				this.productList = []
				this.getStoreProductList(keyWord)
			},
			scrolltolower() {
				const { pageSize,total } = this.pageParams
				if (pageSize > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
					this.loadmoreStatus = 'nomore';		
					return 
				}
				this.pageParams.pageNum++
				this.getStoreProductList()
			},
			showSelectGoods() {
				this.selectGoodsVisible = true
				this.getStoreProductList()
			},
			selectGoodsConfirm({values,selectionList}) {
				this.selectedProductList = selectionList.map(item => ({
					shopPrice: null,
					...item
				}))
			},
			eidtProattrPrice(curItem) {
				this.eidtProattrPriceVisible = true
				this.curItem = curItem
			},
			editProattrPriceConfirm() {
				const { index,attrIndex,shopPrice,daySalesNum } = this.curItem
				try {			
					const productAttrValue = this.selectedProductList[index].storeProductAttrValueResponse[attrIndex]
					productAttrValue.shopPrice = shopPrice || null
					productAttrValue.daySalesNum = daySalesNum
					this.eidtProattrPriceVisible = false
				} catch(e){
					console.log(e)
				}
			},
			async submitNegotiate(auditStatus) {
				const storeProductAttrValueShopPriceInfoAddRequestList = this.selectedProductList.map(item => item.storeProductAttrValueResponse).flat(Infinity)
				const params = {
					auditStatus,
					customerId: this.customerId,
					storeProductAttrValueShopPriceInfoAddRequestList,
				}
				const modifyAttrNum = storeProductAttrValueShopPriceInfoAddRequestList.reduce((cur,next) => {
					return cur = next.shopPrice !== null ? ++cur : cur
				}, 0)
				const modifyProNum = this.selectedProductList.reduce((cur,next) => {
					return cur = next.storeProductAttrValueResponse.some(item => item.shopPrice !== null) ? ++cur : cur
				},0)
				if(storeProductAttrValueShopPriceInfoAddRequestList.length <= 0) {
					return this.$modal.msgError('请先选择商品')
				}
				const tips = `有${modifyProNum}个商品、${modifyAttrNum}个规格的议价进行了修改，确定提交吗？ `
				const confirm = await this.$modal.confirm(tips)
				if(!confirm) return
				uni.showLoading({
					title: '后台处理中...'
				})
				if(!this.isSubmit) return
				this.isSubmit = false
				try {
					this.status === 1 ? await productBargainingApply(params) : await productBargainingChange({...params,id:this.configId})
					this.$modal.msgSuccess('新增成功！')
					uni.hideLoading()
					setTimeout(() => uni.navigateBack(),1000)
				} catch(e) {		
					console.log(e)
				} finally {
					this.isSubmit = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.addNegotiate {
		padding: 0 20rpx 200rpx;
	}
	.select-btn {
		width: 136rpx;
		height: 60rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(255,146,15,0.3);
		border-radius: 12rpx;
		color: #FF920F;
		border: none;
		margin: 0 20rpx 0 0;
		padding: 0 20rpx;	
	}
	.content {
		background-color: #fff;
		padding: 0 16px 28rpx;
		border-radius: 8px;
		.product-list-item {
			background-color: #fff;
			border-radius: 16rpx;
			.list-item-header {
				padding: 20rpx 0;
				.list-item-image {
					width: 38rpx;
					height: 38rpx;
					display: block;
					margin-right: 20rpx;
				}
			}
			.unit-list-item { 
				background-color: #FFF8EF;
				padding: 12rpx 30rpx;
				font-size: 24rpx;
				gap: 16rpx 0;	
				grid-template-columns: repeat(3, minmax(210rpx, 1fr));
				.unit-info {	
					//margin-right: 30rpx;
					color: #666;
					line-height: 40rpx;
				}
				&:nth-child(even) {
					background-color: #FEE8CD;
				}
			}
			.edit-icon {
				width: 28rpx;
				height: 28rpx;
				display: block;
			}
		}
	}
	.slot-content {
		padding-top: 12px;
		.form-item-title {
			width: 120rpx;
		}
	}
	.shop-price-input {
		border: 1px solid #ccc;
	}
	
	.footer-btns {
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 40rpx 30rpx;
		background-color: #fff;
		width: 100%;
		box-sizing: border-box;
		
		.staging-btn {
			background-color: #ECECEC;
			color: #999;
		}
		button {
			width: 50%;
			background-color: #FF920F;
			color: #fff;
			border-radius: 16rpx;
			height: 72rpx;
			font-size: 30rpx;
			border: none;
		}
	}
</style>