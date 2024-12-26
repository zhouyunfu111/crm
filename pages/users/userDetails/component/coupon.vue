<template>
	<view class="coupon">
		<view class="coupon-list">
			<view class="coupon-list-item" v-for="item in list">
				<view class="coupon-list-title flex flex-row-between">					
					<view class="title-container flex">
						<view v-if="item.useType == 1" class="coupon-tag fjs-m-r-20 ">通用</view>
						<view v-if="item.useType == 2" class="coupon-tag fjs-m-r-20 ">商品券</view>
						<view v-if="item.useType == 3" class="coupon-tag fjs-m-r-20 ">品类券</view>
						<view class="title-name">
							<span v-if="item.way==1">【¥{{item.money}}】</span>
							<span v-if="item.way==2">【{{item.discount*10}}折】</span>
							{{item.name}}
							</view>
					</view>
					<view :class="item.status == 0 ? 'coupon-status-usable fjs-font-24' : 'coupon-status-disabled fjs-font-24'	">{{item.status == 0 ? '可用' : '不可用'}}</view>
				</view>
				<view class="coupon-time flex fjs-font-24 color-info fjs-m-t-26 flex-align-center">
					<text>{{item.startTime}}</text>
					<text class="fjs-p-x-10">~</text>
					<text>{{item.endTime}}</text>
				</view>
			</view>
		</view>
		<view class="load-more fjs-p-b-10">
			<u-loadmore v-if="list.length > 0" :status="loadmore" paddingBottom="15" fontSize="14" />
		</view>
		<view v-if="list.length === 0" class="no-data">
			<u-empty mode="list" text="暂无记录" icon="/static/images/no-shop.png"/>
		</view>
	</view>
</template>

<script>
	import { couponList} from '@/api/index.js'
	export default {
		name: 'coupon',
		props:{
			customerId: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				list:[],
				couponParams: {
					pageNum: 1,
					pageSize: 5,
				},
				loadmore : 'loadmore',
			}
		},
		async mounted(){
			let that = this;
			this.list=[];
			this.couponParams.pageNum = 1;
			this.loadmore = 'loadmore';
			await this.getCouponList();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				if(that.loadmore == 'loadmore'){
					that.couponParams.pageNum++
					that.getCouponList()
				}
			})
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		methods:{
			async getCouponList(){
				try {
					this.couponParams.customerId = this.customerId;
					const { rows,total } = await couponList(this.couponParams);
					this.list = this.list.concat(rows);
					if (this.couponParams.pageSize > total) {
						this.loadmore = 'nomore';	
					}
				} catch(e) {
					console.log(e)
					this.loadmore = 'nomore'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-list-item {
		padding: 30rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		
		.title-container{
			font-size: 28rpx;
		}
		
		.coupon-tag {
			padding: 2rpx 8rpx;
			background-color: #C60203;
			margin-right: 20rpx;
			color: #fff;
			font-size: 20rpx;
			line-height: 32rpx;
			height: 32rpx;
		}
		.coupon-status-usable {
			border-radius: 25rpx;
			padding: 0 15rpx;
			color: #C60203;
			border: 2rpx solid #C60203;
			line-height: 40rpx;
		}
		.coupon-status-disabled {
			border-radius: 25rpx;
			padding: 0 15rpx;
			color: #999999;
			border: 2rpx solid #999999;
			line-height: 40rpx;
		}
		
	}
</style>