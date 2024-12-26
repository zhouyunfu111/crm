<template>
	<view class="team">
		<view class="header-section ">
			<view class="team-title flex flex-row-between flex-align-center font-bold">
				<view class="team-name fjs-font-32">{{name}}的团队</view>
			</view>
			<view class="team-member">
				<view class="member-item" v-for="item in bdmMemberList" :key="item.id">
					<view class="member-info flex flex-align-center color-black flex-row-between">
						<view class="flex flex-align-center">
							<image class="member-head" :src="item.avatar"></image>
							<view class="member-name fjs-m-l-18">{{item.nickName}}</view>
							<view class="member-section fjs-m-l-28">{{deptName}}</view>	
						</view>							
						<view class="tag-warp">负责人</view>
					</view>
				</view>
			</view>
		</view>
		<view class="member-list">
			<view class="member-list-title flex flex-row-between">
				<text class="font-bold color-black fjs-font-28">成员</text>
				<view class="tool flex flex-align-center color-primary">
					<image class="plus-icon fjs-m-r-12" src="@/static/images/mine/plus-icon.png"></image>
					<text class="fjs-font-24" @click="addTeamMember">新增成员</text>
				</view>
			</view>
			<view class="member-item flex flex-row-between" v-for="item in teamList"  :key="item.userId">
				<view class="member-info flex flex-align-center color-black">
					<image class="member-head" :src="item.avatar"></image>
					<view class="member-name fjs-m-l-18">{{item.nickName}}</view>
					<!-- <view class="member-section fjs-m-l-28">{{item.nickName}}</view> -->
				</view>
				<view class="member-tool flex color-info flex-align-center">
					<image class="delete-icon" src="@/static/images/userDetails/delete-icon.png"></image>
					<text class="fjs-m-l-10 fjs-font-24" @click="deleteTeamMember(item.userId)">删除</text>
				</view>
			</view>
		</view>
		<!-- 选择用户 -->
		<select-user-modal 
			:list="memberList"
			:show.sync="isShowSelectUser"
			title="选择成员"
			type="checkbox"
			@confirm="checkeMemberConfirm"
			@scrolltolower="scrollTo"
			@cancel="isShowSelectUser = false" 
			shape="circle"
		/>
		<!-- 选择用户 -->
	</view>
</template>

<script>
	import { teamMemberList,teamNoMemberList,deleteTeamMember, addTeamMember,teamMemberListBdm } from '@/api/team.js'
	import selectUserModal from '@/components/select-user-modal/index.vue'
	import {mapGetters} from "vuex";
	export default {
		name: 'team',
		data() {
			return {
				name: this.$store.state.user.name,
				deptName:this.$store?.state?.user?.userInfo?.dept?.deptName || '',
				teamList: [],
				memberList: [],
				bdmMemberList:[],
				isShowSelectUser: false,
				pageParams: {
					pageSize: 100,
					pageNum:1,
					total: 0
				}
			}
		},
		components:{
			selectUserModal
		},
		onLoad(){
			console.log('onLoad',getCurrentPages())
			this.getTeamMemberList()
			this.getTeamMemberListBdm()
		},
		methods: {
			async getTeamMemberList() {
				const { rows } = await teamMemberList(this.pageParams)
				this.teamList = rows
			},
			addTeamMember() {
				this.getTeamNoMemberList()
				this.isShowSelectUser = true
			},
			async getTeamMemberListBdm(){
				const { data } = await teamMemberListBdm();
				this.bdmMemberList = data
			},
			async getTeamNoMemberList() {
				const { pageNum,pageSize } = this.pageParams
				const { rows = [], total } = await teamNoMemberList(this.pageParams)
				this.memberList = pageNum === 1 ? rows : this.memberList.concat(rows)
				this.pageParams.total = total
			},
			async checkeMemberConfirm(userId) {
				try {
					if (userId?.length === 0) return
					uni.showLoading({
						title: '后台处理中...'
					})
					await addTeamMember({userId})
					uni.showToast({
						title: '操作成功',
						icon: 'success'
					})
					this.getTeamMemberList()
					uni.hideLoading()
				} catch(e) {
					console.log(e)
				}
			},
			deleteTeamMember(userId) {
				uni.showModal({
					title: '提示',
					content:'确定要删除该成员吗?',
					confirmColor:'#FF920F',
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '后台处理中...'
								})
								await deleteTeamMember({userId})
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								})
								this.getTeamMemberList()
								uni.hideLoading()
							} catch(e) {
								console.log(e)
							}			
						}					
					}
				})
			},
			scrollTo() {
				const { pageSize,total } = this.pageParams
				if (pageSize > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});		
					return 
				}
				this.pageParams.pageNum++
				this.getTeamNoMemberList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.team {
		padding: 22rpx 30rpx;
		.header-section {
			background-color: #fff;
			border-radius: 16rpx;
			.team-title {
				padding: 30rpx;
				background: linear-gradient( 180deg, rgba(255,211,90,0.18) 30%, #FFFFFF 70%);
			}
		}
		.member-item{
			padding: 30rpx;
			border-top: 2rpx solid #F7F7F7;
			.member-info {
				font-size: 28rpx;
			}
			.member-head {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.delete-icon {
				width: 26rpx;
				height: 28rpx;
				display: block;
			}
			.tag-warp {
				border: 2rpx solid rgb(97, 175, 254);
				border-radius: 8rpx;
				padding: 4rpx 12rpx;
				font-size: 22rpx;
				color: rgb(97, 175, 254);
			}
		}
	
		.member-list {
			background-color: #fff;
			margin-top: 30rpx;
			border-radius: 16rpx;
			.member-list-title {
				padding: 30rpx;
				.plus-icon {
					width: 20rpx;
					height: 20rpx;
					display: block;
				}
			}
		}
	}
</style>