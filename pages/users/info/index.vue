<template>
	<view class="info">
		<view class="content-form">
			<view class="item">
				<view class="title"><text>*</text>商家名称</view>
				<view class="title-info">
					<input type="text" v-model="form.enterpriseName" class="uni-input"  placeholder="请输入营业执照上的名称" />
				</view>
			</view>
			<view class="item">
				<view class="title">所在地区</view>
				<view class="title-info">
					<picker mode="multiSelector" @change="bindRegionChange"
						@columnchange="bindMultiPickerColumnChange" :value="valueRegion" :range="multiArray" >
						<view class='u-flex'>
							<view class="picker line1">{{region[0]}}，{{region[1]}}，{{region[2]}}</view>
							<view class='iconfont icon-xiangyou abs_right'></view>
						</view>
					</picker>
				</view>
			</view>
			<view class="item">
				<view class="title">详细地址</view>
				<view class="title-info">
					<input type="text" class="uni-input" name='detail' v-model="form.userAddress.detail"  maxlength="100" placeholder="请输入详细地址，包含楼号/门牌号等" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>地理位置</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>客户类型</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>经营品类</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">客户分层</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">客户等级</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">客户阶段</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddress.location" disabled placeholder="初步接洽" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">客户来源</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="form.userAddresstion" disabled placeholder="商城注册" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="shop fjs-m-t-30">
			<view class="shop-photo">
				<view class="title">
					<view>门头照片</view>
				</view>
				<view class="upload-btn" >
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						multiple
						:maxCount="9"
					>	
					</u-upload>
				</view>
			</view>
			<view class="shop-photo">
				<view class="title">
					<view>店内照片</view>
				</view>
				<view class="upload-btn">
					<u-upload
						:fileList="fileList2"
						@afterRead="afterRead"
						@delete="deletePic"
						name="2"
						multiple
						:maxCount="9"
					></u-upload>
				</view>
			</view>
		</view>
		<view class="remark">
			<view class="title">备注</view>
			<view class="title-info" @click="changeMap">
				<input type="text" class="uni-input" v-model="form.userAddresstion" disabled placeholder="请输入备注" />
			</view>
		</view>
		<view class="submit-button">
			<button @click="onSubmit">立即提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					shopName: '', //店铺名称
					enterpriseName: '', //企业名称
					mobile: '', //手机号码
					contacts: '', //联系人
					inviteCode: '', //邀请码
					latitude: '', //经度
					longitude: '' ,//纬度
					userAddress:{detail:''}
				},
				valueRegion: [],
				district: [],
				multiArray: [],
				region: ['省', '市', '区'],
				fileList1: [],
				fileList2: [],
			}
		},
		methods:{
			onSubmit() {
				
			}
		}
	}
</script>

<style lang="scss">
	.info {
		padding: 30rpx 30rpx 180rpx;
		.content-form,.shop {
			background-color: #fff;
			padding: 0 30rpx;
			border-radius: 16rpx;
			.item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 36rpx 32rpx 36rpx 0;
				border-bottom: 2rpx solid #F7F7F7;
				.title {
					width: 30%;
					font-size: 30rpx;
					text {
						color: #C60203;
					}
				}
				picker {
					flex:1;
					height: 40rpx;
				}
				.iconfont {
					font-size: 37rpx;
				}
				.title-info {
					display: flex;
					flex: 1;
					align-items: center;
					input {
						font-size: 28rpx;
						color: #333;
						flex: 1;
						padding-right: 10rpx;
					}
					/deep/ .u-icon {
						width: 32rpx;
						height: 32rpx;
					}
				}
				&:last-child {
					border: none;
				}
			}
			.shop-photo {
				display: flex;
				padding: 30rpx 32rpx 22rpx 0;
				flex-direction: column;
				border-bottom: 2rpx solid #F7F7F7;
				.info-error {	
					color: #C60203;
					font-size: 24rpx;
					margin-top: 6rpx;
				}
				.upload-btn {
					margin-top: 30rpx;
				}
				&:last-child {
					margin-top: 30rpx;
					padding-top: 0 !important;
				}
			}
		}
		
		.remark {
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title {
				width: 30%;
				font-size: 30rpx;
				text {
					color: #C60203;
				}
			}
			.title-info {
				flex: 1;
			}
		}
		
		.submit-button {
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 40rpx 30rpx;
			background-color: #fff;		
			width: 100%;
			box-sizing: border-box;
			button {
				background-color: #FF920F;
				color: #fff;
				border-radius: 16rpx;
				height: 82rpx;
				font-size: 32rpx;
			}
		}
	}	
</style>