<template>
	<view class="mine-container">
		<view class="header-section">
			<image class="header-bg" src="@/static/images/mine/hader-bg.png"></image>
			<view class="user-head">
				<image :src="userInfo.avatar ? userInfo.avatar : '../../static/images/profile.jpg'"></image>
			</view>
			<view class="user-info fjs-m-t-46">
				<view class="user-name color-black fjs-m-b-10">{{userInfo.nickName}}</view>
				<text class="color-info ">{{userInfo.dept && userInfo.dept.deptName || ''}}</text>
			</view>
		</view>
		<view class="content-section">
			<view class="mine-actions">
				<view class="action-item flex flex-row-between" @click="toPage('/pages/mine/info/index')">
					<text>基础资料</text>
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
				<view class="action-item flex flex-row-between" @click="toPage('/pages/mine/team/index')" v-if="isLeader">
					<text>团队管理</text>
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
				<view class="action-item flex flex-row-between" 
					@click="toPage('/pages/mine/negotiatePrice/index')" 
					v-if="$auth.hasPermiOr(['customer:price:audti','customer:price:approval'])"
				>
					<text>议价审核</text>
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</view>
			<u-button class="login-out" @click="handleLogout">退出登录</u-button>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import storage from '@/utils/storage'

	export default {
		name: 'mine',
		data() {
			return {
				name: this.$store.state.user.name,
				version: getApp().globalData.config.appInfo.version,
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			isLeader() {
				return this.userInfo?.dept?.isLeader
			}
		},
		methods: {
			toPage(page){
				uni.navigateTo({
					url: page
				})
			},
			async handleLogout() {
				const comfirm = await this.$modal.confirm('确定注销并退出系统吗？')
				if(comfirm){
					this.$store.dispatch('LogOut').then(() => {
						this.$tab.reLaunch('/pages/index')
					})
				}		
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f7;
	}

	.mine-container {
		width: 100%;
		overflow-y: scroll;
		padding-bottom: var(--window-bottom);

		.header-section {
			position: relative;

			.header-bg {
				position: absolute;
				width: 100%;
				height: 624rpx;
			}

			.user-head {
				padding-top: 104rpx;

				&>image {
					width: 240rpx;
					height: 240rpx;
					border-radius: 16rpx;
					display: block;
					margin: 0 auto;
				}
			}

			.user-info {
				text-align: center;
			}

		}

		.content-section {
			position: relative;
			margin-top: 66rpx;
			padding: 0 30rpx 30rpx;

			.mine-actions {
				padding: 0 20rpx;
				border-radius: 16rpx;
				background-color: white;

				.action-item {
					padding: 32rpx 0 32rpx;
					border-bottom: 2rpx solid #F7F7F7;

					.text {
						display: block;
						font-size: 13px;
						margin: 8px 0px;
					}

					&:last-child {
						border: none;
					}
				}
			}

			.login-out {
				border-radius: 16rpx;
				height: 82rpx;
				font-size: 32rpx;
				color: #fff;
				margin-top: 220rpx;
				background-color: #dadada;
			}
		}
	}
</style>