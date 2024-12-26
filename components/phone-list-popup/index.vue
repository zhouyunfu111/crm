<template>
	<view class="phone-list-popup">
		<u-popup :show.sync="show" :round="10" mode="bottom">
			<view class="contact-container fjs-p-x-32 fjs-p-y-38">
				<view class="contact-title flex flex-row-between">
					<view class="font-bold fjs-font-36 color-black">联系客户</view>
					<u-icon @click="$emit('update:show',false)" name="close" color="#272636" size="23"></u-icon>
				</view>
				<view class="contatc-list">
					<view 
						class="contact-item flex flex-row-between fjs-p-y-26 flex-align-center" 
						v-for="item in list" :key="item.id"
						@click="makePhoneCall(item.mobile)"
					>
						<view class="contact-item-info color-black">
							<view class="contact-item-title fjs-font-28">
								<text class="fjs-p-r-10">{{item.realName}}</text>
								<text>{{item.mobile}}</text>
							</view>
							<view v-if="item.remark" class="contact-item-remark color-info fjs-p-t-12 fjs-font-20">{{item.remark}}</view>
						</view>
						<image class="call-icon" src="@/static/images/home/call.png"></image>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'phoneListPopup',
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			list: {
				type: Array,
				default: () => []
			}
		},
		data(){
			return {}
		},
		methods: {
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.contact-title {
		border-bottom: 2rpx solid #F7F7F7;
		padding-bottom: 40rpx;
	}
	.contact-item {
		border-bottom: 2rpx solid #F7F7F7;
		.call-icon {
			width: 40rpx;
			height: 40rpx;
			display: block;
		}
		&:last-child {
			border: none;
		}
	}
</style>