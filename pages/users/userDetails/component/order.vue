<template>
	<view class="order">
		<view class="order-list">
			<view class="order-list-item" v-for="item in list">
				<view class="order-list-title flex flex-row-between fjs-font-28">
					<view class="order-list-date">{{item.createTime}}</view>
					<view class="order-list-status">{{item.orderStatus}}</view>
				</view>
				<view class="order-list-prod flex" v-for="info in item.orderInfoList">					
					<image class="prod-img" :src="info.image"></image>
					<view class="prod-content flex flex-column flex-row-between">
						<view class="prod-title flex flex-row-between fjs-font-28">
							<text class="color-black ">{{info.storeName}}</text>
							<view class="prod-num">x{{info.cartNum}}</view>
						</view>
						<view class="prod-standard color-info flex flex-row-between flex-align-end">
							<text class="fjs-font-24">{{info.sku}}</text>
							<view class="flex prod-price flex-align-end"  style="color:#ff920f"><text class="fjs-font-24">¥</text>{{info.price}}</view>
						</view>
					</view>
				</view>
				<view class="order-list-desc color-black fjs-m-t-32 fjs-font-28 font-bold">
					共{{item.totalNum}}件商品，总金额<text class="fjs-font-22 fjs-m-l-4">¥</text>{{item.payPrice}}，优惠金额<text class="fjs-font-22 fjs-m-l-4">¥</text>{{item.couponPrice}}
				</view>
			</view>
		</view>
		<view class="load-more fjs-p-b-10">
			<u-loadmore v-if="list.length > 0" :status="loadmore" paddingBottom="15" fontSize="14" />
		</view>
		<view v-if="list.length === 0" class="no-data">
			<u-empty mode="list" text="暂无记录" icon="/static/images/no-shop.png" />
		</view>
	</view>
</template>

<script>
	import { orderList} from '@/api/index.js'
	export default {
		name: 'order',
		props:{
			customerId: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				list:[],
				orderParams: {
					pageNum: 1,
					pageSize: 5,
				},
				loadmore : 'loadmore',
			}
		},
		async mounted(){
			let that = this;
			this.list=[];
			this.orderParams.pageNum = 1;
			this.loadmore = 'loadmore';
			await this.getOrderList();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				console.log('order-onReachBottom')
				if(that.loadmore == 'loadmore'){
					that.orderParams.pageNum++
					that.getOrderList()
				}
			})
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		methods:{
			async getOrderList(){
				try {
					this.orderParams.customerId = this.customerId;
					const { rows,total } = await orderList(this.orderParams);
					this.list = this.orderParams.pageNum === 1 ? rows : this.list.concat(rows);
					if (this.orderParams.pageSize > total) {
						this.loadmore = 'nomore';	
					}
				} catch (e) {
					console.log(e)
					this.loadmore = "nomore"
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-list-item {
		padding: 30rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		.order-list-prod {
			margin-top: 24rpx;
			.prod-img {
				width: 100rpx;
				height: 100rpx;
				display: block;
				border-radius: 16rpx;
			}
			.prod-content {
				flex:1;
				padding-left: 18rpx;
			}
		} 
	}
</style>