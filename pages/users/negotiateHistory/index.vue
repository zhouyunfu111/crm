<template>
	<view class="negotiate-history">
		<!-- <view class="subsection" :class="scrollTop > 300 ? 'stick-scroll' : ''">
			<u-subsection
				:list="list"  
				:current="current" 
				@change="sectionChange"
				activeColor="#FF920F"
			/>
		</view>	 -->
		<view class="negotiate-history-list">
			<view class="negotiate-list-item flex flex-row-between" v-for="item in orderList" @click="toPageDetail(item.id,item.auditStatus)">
				<image class="prod-img" :src="item.doorImg ? item.doorImg : '/static/images/shop-img.png'"></image>
				<view class="prod-content flex flex-column">
					<view class="prod-title flex fjs-font-28 flex-align-center flex-row-between">
						<view class="flex flex-align-center">
							<view class="taget-box fjs-m-r-10">{{item.shopId}}</view>
							<text class="color-black font-bold">{{item.shopName}} </text>
						</view>		
						<view class="prod-status" :class="`bgColor${item.auditStatus}`">
							{{['暂存','待审核','已通过','不通过','审核中'][item.auditStatus]}}
						</view>
					</view>		
					<view class="examine-info fjs-m-t-20 color-info fjs-font-28">
						<text>申请信息：</text>
						<text class="fjs-m-r-20">{{item.createByName}}</text>
						<text>{{item.createTime}}</text>
					</view>
					<view class="application-info fjs-m-t-10  color-info fjs-font-28" v-if="item.auditAdminUserName">
						<text>审核信息：</text>
						<text class="fjs-m-r-20">{{item.auditAdminUserName}}</text>
						<text>{{item.auditTime}}</text>
					</view>								
				</view>
			</view>
			<view class="load-more fjs-p-b-10">
				<u-loadmore v-if="orderList.length > 0" :status="loadmoreStatus" paddingBottom="15" fontSize="14" />
			</view>
			<u-empty
				v-if="orderList.length === 0"
				mode="list"
				text="暂无历史数据"
				icon="/static/images/no-shop.png"
			/>
		</view>
	</view>
</template>

<script>
	import { productBargainingRecord } from '@/api/userDetail'
	export default {
		name: 'negotiateHistory',
		data() {
			return {
				list: [{name:'待审核', audit: 1},{name:'已审核', audit: 2},{name:'暂存',audit:0}],
				orderList: [],
				current:0,
				customerId: '',
				pageParams: {
					pageSize: 10,
					pageNum: 1,
					total: 0
				},
				audit: 1,
				loadmoreStatus: "loadmore"
			}
		},
		onLoad(params) {
			this.customerId = params.customerId
		},
		onShow(){
			this.pageParams.pageNum = 1
			this.orderList = []
			this.getHistoryList()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			sectionChange(index) {
				this.current = index
				this.audit = this.list[index].audit
				this.pageParams.total = 0 
				this.pageParams.pageNum = 1
				this.orderList = []
				this.getHistoryList()
			},
			async getHistoryList() {
				const { rows,total } = await productBargainingRecord({customerId: this.customerId,...this.pageParams})
				this.orderList = this.pageParams.pageNum === 1 ? rows : this.orderList.concat(rows)
				total < this.pageParams.pageSize && (this.loadmoreStatus = 'nomore')
				this.pageParams.total = total
			},
			toPageDetail(id,status) {
				if(status === 0) {
					uni.navigateTo({
						url:`/pages/users/addNegotiate/index?customerId=${this.customerId}&id=${id}&status=${status}`
					})
				} else {
					uni.navigateTo({
						url:`/pages/mine/negotiatePrice/details?id=${id}`
					})
				}		
			},
			onReachBottom(){
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
				this.getHistoryList()
			}
		}
	}
</script>

<style scoped lang="scss">
	.negotiate-history-list {
		padding: 24rpx 28rpx;
	}
	.subsection {
		position: sticky;
	}
	.stick-scroll {
		box-shadow:  0 8rpx 13rpx rgba(51,51,51,0.2)
	}
	.taget-box {
		border: 2rpx solid #333;
		border-radius: 8rpx;
		padding: 4rpx 14rpx;
	}
	.negotiate-list-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 26rpx;
		margin-bottom: 20rpx;
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
		.prod-status {
			padding: 2rpx 20rpx;
			color: #fff;
			border-radius: 8rpx;
			font-size: 28rpx;
		}	
		.bgColor0 {
			background-color: #999999;
		}
		.bgColor1 {
			background-color: #FF920F;
		}
		.bgColor2 {
			background-color: #009D1C;
		}
		.bgColor3 {
			background-color: #C60203;
		}
		.bgColor4{
			background-color: #2979ff;
		}
	}
</style>