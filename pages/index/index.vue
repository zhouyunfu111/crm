<template>
  <view class="index">
	<view class="header">
		
		<view class="tabs fjs-p-t-20 ">
			<u-tabs 
				:list="tabList"
				lineColor="#FF920F"
				:itemStyle="{
					height:'35px',
				}"
				lineWidth="36"
				:activeStyle="{
					fontWeight: 'bold',
					color: '#333'
				}"
				@change="tabsChange"
			>
			</u-tabs>
			<view class="sort" @click="sortOpen">
				<view :style="sortOrder == 1 ? 'color: #FF920F':'#333'">▲</view>
				<view :style="sortOrder == 0 ? 'color: #FF920F':'#333'">▼</view>
			</view>
		</view>
		<view class="status-list" v-show="tabsType === 1">
			<scroll-view scroll-x scroll-with-animation class="status-classify flex">
				<view class="flex">
					<view 
						v-for="item in statusList" 
						:key="item.value"
						class="status-item" 
						:class="followTabsType === item.type ? 'active' : ''"
						@click="switchStatus(item)"
					 >
						{{item.name}}
					</view>
				</view>				
			</scroll-view>
		</view>	
	</view>
	<scroll-view scroll-y @scrolltolower="scrollToData" @scroll="scroll" :style="{ height: scrollHeight+'px'}" :scroll-top="scrollTop">
		<view class="btns-container flex">
			<button v-if="tabsType === 3" type="primary" plain="" class="batch-btn" @click.stop="batchAssginUser">批量指派</button>
		</view>
		<view class="users-list" v-if="dataList.length" >
			<!-- <swiper :current="tabsType - 1" :disable-touch="true">
				<swiper-item v-for="(tabItem,index) in tabList" :key="index"> -->
					<view class="user-list-item" v-for="(item,index) in dataList" :key="item.id" @click="toPage('/pages/users/userDetails/index',item.id)">
						<view class="user-content" >
							<view class="user-header flex">
								<view class="user-img relative">
									<image :src="item.doorPic ? item.doorPic : '/static/images/shop-img.png'"></image>
									<view 
										class="user-status" 
										:class="{0:'active', 3:'error'}[item.auditStatus] || ''"
										v-if="[0,3].indexOf(item.auditStatus) !== -1">
										{{['待审核','正常','停用','未通过'][item.auditStatus]}}
									</view>
								</view>
								<view class="user-info">									
									<view class="user-name flex flex-align-center">
										<text class="user-id fjs-m-r-10">{{item.shopId}}</text>
										<view class="u-line-1" style="flex:1;">{{item.shopName}}</view>
									</view>
									<view class="user-address u-line-1 fjs-mt-4">
										{{item.address}}
									</view>
									<view class="user-time flex">
										<view class="type">驻：</view>
										<text class="fjs-m-r-20">{{item.createTime}}</text>
										<view class="type" v-if="item.lastOrderTime">购：</view>
										<text>{{item.lastOrderTime}}</text>
									</view>
								</view>
							</view>
							<view class="user-item-tags flex flex-wrap">
								<view class="left-total flex fjs-m-r-10">
									<view class="days">30</view>
									<view class="total-item flex">
										<view class="total-title">GMV</view>
										<view class="total-num">¥{{item.orderAmount || 0}}</view>
									</view>
									<view class="total-item flex">
										<view class="total-title">客单</view>
										<view class="total-num">¥{{item.avgOrderAmount || 0}}</view>
									</view>
									<view class="total-item flex">
										<view class="total-title">订单</view>
										<view class="total-num">{{item.orderNum || 0}}</view>
									</view>
								</view>
								<view class="tags-item flex fjs-m-r-10" v-for="(tagsName,tagsIndex) in item.tags" :key="tagsIndex">
									{{tagsName}}
								</view>
							</view>
							<view class="next-contacts-time flex">
								<view class="prototype fjs-m-r-20" v-show="tabsType === 3">归属：{{item.salesman || '无'}}</view>
								<view class="fjs-m-r-20" v-show="item.nextFollowTime">
									<text>下次跟进：</text>{{item.nextFollowTime}}
								</view>  
								<view v-if="item.businessStatus">
									<text>营业状态：</text>{{ $util.getDictLabelByValue('business_status',item.businessStatus) || '' }}
								</view>
							</view>
						</view>
						<view class="user-item-btns flex-row-center" >
							<view class="btn-box is-line" v-show="[2,3].includes(tabsType) && isLeader" @click.stop="assginUser(item.id,index)">
								<image src="@/static/images/home/assign.png" />
								<text>指派客户</text>			
							</view>
							<view class="btn-box is-line" v-show="tabsType === 3" @click.stop="toPage('/pages/users/proxyRegister/index',item.id)">
								<image src="@/static/images/home/edit.png"  />
								<text>编辑客户</text>			
							</view>
							<view class="btn-box" 
								:class="tabsType === 1 ? 'is-line' : ''"
								v-show="tabsType === 1 || tabsType === 3" 
								@click.stop="checkUserPhone(item.id)"
							>
								<image src="@/static/images/home/phone.png"/>
								<text>联系客户</text>
							</view>
							<view class="btn-box" v-show="tabsType === 1" @click.stop="toPage('/pages/users/followUp/index',item.id)">
								<image src="@/static/images/home/edit.png" />
								<text>写跟进</text>			
							</view>
							<view class="btn-box" v-show="tabsType === 2" @click.stop="claimUser(item.id,index)">
								<image src="@/static/images/home/user.png" />
								<text>认领客户</text>			
							</view>			
						</view>
					</view>
		<!-- 	
				</swiper-item>		
			</swiper> -->
		</view>
		<view class="load-more fjs-p-b-10">
			<u-loadmore v-if="dataList.length > 0" :status="status" paddingBottom="15" fontSize="14" />
		</view>
		<u-empty
			v-if="dataList.length === 0"
			mode="list"
			text="暂无数据"
			icon="/static/images/no-shop.png"
		/>
	</scroll-view>

	<view class="fiexd-btns">
		<view class="fjs-m-b-24" @click="toPage('/pages/users/map/index?tabsType='+tabsType+'&followTabsType='+followTabsType)">
			<image src="@/static/images/home/navigation.png"></image>
		</view>
		<view class="proxy-register" @click="toPage('/pages/users/proxyRegister/index')">
			代
		</view>
		<view class="search">
			<view @click="toPage('/pages/search/index')">
				<image src="@/static/images/home/search-icon.png" ></image>
			</view>
		</view>
	</view>
	<!-- 选择用户 -->
	<select-user-modal 
		:list="memberList"
		:value.sync="selectUserId" 
		:show.sync="isShowSelectUser"
		title="选择成员"
		@confirm="checkeMemberConfirm"
		@cancel="isShowSelectUser = false" 
		shape="circle"
	/>
	<!-- 指派客户 -->
	<assign-user-modal 
		:show.sync="isAssignUserModal" 
		:usersText="selectUsersText" 
		:value.sync="directionVal"
		:userType.sync="selectUsersType"
		@cancel="assignUserCancel"
		@confirm="assignUserConfrim"
		@selectUser="isShowSelectUser = true"
	/>
	<!-- 批量指派 -->
	<batch-assign-user-modal 
		:show.sync="isBatchAssignUserModal" 
		:fromUsersText="selectFromUsersText" 
		:toUsersText="selectToUsersText" 
		:value.sync="directionVal"
		:userType.sync="selectUsersType"
		@cancel="batchAssignUserCancel"
		@confirm="batchAssignUserConfrim"
		@selectUser="isShowSelectUser = true"
	/>
	<!--  联系人列表 -->
	<phone-list-popup :show.sync="isShowPhone" :list="contactList" />
	<!--  排序 -->
	<u-picker :show="sortPicker" confirmColor="#FF920F" :columns="[sortColumns]" keyName="label" @confirm="sortChange" @cancel="sortPicker = false" />
  </view>
</template>

<script>
	import selectUserModal from '@/components/select-user-modal/index'
	import phoneListPopup from '@/components/phone-list-popup/index'
	import assignUserModal from '@/components/assign-user-modal/index'
	import batchAssignUserModal from '@/components/batch-assign-user-modal/index'
	
	import { customerList, customerDetail,customertabsHeaders,assignCustomer,batchAssignCustomer,customerRelease,claimCustomer,customerfollowTabs } from '@/api/index.js'
	import { contactsList } from '@/api/contact.js'
	import { teamMemberList } from '@/api/team.js'
	import { mapGetters } from "vuex";	
		
	let viewScrollHeight,stausHeight,curUserItem = null
	export default {
		data(){
			return {
				tabList: [{
					name: '我的客户',
					type:1
				}, {
					name: '客户公海',
					type:2
				}, {
					name: '所有客户',
					type:3
				}],
				statusList:[
					{
						name: '全部',
						type: 0
					},
					{
						name: '今日待跟进',
						type: 1
					},
					{
						name: '今日已跟进',
						type: 2
					},
					{
						name: '从未跟进',
						type: 3
					}
				],	
				tabsType: 1,
				status: 'loadmore',
				sortField: 0,
				sortOrder: 0,
				followTabsType: 0,
				scrollHeight: 0,
				isAssignUserModal: false,
				isShowSelectUser: false,
				isBatchAssignUserModal: false,
				isShowPhone: false,
				directionVal: '0',
				dataList: [],
				contactList: [],
				memberList: [],
				pageParams: {
					pageSize: 5,
					pageNum:1,
					total: 0
				},
				assignPerson: '',
				selectUserId: '',
				selectUsersType: 'user',
				selectUsersText: '请选择指派人',
				selectFromUsersText: '请选择归属DB',
				selectToUsersText: '请选择指派人',
				assignFromPerson: '',
				assignToPerson: '',
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				sortPicker: false,
				sortColumns: [
					{label: '默认' ,sortField: 0, sortOrder: 0},
					{label: '30天内GMV-从高到低', sortField: 1, sortOrder: 0},
					{label: '30天内GMV-从低到高', sortField: 1, sortOrder: 1},
					{label: '30天内客单价-从高到低', sortField: 2, sortOrder: 0},
					{label: '30天内客单价-从低到高', sortField: 2, sortOrder: 1},
					{label: '30天内订单数-从高到低', sortField: 3, sortOrder: 0},
					{label: '30天内订单数-从低到高', sortField: 3, sortOrder: 1},
				],
			}	
		},
		components:{
			selectUserModal,
			phoneListPopup,
			assignUserModal,
			batchAssignUserModal
		},
		computed:{
			...mapGetters(['userInfo']),
			isLeader() {
				return this.userInfo?.dept?.isLeader
			}
		},
		onLoad(){
			this.getData()
			this.getHeaderTabs()
			this.getCustomerFollowTabs()
			this.$store.dispatch('GetDictData')
			uni.$off("followUpUpdateEvent")
			uni.$on('followUpUpdateEvent',() => {
				this.getData()
				this.getCustomerFollowTabs()
			}) 
		},
		mounted(){
			const query = uni.createSelectorQuery().in(this);
			query.select('.header').boundingClientRect(res => {
				viewScrollHeight = uni.getSystemInfoSync().windowHeight - res.height
				this.scrollHeight = viewScrollHeight		
				this.$u.getRect('.tabs').then(res => {
					stausHeight = res.height
				})	
			}).exec();		
		},
		onUnload() {
			viewScrollHeight = null
			stausHeight = null
			curUserItem = null
		},
		methods:{
			async getData(){
				this.status = 'loadmore';
				const { tabsType, followTabsType,sortField,sortOrder,pageParams } = this
				const { rows = [],total } = await customerList({tabsType,followTabsType,sortField,sortOrder,...pageParams})
				this.dataList = pageParams.pageNum === 1 ? rows : this.dataList.concat(rows)	
				total < pageParams.pageSize &&  (this.status = 'nomore')
				this.pageParams.total = total
			},
			async getHeaderTabs(){
				const { data } = await customertabsHeaders()
				const allUserIndex = data.findIndex(item => item.type === 3)
				this.tabList = data.map(({name,count,type}) => ({name: `${name}${count ? `(${count})` : ''}`,type}))
			},
			async getCustomerFollowTabs(){
				const { data } = await customerfollowTabs()
				this.statusList = data.map(({name,count,type}) => ({name: `${name}(${count})`,type}))
			},
			scrollToData() {
				const { pageSize,total } = this.pageParams
				if (pageSize > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
					this.status = 'nomore';		
					return 
				}
				this.pageParams.pageNum++
				this.getData()
			},
			scroll(e){
				this.old.scrollTop = e.detail.scrollTop
			},
			async tabsChange({type}){
				this.pageParams.pageNum = 1
				this.status = 'loadmore'
				this.tabsType = type
				if (type === 1) {
					this.getCustomerFollowTabs()	
				}
				this.scrollHeight = type === 1 ? viewScrollHeight : viewScrollHeight + stausHeight
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				this.getData()	
			},
			switchStatus({type}) {
				this.pageParams.pageNum = 1
				this.status = 'loadmore'
				this.followTabsType = type
				this.getData()
			},
			async assginUser(id,index) {
				const { rows } = await teamMemberList({page:1,pageSize:100})
				this.memberList = rows
				this.isAssignUserModal = true
				curUserItem = { id, index }
			},
			async batchAssginUser() {
				const { rows } = await teamMemberList({page:1,pageSize:100})
				this.memberList = rows
				this.isBatchAssignUserModal = true
			},
			async checkUserPhone(customerId) {
				const { rows } = await contactsList({customerId})
				this.contactList = rows
				this.isShowPhone = true
			},
			checkeMemberConfirm() {
				console.log('this.selectUsersType',this.selectUsersType)
				switch(this.selectUsersType){
					case 'user':
						this.assignPerson = this.selectUserId
						this.selectUsersText = this.memberList.find(({userId}) => userId === this.selectUserId).nickName
						break;
					case 'fromUser':
						this.assignFromPerson = this.selectUserId
						this.selectFromUsersText = this.memberList.find(({userId}) => userId === this.selectUserId).nickName
						break;
					case 'toUser':
						this.assignToPerson = this.selectUserId
						this.selectToUsersText = this.memberList.find(({userId}) => userId === this.selectUserId).nickName
						break;
					
				}
				
			},
			async assignUserConfrim() {
				try {
					uni.showLoading({
						title: '后台处理中...'
					})
					this.directionVal === '1' ? await assignCustomer(curUserItem.id,{ userId: this.assignPerson}) : await customerRelease(curUserItem.id)
					uni.showToast({
						title: this.directionVal === '1' ? '指派成功' : '操作成功',
						icon: 'success'
					})
					this.dataList.splice(curUserItem.index,1)
				} finally {
					uni.hideLoading()
					this.isAssignUserModal = false	
					this.getHeaderTabs()
					this.assignUserCancel()
				}
			},
			assignUserCancel() {
				this.assignPerson = []
				this.isAssignUserModal = false
				this.selectUserId = ''
				this.selectUsersText = ''
			},
			async batchAssignUserConfrim() {
				try {
					uni.showLoading({
						title: '后台处理中...'
					})
					await batchAssignCustomer({ fromUserId: this.assignFromPerson, toUserId: this.assignToPerson})
					uni.showToast({
						title: '指派成功' ,
						icon: 'success'
					})
					this.dataList.splice(curUserItem.index,1)
				} finally {
					uni.hideLoading()
					this.isBatchAssignUserModal = false	
					this.getHeaderTabs()
					this.batchAssignUserCancel()
				}
			},
			batchAssignUserCancel() {
				this.assignFromPerson = []
				this.assignToPerson = []
				this.isBatchAssignUserModal = false
				this.selectUserId = ''
				this.selectFromUsersText = ''
				this.selectToUsersText = ''
			},
			claimUser(id,spliceIndex) {
				uni.showModal({
					title: '认领客户',
					content: '确定要认领该客户吗？',
					confirmColor:"#FF920F",
					success: async(res) => {				
						if (res.confirm) {
							uni.showLoading({
								title: '后台处理中...'
							})
							await claimCustomer(id)
							uni.showToast({
								title: '操作成功',
								icon: 'success'
							})
							this.dataList.splice(spliceIndex,1)
							this.getHeaderTabs()
							uni.hideLoading()
						}			
					}
				})
			},
			sortOpen() {
				this.sortPicker = true
			},
			sortChange(e) {
				this.sortPicker = false
				this.sortField = e.value[0].sortField
				this.sortOrder = e.value[0].sortOrder
				this.pageParams.pageNum = 1
				this.getData()
			},
			toPage(url,id) {
				if(id) {
					url+=`?id=${id}`		
				}
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		background-color: #fff;
	}
	.prototype {
		color: #666;
	}
	.tabs {
		width: 100%;
		position: relative;
		.sort {
			position: absolute;
			right: 0;
			padding: 0 20rpx 0 8rpx;
			top: 20rpx;
			font-size: 24rpx; 
			z-index: 9999; 
			display: flex; flex-direction: column; 
			justify-content: center; 
			align-items: center;
			// border:1rpx solid red;
		}
	}
	/deep/ .u-tabs__wrapper__nav__item {
		flex: 1 
	}
	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 32rpx;
	}
	.status-list {
		padding: 40rpx 30rpx 12rpx;
		position: relative;
		text-align: center;
		&::before,&::after {
			content: '';
			display: block;
			width: 30rpx;
			height: 64rpx;
			bottom: 0;
			position: absolute;
			background-color: #fff;	
		}
		&::before {
			left: 0;
			box-shadow: 2rpx 0rpx 6rpx -2rpx rgba(0,0,0,0.19);
		}
		&::after {
			right: 0;
			box-shadow: -2rpx 0rpx 6rpx -2rpx rgba(0,0,0,0.19);
		}
	}
	.status-classify {
		line-height: 40rpx;
		font-size: 28rpx;
		color: #666;
		white-space: nowrap;
		.status-item {
			padding-right: 40rpx;
			flex: 1 0 auto;
		}
		.active {
			color: #FF920F;
			font-weight: 600;
		}
	}
	.users-list {
		padding:0 30rpx;
		.user-list-item {
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 24rpx;
			.user-content {
				padding: 30rpx 30rpx 20rpx;
			}
			.user-img {
				.user-status {
					width: 100%;
					position: absolute;
					bottom: 8rpx;
					height: 30rpx;
					z-index: 99;
					font-size: 24rpx;
					text-align: center;
					color: #fff;
					padding: 3rpx 0;
					border-radius: 0rpx 0rpx 12rpx 12rpx
				}
				.active {
					background-color: #FF920F;
				}
				.error {
					background-color: #C60203;
				}
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 12rpx;
				}
			}
			.user-info {
				padding-left: 30rpx;
				flex: 1;
				color: #333;
				.user-name {
					font-size: 28rpx;
					line-height: 40rpx;
					font-weight: 500;
					margin-bottom: 10rpx;
				}
				.user-id {
					color: #333;
					font-size: 24rpx;
					border: 2rpx solid #333;
					font-weight: 400;
					padding: 0rpx 14rpx;
					border-radius: 8rpx;
				}
				.user-time {
					margin-top: 12rpx;
					color: #666;
					font-size: 20rpx;
				}
			}
			.user-item-tags {
				margin: 20rpx -20rpx 0 0;	
				.left-total {
					font-size: 20rpx;	
					height: 38rpx;
					line-height: 38rpx;
					margin-bottom: 20rpx;
					.total-title {
						color: #333;
						background-color: rgba(155, 155, 155, 0.4);
						padding: 4rpx 10rpx;
					}
					.total-num {
						color: #333;
						background-color: rgba(155, 155, 155, 0.2);
						padding: 4rpx 10rpx;
					}
					.total-item:last-child > .total-num {
						border-radius: 0 4rpx 4rpx 0;
					}
				}
				.tags-item {
					color: #fff;
					background-color: #333;
					border-radius: 4rpx;
					padding: 0rpx 12rpx;
					min-height: 32rpx;
					line-height: 32rpx;
					font-size: 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
				}
				.days {
					color: #fff;
					background-color: #333;
					padding: 4rpx 10rpx;
					border-radius: 4rpx 0 0 4rpx;
				}
			}	
			.next-contacts-time {
				color: #666;
				font-size: 20rpx;
			}
			.user-address {
				color: #999;
				font-size: 24rpx;
			}
			.user-item-btns {
				border-top: 2rpx solid #F7F7F7;
				display: flex;
				position: relative;
				.btn-box {
					width: 50%;
					height: 80rpx;
					color: #333;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 0 0 16rpx 16rpx;
					flex:1;
					image {
						width: 24rpx;
						height: 24rpx;
						margin-right: 10rpx;
					}
				}
				.is-line {
					position: relative;
					&::before {
						content: '';
						width: 2rpx;
						height: 46rpx;
						background-color: #ECECEC;
						display: block;
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
	}
	.fiexd-btns {
		position: fixed;
		right: 30rpx;
		bottom: 300rpx;
		& > .proxy-register {
			width: 60rpx;
			height: 60rpx;
			background-color: #FF920F;
			color: #fff;
			display: flex;
			font-size: 28rpx;
			border-radius: 50%;
			justify-content: center;
			align-items: center;
			margin-bottom: 24rpx;
			box-shadow: 3rpx 3rpx 12rpx rgba(51,51,51,0.5);
		}
		// .search {	
		// 	box-shadow: 3rpx 3rpx 12rpx rgba(51,51,51,0.5) inset;
		// }
		image {
			width: 60rpx;
			height: 60rpx;
			display: block;
		}
	}
	.btns-container {
		button {
			margin: 24rpx 0 0 32rpx;
			width: 200rpx;
			height: 52rpx;
			font-size: 32rpx;
			border-radius: 12rpx;
			border: none;
			letter-spacing: 2rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	
		.batch-btn {
			background-color: rgba(255, 146, 15, 1);
			color: #fff;
		}
	}
</style>
