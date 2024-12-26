<template>
	<view class="negotiate-price">
		<view class="tools-btn flex flex-row-between" v-if="isOwner">
			<view class="add-record button flex" type="primary" plain @click="toAddPage">
				<u-icon name="plus" color="#FF920F" size="12"></u-icon> 
				<text class="fjs-m-l-10">新建申请单</text>	
			</view>
			<view class="histroy flex flex-align-center fjs-font-24" @click="toPagehistroy" >
				<text class="fjs-m-l-10 color-black">历史申请</text>			
			</view>
		</view>
		<view class="product-list fjs-m-b-24" v-for="item in list" :key="item.productId">
			<view class="product-list-item">
				<view class="list-item-header flex flex-align-center">	
					<image class="list-item-image" :src="item.image"></image>
					<text class="color-primary">{{item.storeNo}}</text>
					<text class="fjs-m-l-20 color-black font-bold fjs-font-24">{{item.productName}}</text>
				</view>
				<view class="unit-list">
					<view class="unit-list-item grid flex-wrap" v-for="attValue in item.storeProductAttrValuePriceResponse" :key="attValue.attrValueId">
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
							议价：{{attValue.shopPrice}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="list.length === 0" class="no-data fjs-p-b-30" style="background-color: #fff;">
			<u-empty mode="list" text="暂无记录" icon="http://cdn.uviewui.com/uview/empty/list.png"/>
		</view>
		<view class="load-more fjs-p-b-10">
			<u-loadmore v-if="list.length > 0" :status="loadmoreStatus" paddingBottom="15" fontSize="14" />
		</view>
	</view>
</template>

<script>
	import { productBargainingAttrDetail } from '@/api/userDetail'
	export default {
		name: "negotiatePrice",
		props: {
			customerId: {
				type: Number,
				default: 0
			},
			isOwner: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				list: [],
				pageParams: {
					pageNum: 1,
					pageSize: 5,
				},
				loadmoreStatus: 'loadmore'
			}
		},
		mounted() {
			this.getNegotiateList()
			uni.$once('negotiateUpdateEvent', () => {
				this.getNegotiateList();
			})
			uni.$on('onReachBottom', () => {
				if (this.loadmoreStatus == 'loadmore') {
					this.pageParams.pageNum++
					this.getNegotiateList()
				}
			})
		},
		methods: {
			async getNegotiateList() {
				try {
					const { rows,total } = await productBargainingAttrDetail({...this.pageParams, customerId:this.customerId})
					this.list = this.pageParams.pageNum === 1 ? rows : this.list.concat(rows)
					total < this.pageParams.pageSize && (this.loadmoreStatus = 'nomore')
					this.pageParams.total = total
				} catch (e) {
					console.log(e)
					this.loadmoreStatus = 'nomore'
				}			
			},
			toAddPage() {
				uni.navigateTo({
					url: `/pages/users/addNegotiate/index?customerId=${this.customerId}`
				})
			},
			toPagehistroy() {
				uni.navigateTo({
					url: `/pages/users/negotiateHistory/index?customerId=${this.customerId}`
				})
			}
		}
	}
</script>

<style lang="scss">

	.tools-btn {
		padding: 24rpx 30rpx;
		background-color: #fff;
		.button {
			display: inline-block;
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
	.product-list-item {
		background-color: #fff;
		border-radius: 16rpx;
		.list-item-header {
			padding: 20rpx 30rpx;
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
			grid-template-columns: repeat(3, 1fr);
			.unit-info {	
				//margin-right: 30rpx;
				color: #666;
				line-height: 40rpx;
			}
			&:nth-child(even) {
				background-color: #FEE8CD;
			}
		}
	}
	.histroy {
		text-decoration-line: underline;
	}

</style>