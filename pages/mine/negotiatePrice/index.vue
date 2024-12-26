<template>
	<view class="negotiate-price">
		<u-subsection 
			:list="list"  
			:current="current" 
			@change="sectionChange"
			activeColor="#FF920F"
		/>
		<view class="negotiate-list">
			<view class="negotiate-list-item flex flex-row-between" v-for="item in orderList" @click="toPageDetail(item.id)">
				<image class="prod-img" :src="item.doorImg ? item.doorImg : '/static/images/shop-img.png'"></image>
				<view class="prod-content flex flex-column">
					<view class="prod-title flex fjs-font-28 flex-align-center flex-row-between">			
						<view class="flex flex-align-center">
							<view class="taget-box fjs-m-r-22">{{item.shopId}}</view>
							<text class="color-black font-bold u-line-1">{{item.shopName}} </text>
						</view>		
						<view class="prod-status" :class="`bgColor${item.auditStatus}`" v-show="current === 1">
							{{['暂存','待审核','已通过','不通过'][item.auditStatus]}}
						</view>
					</view>		
					<view class="examine-info fjs-m-t-24 color-info fjs-font-28">
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
				text="暂无数据"
				icon="/static/images/no-shop.png"
			/>
		</view>
	</view>
</template>

<script>
	import { productBargainingRecord } from '@/api/userDetail'
	export default {
		name: "negotiatePrice",
		data() {
			return {
				list: [{name:'待审核', audit: 1},{name:'已审核', audit: 2},{name:'上报中', audit: 4}],
				current: 0,
				audit: 1,
				orderList: [],
				pageParams: {
					pageNum: 1,
					pageSize: 10,
					total: 0
				},
				loadmoreStatus: "loadmore"
			}
		},
		onLoad() {
			this.getProductBargainingRecord()
		},
		onShow() {
			this.getProductBargainingRecord()
		},
		methods:{
			sectionChange(index) {
				this.current = index
				this.audit = this.list[index].audit
				this.orderList = []
				this.pageParams.pageNum = 1
				this.getProductBargainingRecord()
			},
			async getProductBargainingRecord() {
				try {
					const { rows,total } = await productBargainingRecord({audit:this.audit,...this.pageParams})
					this.orderList = this.pageParams.pageNum === 1 ? rows : this.orderList.concat(rows)
					total < this.pageParams.pageSize && (this.loadmoreStatus = 'nomore')
					this.pageParams.total = total
				} catch(e) {
					console.log(e)
				}			
			},
			toPageDetail(id) {
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
			this.getProductBargainingRecord()
		}
	}
</script>

<style lang="scss">
	.negotiate-list {
		padding: 26rpx;
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
	}
</style>