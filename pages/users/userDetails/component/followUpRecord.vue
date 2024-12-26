<template>
	<view class="follow-up-record">
		<view class="record-item" v-for="(item,index) in followUpRecordList">
			<view class="record-item-title flex flex-row-between">
				<view class="flex font-bold flex-align-center">
					<text>{{item.followUserName}}</text>
					<image class="exchange-icon" mode="aspectFill" src="@/static/images/userDetails/exchange-icon.png"></image>
					<text>{{item.contactsName}}（{{item.dutyName}}）</text>
				</view>
				<view class="tool flex flex-align-center">
					<image @click="deleteConfirm(item)" class="fjs-m-r-40"
						src="@/static/images/userDetails/delete-icon.png"></image>
					<image @click="recordEdit(item)" src="@/static/images/userDetails/edit-icon.png"></image>
				</view>
			</view>
			<view class="record-item-remark color-info fjs-m-t-10 color-black">
				{{item.content}}
			</view>
			<view class="record-item-images flex" v-if="item.doorPic">
				<image class="image-item" :src="picItem" @click="previewImage(i,item.doorPic)"
					v-for="(picItem,i) in item.doorPic"></image>
			</view>
			<view class="record-item-time fjs-m-t-14 flex flex-row-between">
				<text>本次跟进时间：{{item.followTimeFormat}}</text>
				<text v-if="item.nextFollowTime">下次跟进时间：{{item.nextFollowTimeFormat}}</text>
			</view>
			<view class="record-item-tag flex flex-align-center">
				<view class="tag-box">{{item.followTypeName}}</view>
				<view class="tag-box" v-if="item.purposeTypeName">{{item.purposeTypeName}}</view>
				<view class="tag-box" v-if="item.businessStatus">{{ $util.getDictLabelByValue('business_status', item.businessStatus) }}</view>
				<!-- <view class="play-aduio flex flex-align-center" @click="playAduio(item)">
					<image class="play-aduio-icon fjs-m-r-6" src="@/static/images/userDetails/audio-icon.png"></image>
					<text>播放通话记录</text>
				</view> -->
			</view>
			<!-- <view class="play-aduio-module fjs-m-t-20">
				<audio 
					style="text-align: left" 
					:src="current.src" 
					:poster="current.poster" 
					:name="current.name" 
					:author="current.author" 
					:action="audioAction" 
					controls
				>
				</audio>
			</view> -->
		</view>
		<view class="load-more fjs-p-b-10" v-if="followUpRecordList.length > 0">
			<u-loadmore :status="status" paddingBottom="15" fontSize="14" />
		</view>
		<view class="no-data" v-if="followUpRecordList.length === 0">
			<u-empty
				mode="list"
				text="暂无记录"
				icon="/static/images/no-shop.png">
			</u-empty>	
		</view>

	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	import {
		followList,
		followDel
	} from '@/api/follow.js'
	import dictConstants from '@/utils/dictConstants.js'
	export default {
		name: 'followUpRecord',
		props: {
			customerId: {
				type: Number,
				default: () => 0
			}
		},
		data() {
			return {
				current: {
					poster: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/music-a.png',
					name: '致爱丽丝',
					author: '暂无',
					src: 'https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3',
				},
				audioAction: {
					method: 'pause'
				},
				followUpRecordList: [],
				deleteModalShow: true,
				pageParams: {
					pageNum: 1,
					pageSize: 5,
				},
				status: 'loadmore',
			}
		},
		
		computed: {
			...mapGetters(['userInfo'])		
		},
		async mounted() {
			await this.initData();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				if (this.status == 'loadmore') {
					this.pageParams.pageNum++
					this.getFollowList()
				}
			})
			uni.$once('followUpUpdateEvent', () => {
				this.initData();
			})
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		methods: {
			async initData(){
				this.followUpRecordList = [];
				this.pageParams.pageNum = 1;
				this.status = 'loadmore';
				this.pageParams.customerId = this.customerId || '';
				await this.getFollowList();
			},
			async getFollowList() {
				try {
					const res = await followList(this.pageParams)
					if (res.rows && res.rows.length > 0) {
						res.rows.forEach(item => {
							item.followTimeFormat = this.$u.timeFormat(new Date(item.followTime),
								'mm-dd hh:MM');
							if (item.nextFollowTime) {
								item.nextFollowTimeFormat = this.$u.timeFormat(new Date(item
									.nextFollowTime), 'mm-dd hh:MM');
							}
							item.followTypeName = this.$util.getDictLabelByValue(dictConstants
								.DICT_TYPE_FOLLOW_TYPE, item.followType)
							item.purposeTypeName = this.$util.getDictLabelByValue(dictConstants
								.DICT_TYPE_PURPOSE_TYPE, item.purposeType)
							item.dutyName = this.$util.getDictLabelByValue(dictConstants
								.DICT_TYPE_CONTACTS_DUTY, item.duty)
						});
						this.followUpRecordList.push(...res.rows);
					} 
				} catch(e) {
					console.log(e)
					this.status = 'nomore'
				}	
			},
			previewImage(i, picUrls) {
				uni.previewImage({
					current: i,
					urls: picUrls
				})
			},
			deleteConfirm(item) {
				let that = this;
				if(this.$store.state.user.userInfo.userId != item.followUserId){
					uni.showToast({
						title:'不能删除其他人的跟进记录',
						icon:'none',
					})
					return;
				}
				uni.showModal({
					title: '删除提示',
					content: '确定要删除该记录吗？',
					confirmColor: '#ff920f',
					success(res) {
						if (res.confirm) {
							followDel(item.id).then(res1 => {				
								uni.showToast({
									title: '删除成功',
									icon: 'none',
									success() {
										that.initData();
									}
								})
							});
						}
					}
				})
			},
			recordEdit(item) {
				if(this.$store.state.user.userInfo.userId != item.followUserId){
					uni.showToast({
						title:'不能编辑其他人的跟进记录',
						icon:'none',
					})
					return;
				}
				uni.navigateTo({
					url: "/pages/users/followUp/index?id=" + item.customerId + "&followUpId=" + item.id
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.follow-up-record {
		font-size: 28rpx;

		.record-item {
			padding: 26rpx 30rpx;
			background-color: #fff;
			margin-bottom: 30rpx;

			.record-item-title {
				color: #333;

				.exchange-icon {
					width: 28rpx;
					height: 28rpx;
					display: block;
					margin: 0 16rpx;
				}

				.user-roles {
					margin-right: 12rpx;
					color: #333;
				}

				.tool image {
					width: 24rpx;
					height: 24rpx;
				}
			}

			.record-item-time {
				color: #666;
				font-size: 24rpx;
			}

			.record-item-images {
				margin: 20rpx 0;
				display: flex;
				flex-wrap: wrap;

				.image-item {
					width: 100rpx;
					height: 100rpx;
					border-radius: 16rpx;
					margin: 20rpx 20rpx 0 0;

					&:last-child {
						margin-right: 0
					}
				}
			}

			.record-item-tag {
				margin-top: 20rpx;
				color: #FF920F;
				font-size: 20rpx;

				.tag-box {
					margin-right: 30rpx;
					background-color: rgba(255, 146, 15, 0.3);
					padding: 6rpx 8rpx;
				}

				.play-aduio-icon {
					width: 24rpx;
					height: 24rpx;
					display: block;
				}
			}
		}
		.no-data {
			background-color: #fff;
			padding-bottom: 30rpx;
		}
	}
</style>