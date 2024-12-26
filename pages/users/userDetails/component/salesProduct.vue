<template>
	<view class="sales-proudct">
		<view class="sales-proudct-header">
			<view class="tools-btn flex" v-if="isOwner">
				<view class="add-record button flex" type="primary" plain @click="toAddPage">
					<u-icon name="plus" color="#FF920F" size="12"></u-icon> 
					<text class="fjs-m-l-10">添加记录</text>	
				</view>
				<view class="upload-files button flex" type="primary" plain @click="uploadImg">
					<u-icon name="plus" color="#FF920F" size="12"></u-icon> 
					<text class="fjs-m-l-10">上传附件</text>			
				</view>
				<view class="modify-status button flex" type="primary" plain @click="modifyStatus" v-show="isShowModifyStatus">
					<text>完成</text>			
				</view>
			</view>
			<view class="purchase-orders-images flex flex-wrap" v-if="annexList.length > 0">
				<view class="item-images fjs-m-b-14" v-for="(item,index) in annexList" :key="item.id">
					<image :src="item.image" mode="aspectFill" @click="$util.previewImage(index,[item.image])"></image>
					<view class="item-images-deletable" @click="deleteAnnex(item.id)">
						<view class="item-images-deletable-icon">
							<u-icon
							    name="close"
							    color="#ffffff"
							    size="10"
							></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="sales-product-list">
			<view class="product-list-item" v-for="item in list" :key="item.id">
				<view class="product-item-header flex flex-row-between">
					<view class="flex flex-align-center">
						<view class="product-item-tage fjs-m-r-20 relevance" v-if="item.tag">
							{{item.tag}}
						</view>
						<view class="product-item-title fjs-font-24 bold color-black">
							{{item.productName + `(${item.brandName})`}}
						</view>
					</view>
					<view class="product-item-tool" v-if="isOwner">
						<image class="fjs-m-r-40" src="../../../../static/images/userDetails/delete-icon.png" @click="deleteConfirm(item)"></image>
						<image src="../../../../static/images/userDetails/edit-icon.png" @click="recordEdit(item)"></image>
					</view>
				</view>
				<view class="product-item-info grid fjs-m-b-20">
					<view class="info-item">
						采购价：{{item.purchasePrice}}
					</view>
					<view class="info-item">
						规格：{{item.specName}}
					</view>
					<view class="info-item">
						类型：{{ $util.getDictLabelByValue('product_type',item.productType) }}
					</view>
					<view class="info-item">
						品牌：{{item.brandName}}
					</view>
					<view class="info-item">
						日销量：{{item.dailySales}}
					</view>
					<view class="info-item">
						是否领样：{{['否','是'][item.isSample]}}
					</view>
				</view>
				<view class="product-item-remark color-info fjs-m-t-26 fjs-font-24 ">
					<text>备注：{{item.remark}}</text>
				</view>
			</view>
			<view class="load-more fjs-p-b-10" v-if="list.length > 0">
				<u-loadmore :status="status" paddingBottom="15" fontSize="14" />
			</view>
			<view v-if="list.length === 0" class="no-data fjs-p-b-30" style="background-color: #fff;">
				<u-empty mode="list" text="暂无记录" icon="/static/images/no-shop.png"  />
			</view>
		</view>
	</view>
</template>

<script>
	import { customerSaleProductList,
		deleteSaleProduct,
		saleProductAnnexList,
		addProductSaleAnnexSave,
		deleteSaleProductAnnex,
		updateProductannexStatus
	} from '@/api/userDetail.js'
	export default {
		name: 'salesProduct',
		props:{
			customerId: {
				type: Number,
				default: 0
			},
			isOwner: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				list:[],
				params: {
					pageNum: 1,
					pageSize: 5,
				},		
				status : 'loadmore',
				annexList: [],
			}
		},
		mounted(){
			this.list = [];
			this.params.pageNum = 1;
			this.status = 'loadmore';
			this.getSaleProductList();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				if(this.status == 'loadmore'){
					this.params.pageNum++
					this.getSaleProductList()
				}
			})
			uni.$off('refresh_product')
			uni.$on('refresh_product', () => {
				this.initData();
			})
			this.saleProductAnnexList()
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		computed: {
			isShowModifyStatus() {
				return this.list.length > 0
			}
		},
		methods:{
			initData(){
				this.list = [];
				this.params.pageNum = 1;
				this.status = 'loadmore';
				this.params.customerId = this.customerId;
				this.getSaleProductList();
			},
			async getSaleProductList(){
				this.params.customerId = this.customerId;
				const { rows,total } = await customerSaleProductList(this.params);
				this.list = this.params.pageNum === 1 ? rows : this.list.concat(rows)
				if (this.params.pageSize > total) {
					this.status = 'nomore';	
				}
			},
			async saleProductAnnexList(){
				const { rows } = await saleProductAnnexList(this.params);
				this.annexList = rows
			},
			deleteConfirm(item) {
				uni.showModal.call(this, {
					title: '删除提示',
					content: '确定要删除该记录吗？',
					confirmColor: '#ff920f',
					success:(res) => {
						if (res.confirm) {
							deleteSaleProduct(item.id).then(() => {
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								})
								this.initData()
							})
						}
					}
				})
			},
			toAddPage() {
				uni.navigateTo({
					url: `/pages/users/addSalesProduct/index?customerId=${this.customerId}`
				})
			},
			recordEdit(item) {
				uni.navigateTo({
					url: "/pages/users/addSalesProduct/index?customerId=" + item.customerId + "&id=" + item.id
				})
			},
			uploadImg() {
				this.$util.uploadImageOne.call(this, { count:1 }, async ({data:{url}}) => {	
					try {
						await addProductSaleAnnexSave({customerId: this.customerId, image: url })
						uni.showToast({
							title: '上传成功',
							icon: 'success'
						})
						this.saleProductAnnexList()
					} catch(e){
						console.log(e)
					}				
				})
			},
			async deleteAnnex(id) {
				const confirm = await this.$modal.confirm('是否删除附件?')
				if(confirm) {
					try {
						await deleteSaleProductAnnex(id)
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
						this.saleProductAnnexList()
					} catch(e) {
						console.log(e)
					}
				}
				
			},
			async modifyStatus() {
				const confirm = await this.$modal.confirm('确定要完成记录吗?')
				if (confirm) {
					try {
						await updateProductannexStatus(this.customerId)
						uni.showToast({
							title: '更改成功',
							icon: 'success'
						})
						this.saleProductAnnexList()
						uni.$emit("upDetails")
					} catch(e) {
						console.log(e)
					}
				}			
			}
		}
	}
</script>

<style lang="scss">
	.sales-proudct-header {
		background-color: #fff;
		padding: 34rpx 30rpx 20rpx;
		.tools-btn {
			margin-bottom: 30rpx;
			.button {
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
		}
		.purchase-orders-images {
			margin-top: 30rpx;
			.item-images {
				margin-right: 20rpx;
				position: relative;
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 16rpx;
				}
				&-deletable {
					position: absolute;
					top: 0;
					right: 0;
					background-color: #373737;
					height: 28rpx;
					width: 28rpx;
					@include flex;
					border-bottom-left-radius: 100px;
					align-items: center;
					justify-content: center;
					z-index: 9;
				
					&-icon {
						position: absolute;
						transform: scale(0.7);
						top: 0;
						right: 0;
						/* #ifdef H5 */
						top: 1px;
						right: 0;
						/* #endif */
					}
				}
			}	
		}
	}
	.product-list-item {
		padding: 30rpx;
		background-color: #fff;	
		margin-bottom: 20rpx;
		&:first-child {
			padding-top: 0;
		}
		.product-item-tage {
			background-color: #009D1C;
			font-size: 20rpx;
			color: #fff;
			padding: 2rpx 8rpx;
		}
		.relevance {
			background-color: #009D1C;
		}
		.cooperation {
			background-color: #FF920F;
		}
		.product-item-tool image{
			width: 24rpx;
			 height: 24rpx;
		}
		.product-item-info {
			margin-top: 22rpx;
			grid-template-columns: repeat(4, 1fr);
			gap: 20rpx 10rpx;
			.info-item {		
				color: #666;
				font-size: 24rpx;
			}
		}
	}
	
	

</style>