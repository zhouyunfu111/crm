<template>
	<view class="data-borad">
		<!-- 个人数据开始 -->
		<data-card title="个人数据" :data="personData" @change="getPersonData" :userName="deptName+'-'+userInfo.nickName"/>
		<!-- 个人数据结束 -->
		<!-- 团队数据开始 -->
		<data-card title="团队数据" :data="teamData" :memberData="memberData" @change="getTeamData" @nextPage="nextMemberData" :isTeam="isTeam" v-if="isTeam" :userName="userInfo.dept && userInfo.dept.deptName+'-'+userInfo.nickName+'的团队'"/>
		<!-- 团队数据结束 -->
		<!-- 销售趋势开始 -->
		<view class="sale-charts fjs-m-t-30">
			<view class="header flex flex-row-between">
				<view class="charts-title">
					<image class="title-icon" src="@/static/images/dataBorad/sale.png"></image>
					<view>销售趋势</view>
				</view>
				<view class="select-date flex fjs-m-t-10" @click="isShowDateSale = true">
					<view>{{saleText}}</view>
					<image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image>
				</view>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="saleOpts" :chartData="saleData" />
			</view>
		</view>
		<!-- 销售趋势结束 -->
		<!-- 客户分层开始 -->
		<view class="custom-charts fjs-m-t-30">
			<view class="header flex flex-row-between">
				<view class="charts-title flex flex-align-center">
					<image class="title-icon" src="@/static/images/dataBorad/custom.png"></image>
					<view>客户分层</view>
				</view>
				<!-- <view class="select-date flex fjs-m-t-10" @click="isShowDate = true">
					<view>{{customText}}</view>
					<image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image>
				</view> -->
			</view>
			<view class="charts-box">
				<qiun-data-charts type="ring" :opts="customOpts" :chartData="customData" />
			</view>
		</view>
		<!-- 客户分层结束 -->
		<!-- 销量排行开始 -->
		<view class="sale-rangk fjs-m-t-30">
			<view class="header flex flex-row-between">
				<view class="charts-title flex flex-align-center">
					<image class="title-icon" src="@/static/images/dataBorad/sale-rangk.png"></image>
					<view>销量排行</view>
				</view>
				<view class="select-date flex fjs-m-t-10" @click="isShowDatePicker = true">
					<view>{{$u.timeFormat(saleRangkdate, 'yyyy-mm')}}</view>
					<image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image>
				</view>
			</view>
			<view class="rangk-list" >
				<view class="rangk-title flex">
					<view><text style="margin-left: 8rpx"></text>排名</view>
					<view>昵称</view>
					<view>部门</view>
					<view class="text-center">成交金额</view>
				</view>
				<view class="rangk-item flex" v-for="(item,index) in rankData" :key="'rank'+index">
					<view class="number">
						<image v-if="index+1==1" src="@/static/images/dataBorad/rangk-1.png"></image>
						<image v-else-if="index+1==2" src="@/static/images/dataBorad/rangk-2.png"></image>
						<image v-else-if="index+1==3" src="@/static/images/dataBorad/rangk-3.png"></image>
						<view v-else class="fjs-p-l-18">{{index+1}}</view>
					</view>
					<view class="user-name flex">
						<image v-if="item.avatar" class="user-head" :src="item.avatar"></image>
						<image v-else class="user-head" src="@/static/images/banner/banner01.jpg"></image>
						<text>{{item.nickName || ''}}</text>
					</view>
					<view class="user-name">
						{{item.deptName || ''}}
					</view>
					<view class="finish-money text-center">
						¥{{item.orderAmount}}
					</view>
				</view>
				<view class="one-more-btn flex">
					<view v-if="rankLoadmore == 'loadmore' && rankData.length > 0" @click="nextSalesRank">加载更多 <image class="arrow-bottom" src="@/static/images/dataBorad/arrow-bottom.png"></image></view>
				</view>
				<u-empty
					v-if="rankData.length === 0"
					text="本月无销量数据"
					icon="/static/images/not-history.png"
				/>
			</view>
			<!-- 销量排行结束 -->
			<!-- 销量排行时间选择 -->
			<u-datetime-picker :show="isShowDatePicker" v-model="saleRangkdate" mode="year-month" @confirm="dateTimeChange"
				@cancel="isShowDatePicker = false"></u-datetime-picker>
			<!-- 销量排行时间选择 -->
			<!-- 时间选择picke -->
<!-- 			<u-picker :show='isShowDate' :columns="dateColumns" @confirm="confirmDate"
				@cancel="isShowDate = false"></u-picker> -->
			<!-- 时间选择picke -->
			<!-- 销售趋势2picke -->
			<u-picker :show="isShowDateSale" :columns="[dateColumns]" keyName="label" @confirm="confirmDateSale"
				@cancel="isShowDateSale = false"></u-picker>
			<!-- 销售趋势p2icke -->
		</view>
	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	import dataCard from './components/data-card.vue'
	import { customerLevel,statistics,teamStatistics,teamStatisticsList,salesTrend,salesRank} from '@/api/dataBorad.js'
	export default {
		data() {
			return {
				saleRangkdate: new Date().getTime(),
				customText: '按日统计',
				saleText: '按日统计',
				isShowDatePicker: false,
				isShowDate: false,
				isShowDateSale: false,
				isShowSelectUser: true,
				isTeam: false,
				dateColumns: [
					{label: '按日统计', value:'lately7'},
					{label: '按周统计', value:'lately7Week'},
					{label: '按月统计', value:'year'}
				],
				saleData: {
					// categories: ['01/01', '12/12', '33/12'],
					// series: [{
					// name: "销售额",
					// data: [1,2,3,4,5]
				// } ]
				},
				customData: {
					// series: [{
					// 	data: [{
					// 		"name": "高价值",
					// 		"value": 10
					// 	}, {
					// 		"name": "活跃",
					// 		"value": 30
					// 	}, {
					// 		"name": "潜力",
					// 		"value": 20
					// 	}, {
					// 		"name": "保持",
					// 		"value": 18
					// 	}, {
					// 		"name": "低价值",
					// 		"value": 8
					// 	}]
					// }]
				},
				saleOpts: {
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						fontSize: 10 // 设置字体大小为16
					},
					yAxis: {
						data: [{
							min: 0,
							fontSize: 10 // 设置字体大小为16
						}],
					},
					extra: {
						column: {
							type: "group",
							width: 20,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					},
					padding: [20, 10, 0, -2]
				},
				customOpts: {
					enableScroll: false,
					rotate: false,
					rotateLock: false,
					padding: [5, 5, 5, 5],
					legend: {
						show: true,
						position: "right",
						lineHeight: 25
					},
					title: {
						name: ''
					},
					subtitle: {
						name: ''
					},
					name: '',
					extra: {
						pie: {
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF",
							linearType: "custom"
						}
					}
				},
				memberParams: {
					pageNum: 1,
					pageSize: 3,
				},
				rankParams: {
					pageNum: 1,
					pageSize: 5,
				},
				personData: {},
				teamData: {},
				memberData: [],
				rankData: [],
				rankLoadmore : 'loadmore',
			}
		},
		components: {
			dataCard,
		},
		computed: {
			...mapGetters(['userInfo']),
			deptName() {
				return this.userInfo?.dept?.deptName || ''
			}
		},
		onLoad(){
			this.getData()
		},
		methods: {
			getData(){
				// 个人统计数据
				this.getPersonData('today');
				// 是否是负责人
				if(this.$store.state.user?.userInfo?.dept?.isLeader){
					this.isTeam = true;
					// 团队统计数据
					this.getTeamData('today');
				}
				// 销售趋势
				this.getSalesTrend('lately7');
				// 客户分层
				this.getCustomerLevel();
				// 销售排行
				this.getSalesRank(this.$u.timeFormat(new Date().getTime(), 'yyyy-mm'))
			},
			// 个人统计
			async getPersonData(dateLimit){
				const { data } = await statistics({dateLimit:dateLimit});
				this.personData = data;
			},
			// 团队统计
			async getTeamData(dateLimit){
				// 团队统计数据
				const { data } = await teamStatistics({dateLimit:dateLimit});
				this.teamData = data;
				
				//团队统计成员列表
				this.memberParams.pageNum = 1;
				this.memberParams.dateLimit = dateLimit;
				const { rows } = await teamStatisticsList(this.memberParams);
				this.memberData = rows;
			},
			// 团队统计成员列表-翻页
			async nextMemberData(){
				this.memberParams.pageNum++;
				const { rows, total } = await teamStatisticsList(this.memberParams);
				this.memberData = this.memberData.concat(rows);
				if (this.memberParams.pageSize > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
				}
			},
			// 销售趋势统计
			async getSalesTrend(dateLimit){
				const { data } = await salesTrend({dateLimit:dateLimit});
				let seriesData = [];
				let categories = [];
				for (let key in data) {
				  seriesData.push(data[key]);
				  categories.push(key);
				}
				this.saleData = {
					categories: categories,
						series: [{
						name: "销售额",
						textSize: 8,
						data: seriesData
					}]
				}
			},
			// 客户分层统计
			async getCustomerLevel(dateLimit){
				const { data } = await customerLevel();
				this.customData = {
						series: [{
						data: data
					}]
				}
			},
			// 销售排行榜
			async getSalesRank(dateLimit){
				this.rankParams.pageNum = 1;
				this.rankParams.dateLimit = dateLimit;
				const { rows } = await salesRank(this.rankParams);
				this.rankData = rows;
				this.rankLoadmore = 'loadmore';	
			},
			// 销售排行榜-翻页
			async nextSalesRank(){
				this.rankParams.pageNum++;
				const { rows, total } = await salesRank(this.rankParams);
				this.rankData = this.rankData.concat(rows);
				if (this.rankParams.pageSize > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
					this.rankLoadmore = 'nomore';		
				}
			},
			dateTimeChange(value) {
				this.isShowDatePicker = false
				this.getSalesRank(this.$u.timeFormat(value.value, 'yyyy-mm'))				
			},
			confirmDate(e) {
				this.customText = e.value[0]
				this.isShowDate = false
			},
			confirmDateSale(e) {
				this.saleText = e.value[0].label
				this.isShowDateSale = false
				this.getSalesTrend(e.value[0].value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F7F7F7;
	}

	.data-borad {
		padding: 30rpx 30rpx 130rpx;

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

		.charts-title {
			font-weight: bold;
			display: flex;
			align-items: center;
			font-size: 28rpx;

			.title-icon {
				width: 24rpx;
				height: 26rpx;
				margin-right: 15rpx;
			}
		}

		.sale-charts,
		.custom-charts,
		.sale-rangk {
			padding: 30rpx;
			background: linear-gradient(180deg, rgba(255, 155, 22, 0.15) 10%, #FFFFFF 33%);
			border-radius: 16rpx;
		}

		.sale-rangk .title-icon {
			width: 26rpx;
			height: 26rpx;
		}

		.rangk-list {
			margin-top: 62rpx;

			.rangk-title view,
			.rangk-item view {
				font-size: 24rpx;
				color: #666;

				&:first-child {
					width: 17%;
				}

				&:nth-child(2) {
					width: 33%;
					text-align: center;
				}

				&:nth-child(3) {
					width: 30%;
					text-align: center;
				}

				&:nth-child(4) {
					width: 20%;
				}
			}
		}

		.rangk-item {
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #333;
			align-items: center;

			.user-name {
				align-items: center;

				.user-head {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 22rpx;
				}
			}

			.number {
				font-weight: 600;
				font-size: 32rpx;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}

		}

		.charts-box {
			width: 100%;
			margin-top: 20rpx;
			height: 400rpx;
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