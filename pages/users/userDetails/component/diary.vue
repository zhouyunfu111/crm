<template>
	<view class="diary">
		<view class="diary-list">
			<view class="diary-list-item" v-for="item in list">
				<view class="diary-list-title flex color-black">					
					<view class="title-name">
						{{item.nickName}}
					</view>
					<view>{{item.bizModule}}</view>
				</view>
				<view class="diary-desc color-info fjs-m-t-30">
					{{item.createTime}}
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
	import { operaLogList} from '@/api/index.js'
	export default {
		name: 'diary',
		props:{
			nodeClass: {
				type: Object,
				default: () => {
					return { componentName:'' }
				}
			},
			customerId: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				list:[],
				logParams: {
					pageNum: 1,
					pageSize: 5,
				},
				loadmore : 'loadmore',
			}
		},
		mounted(){
			let that = this;
			this.list=[];
			this.logParams.pageNum = 1;
			this.loadmore = 'loadmore';
			this.getOperaLogList();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				if(that.loadmore == 'loadmore'){
					that.logParams.pageNum++
					that.getOperaLogList()
				}
			})
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		methods:{
			async getOperaLogList(){
				this.logParams.customerId = this.customerId;
				const { rows,total } = await operaLogList(this.logParams);
				this.list = this.list.concat(rows);
				if (this.logParams.pageSize > total) {
					this.loadmore = 'nomore';	
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.diary-list-item {
		padding: 30rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		.diary-list-title{
			font-size: 28rpx;
		}
		.diary-desc{
			font-size: 28rpx;
		}
	}
</style>