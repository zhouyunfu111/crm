<template>
	<view class="data-card">
		<view class="header flex flex-row-between">
			<view class="title flex">
				<image class="title-icon" src="@/static/images/dataBorad/user-data.png"></image>
				<text>{{title}}</text>
				<view class="user-name">
					{{userName}}
				</view>
			</view>
			<view class="select-date flex" @click="isShowDate = true">
				<view>{{dateText}}</view>
				<image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image>
			</view>
		</view>
		<view class="this-month-data">
			<view class="title">{{dateText}}</view>
			<view class="data-box flex">
				<view class="item">
					<view class="item-number">
						<text>¥{{data.orderAmount}}</text>
						<image :src="getImageSrc(data.orderAmountRatio)"></image>
						<text class="percentage">{{data.orderAmountRatio}}%</text>
					</view>
					<view class="desc-text">
						销售额
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.orderNum}}
						<image :src="getImageSrc(data.orderNumRatio)"></image>
						<text class="percentage">{{data.orderNumRatio}}%</text>
					</view>
					<view class="desc-text">
						成交订单
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.regShopNum}}
						<image :src="getImageSrc(data.regShopNumRatio)"></image>
						<text class="percentage">{{data.regShopNumRatio}}%</text>
					</view>
					<view class="desc-text">
						注册客户
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.firstOrderNum}}
						<image :src="getImageSrc(data.firstOrderNumRatio)"></image>
						<text class="percentage">{{data.firstOrderNumRatio}}%</text>
					</view>
					<view class="desc-text">
						首次下单
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.avgOrderPrice}}
						<image :src="getImageSrc(data.avgOrderPriceRatio)"></image>
						<text class="percentage">{{data.avgOrderPriceRatio}}%</text>
					</view>
					<view class="desc-text">
						平均客单价
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.reviveShopNum}}
						<image :src="getImageSrc(data.reviveShopNumRatio)"></image>
						<text class="percentage">{{data.reviveShopNumRatio}}%</text>
					</view>
					<view class="desc-text">
						复活客户
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.visitFollowNum}}
						<image :src="getImageSrc(data.visitFollowNumRatio)"></image>
						<text class="percentage">{{data.visitFollowNumRatio}}%</text>
					</view>
					<view class="desc-text">
						外出拜访
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.callFollowNum}}
						<image :src="getImageSrc(data.callFollowNumRatio)"></image>
						<text class="percentage">{{data.callFollowNumRatio}}%</text>
					</view>
					<view class="desc-text">
						电话拜访
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.saleProductShopNum}}
						<image :src="getImageSrc(data.saleProductShopNumRatio)"></image>
						<text class="percentage">{{data.saleProductShopNumRatio}}%</text>
					</view>
					<view class="desc-text">
						销售商品门店
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.saleProductNum}}
						<image :src="getImageSrc(data.saleProductNumRatio)"></image>
						<text class="percentage">{{data.saleProductNumRatio}}%</text>
					</view>
					<view class="desc-text">
						销售商品
					</view>
				</view>
			</view>
		</view>
		<view class="next-month">
			<view class="title">{{dateText.replace('今','昨').replace('本','上')}}</view>
			<view class="data-box flex">
				<view class="item">
					<view class="item-number">
						<text>¥{{data.beforeOrderAmount}}</text>
					</view>
					<view class="desc-text">
						销售额
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeOrderNum}}
					</view>
					<view class="desc-text">
						成交订单
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeRegShopNum}}
					</view>
					<view class="desc-text">
						注册客户
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeFirstOrderNum}}
					</view>
					<view class="desc-text">
						首次下单
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeAvgOrderPrice}}
					</view>
					<view class="desc-text">
						平均客单价
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeReviveShopNum}}
					</view>
					<view class="desc-text">
						复活客户
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeVisitFollowNum}}
					</view>
					<view class="desc-text">
						外出拜访
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeCallFollowNum}}
					</view>
					<view class="desc-text">
						电话拜访
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeSaleProductShopNum}}
					</view>
					<view class="desc-text">
						销售商品门店
					</view>
				</view>
				<view class="item">
					<view class="item-number">
						{{data.beforeSaleProductNum}}
					</view>
					<view class="desc-text">
						销售商品
					</view>
				</view>
			</view>
		</view>	
		<view class="member-list" v-if="isTeam" v-for="(item,index) in memberData" :key="'member'+index">
			<view class="member-item">
				<view class="user-info">    
					<view class="user-head">
						<image v-if="item.avatar" :src="item.avatar"></image>
						<image v-else src="@/static/images/banner/banner01.jpg"></image>
						<view class='user-no'>{{index+1}}</view>
					</view>
					<view class="user-name">
						{{item.nickName}}
					</view>
				</view>
				<view class="data-box flex">
					<view class="item">
						<view class="item-number">
							¥{{item.orderAmount}}
						</view>
						<view class="desc-text">
							销售额
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.orderNum}}
						</view>
						<view class="desc-text">
							成交订单
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.regShopNum}}
						</view>
						<view class="desc-text">
							注册客户
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.firstOrderNum}}
						</view>
						<view class="desc-text">
							首次下单
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.avgOrderPrice}}
						</view>
						<view class="desc-text">
							平均客单价
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.reviveShopNum}}
						</view>
						<view class="desc-text">
							复活客户
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.visitFollowNum}}
						</view>
						<view class="desc-text">
							外出拜访
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.callFollowNum}}
						</view>
						<view class="desc-text">
							电话拜访
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.saleProductShopNum}}
						</view>
						<view class="desc-text">
							销售商品门店
						</view>
					</view>
					<view class="item">
						<view class="item-number">
							{{item.saleProductNum}}
						</view>
						<view class="desc-text">
							销售商品
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="one-more-btn flex" v-if="isTeam && memberData.length > 0">
			<view @click="nextPage">加载更多 <image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image></view>
		</view>
		<u-picker :show='isShowDate' keyName="label" :columns="[dateColumns]" @confirm="confirmDate" @cancel="isShowDate = false"></u-picker>
	</view>
	<!-- 个人数据结束 -->

</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				typeof: () => '个人数据'
			},
			userName: {
				type: String,
				typeof: () => ''
			},
			isTeam: {
				type: Boolean,
				typeof: () => false
			},
			data: {
				type: Object,
				typeof: () => {}
			},
			memberData:{
				type: Array,
				typeof: () => []
			}
		},
		data(){
			return {
				dateColumns: [
					{label: '今日', value:'today'},
					{label: '本周', value:'week'},
					{label: '本月', value:'month'}
					],
				isShowDate: false,
				dateText: '今日'
			}
		},
		methods: {
			confirmDate(e){
				this.dateText = e.value[0].label
				this.isShowDate = false
				this.$emit('change', e.value[0].value)
			},
			nextPage(){
				this.$emit('nextPage')
			},
			getImageSrc(val) {
			  return val >=0
				? require('@/static/images/dataBorad/up.png')
				: require('@/static/images/dataBorad/down.png');
			}
		}
	}
</script>

<style lang="scss">
	.data-card {
		padding: 30rpx 0;
		background: linear-gradient(180deg, rgba(255, 155, 22, 0.15) 10%, #FFFFFF 33%);
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		.header {
			padding: 0 30rpx;
		}
		.title {
			font-weight: 600;
			font-size: 28rpx;
			color: #333;
			align-items: center;
			.title-icon {
				width: 28rpx;
				height: 28rpx;
				padding-right: 10rpx;
				display: block;
			}
			.user-name {
				color: #666;
				font-size: 24rpx;
				padding-left: 10rpx;
			}
		}
	}
	.this-month-data,.next-month {
		margin-top: 16rpx;	
		padding: 0 30rpx;
	}
	.data-box {
		margin-top: 10rpx;
		flex-direction: row;
		flex-wrap: wrap;
		.item {
			width: 25.5%;
			margin-bottom: 20rpx;
			.item-number {
				color: #333;
				font-weight: bold;
				font-size: 28rpx;
				display: flex;
				line-height: 40rpx;
				align-items: center;
				image {
					width: 20rpx;
					height: 28rpx;
					display: block;
					margin-left: 4rpx;
				}
				.percentage {
					font-size: 20rpx;
					color: #333;
					margin-left: 4rpx;
				}
			}
			.desc-text {
				color: #666;
				font-size: 24rpx;
			}
			&:nth-child(4n+1) {
				width: 31%;
			}
			&:nth-child(4n+4) {
				width: 18%;
			}
		}
	}	
	.select-date {
		align-items: center;
		padding: 6rpx 14rpx;
		background-color: #fff;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #333;
		.arrow-bottom {
			width: 22rpx;
			height: 12rpx;
			margin-left: 8rpx;
		}
	}
	.member-list {
		margin-top: 30rpx;
		.user-info {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 20rpx;
			margin-top: 30rpx;
			.user-head {
				position: relative;
				width: 60rpx;
				height: 60rpx;
				margin-right: 20rpx;
				border-radius: 50%;
				overflow: hidden;
				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;					
					display: block;
				}
				.user-no {
					position: absolute;
					width: 100%;
					height: 24rpx;
					bottom: 0;
					font-size: 24rpx;
					line-height: 20rpx;
					background-color: #999;
					color: #fff;
					text-align: center;
				}
			}
			.user-name {
				font-size: 28rpx;
				color: #333333;
			}
		}
		.data-box {
			padding: 20rpx 30rpx;
		}
		.member-item {
			border-top: 2rpx solid #F7F7F7;
		}
	}
	.one-more-btn {
		justify-content: center;
		margin-top: 38rpx;
		font-size: 24rpx;
		color: #666666;
		.arrow-bottom {
			width: 23rpx;
			height: 14rpx;
			margin-left: 10rpx;
		}
	}
</style>