<template>
	<view class="goods">
		<view class="goods-list">
			<view class="goods-list-item" v-for="item in list">
				<view class="goods-list-prod flex">					
					<image class="prod-img" :src="item.image"></image>
					<view class="prod-content flex flex-column flex-row-between">
						<view class="prod-title flex flex-row-between fjs-font-28">
							<text class="color-black ">{{item.storeName}}</text>
							<view class="prod-num">x{{item.cartNum}}</view>
						</view>
						<view class="prod-standard color-info flex flex-row-between flex-align-end fjs-m-t-16">
							<text class="fjs-font-24">{{item.sku}}</text>
							<view class="flex prod-price flex-align-end" style="color:#ff920f"><text class="fjs-font-24">¥</text>{{item.price}}</view>
						</view>
						<view class="flex flex-row-between fjs-font-24 fjs-m-t-15 flex-align-center">
							<view class="color-info">最后购买日期：{{item.lastPayTime || '无'}}</view>
							<view class="feedback" v-if="item.isLoss === 1">
								<button class="add-feedback-button" color="#FF920F" plain @click="handleFeedback(item.attrId)">		
									<text class="fjs-m-l-10">流失反馈</text>
								</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="load-more fjs-p-b-10">
			<u-loadmore v-if="list.length > 0" :status="loadmore" paddingBottom="15" fontSize="14" />
		</view>
		<view v-if="list.length === 0" class="no-data">
			<u-empty mode="list" text="暂无记录" icon="/static/images/no-shop.png" />
		</view>
		<u-modal 
			:show="isFeedbackVisible" 
			title="流失反馈" 
			show-cancel-button 
			confirm-color="#FF920F"
			@cancel="feedbackClose"
			@confirm="feedbackSubmit"
		 >
			<view class="solt-content width-full"> 
				<u--textarea v-model="lossReason" placeholder="请输入流失反馈内容" count></u--textarea>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { orderProductList,customerLossFeed } from '@/api/index.js'
	export default {
		name: 'goods',
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
				goodsParams: {
					pageNum: 1,
					pageSize: 5,
				},
				isFeedbackVisible: false,
				lossReason: "",
				loadmore : 'loadmore',
				attrValueId: ''
			}
		},
		async mounted(){
			let that = this;
			this.list=[];
			this.goodsParams.pageNum = 1;
			this.loadmore = 'loadmore';
			await this.getGoodsList();
			//监听下拉加载更多
			uni.$on('onReachBottom', () => {
				if(that.loadmore == 'loadmore'){
					that.goodsParams.pageNum++
					that.getGoodsList()
				}
			})
		},
		beforeDestroy() {
			uni.$off('onReachBottom');
		},
		methods:{
			async getGoodsList(){
				this.goodsParams.customerId = this.customerId;
				const { rows,total } = await orderProductList(this.goodsParams);
				this.list = this.goodsParams.pageNum === 1 ? rows : this.list.concat(rows);
				if (this.goodsParams.pageSize > total) {
					this.loadmore = 'nomore';	
				}
			},
			handleFeedback(attrValueId){
				this.attrValueId = attrValueId
				this.isFeedbackVisible = true
			},
			feedbackClose() {
				this.isFeedbackVisible = false
				this.content = ""
			},
			async feedbackSubmit() {
				const params = {
					customerId: this.customerId,
					attrValueId: this.attrValueId,
					lossReason: this.lossReason
				}
				try {
					await customerLossFeed(params)
					this.$modal.msgSuccess('提交成功！')
					this.isFeedbackVisible = false
					this.lossReason = ""
					this.goodsParams.pageNum = 1
					this.getGoodsList()
				} catch(e) {
					console.log(e)
				}	
 			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-item {
		padding: 30rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		.goods-list-prod {
			margin-top: 24rpx;
			.prod-img{
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
		.add-feedback-button {
			height: 60rpx;
			font-size: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(255,146,15,0.3);
			border-radius: 12rpx;
			color: #FF920F;
			border: none;
			margin: 0;
			padding: 0 10rpx;
		}
	}
</style>