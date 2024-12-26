<template>
	<view class="info">
		<view class="info-form">
			<view class="form-item">
				<view class="title">
					<!-- <text>*</text> -->
					姓名</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="user.nickName" placeholder="请输入姓名" disabled />
				</view>
			</view>
			<view class="form-item">
				<view class="title">
					<!-- <text>*</text> -->
					手机号码</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="user.phonenumber" maxlength="11" placeholder="请输入手机号码" disabled />
				</view>
			</view>
			<view class="form-item">
				<view class="title">
					<!-- <text>*</text> -->
					岗位</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="user.postGroup"  placeholder="请选择岗位" disabled />
					<!-- <u-icon name="arrow-right" size="20"></u-icon> -->
				</view>
			</view>
			<view class="form-item">
				<view class="title">
					<!-- <text>*</text> -->
					部门</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="user.dept && user.dept.deptName"  placeholder="请选择部门" disabled />
					<!-- <u-icon name="arrow-right" size="20"></u-icon> -->
				</view>
			</view>
		</view>
		<!-- <view class="submit-button">
			<button type="primary" plain>保存</button>
		</view> -->
	</view>
</template>

<script>
	import {
		getInfo
	} from "@/api/login"

	export default {
		name: 'info',
		data() {
			return {
				user: {
					nickName: '',
					phonenumber: '',
					post: "",
					department: ''
				}
			}
		},
		onLoad() {
			this.getUser()
		},
		methods: {
			async getUser() {
				const { data } = await getInfo()		
				this.user = data
			}
		}
	}
</script>

<style lang="scss">
	.info {
		padding: 24rpx 30rpx 0;

		.info-form {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 0 30rpx;

			.form-item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 36rpx 32rpx 36rpx 0;
				border-bottom: 2rpx solid #F7F7F7;

				.title {
					width: 32%;
					font-size: 30rpx;

					text {
						color: #C60203;
					}
				}

				picker {
					flex: 1;
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
				}

				&:last-child {
					border: none;
				}
			}
		}
		.submit-button {
			padding: 40rpx 30rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			box-sizing: border-box;
			background-color: #fff;
			box-shadow: 10rpx 0 15rpx #ECECEC;
			button {
				background-color: #FF920F;
				color: #fff;
				border-radius: 16rpx;
				border: none;
			}
		}
	}
</style>