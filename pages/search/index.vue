<template>
	<view class="search">
		<view class="search-header">
			<view class="tabs-container flex">
				<view class="tab-item flex flex-row-center" :class="current == 0 ? 'active' : ''" @click="swictTab(0)">
					<view class="riado-box fjs-m-12" :class="current == 0 ? 'active' : ''"></view>
					<text>模糊搜索</text>
				</view>
				<view class="tab-item flex flex-row-center" :class="current == 1 ? 'active' : ''" @click="swictTab(1)">
					<view class="riado-box fjs-m-12" :class="current == 1 ? 'active' : ''"></view>
					<text>精确搜索</text>
				</view>
			</view>
			<view class="fuzzy-search" v-show="current === 0">
				<view class="fuzzy-search-wrap flex">
					<u-icon class="fjs-m-r-10" name="search" size="22" color="#bbb"></u-icon>
					<input type="text" 
						v-model="searchParams.keywords" 
						placeholder="输入联系人手机尾号、店铺ID/名称" 
						confirm-type="search"
						@confirm="search"
					/>
					<u-icon class="fjs-m-r-10" 
						name="close-circle-fill" 
						size="20" color="#bbb" 
						@click="searchParams.keywords = ''"
						v-show="searchParams.keywords"
					>
					</u-icon>
					<view class="fuzzy-search-btn" @click="search">
						<text>搜索</text>
					</view>	
				</view>
			</view>
			<view class="precise-search" v-show="current === 1">
				<view class="search-form" >
					<view class="search-warp-item">
						<view class="search-item-title">所在地区</view>
						<view class="search-item-input" @click="() => cityVisible = true">
							<view class="picker-view" :class="searchParams.cityId !== '' ? '' : 'not-val'">{{`${region[0]}，${region[1]}，${region[2]}`}}</view>	
							<view @click.stop="clearParms('cityId')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.cityId" ></u-icon>
							</view>				
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
					<view class="search-warp-item"> 
						<view class="search-item-title">客户等级</view>
						<view class="search-item-input" @click="() => gradeVisible = true">
							<view class="picker-view" :class="searchParams.customerGrade !== '' ? '' : 'not-val'">{{ $util.getDictLabelByValue('customer_grade', searchParams.customerGrade) || '请选择客户等级' }}</view>
							<view @click.stop="clearParms('customerGrade')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.customerGrade" ></u-icon>
							</view>	
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
					<view class="search-warp-item" v-if="isLeader">
						<view class="search-item-title">归属BD</view>
						<view class="search-item-input" @click="() => isShowSelectUser = true">
							<view class="picker-view" :class="searchParams.salesmanUserId !== '' ? '' : 'not-val'">{{ searchUsersText || '请选择归属BD' }}</view>
							<view @click.stop="clearParms('salesmanUserId')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.salesmanUserId"></u-icon>
							</view>						
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
					<view class="search-warp-item" v-if="isLeader">
						<view class="search-item-title">跟进时间</view>
						<view class="search-item-input" @click="() => isShowDate = true">
							<view class="picker-view" :class="searchParams.followDateLimit !== '' ? '' : 'not-val'">
								{{ dateText || '请选择跟进时间'  }}
							</view>
							<view @click.stop="clearParms('followDateLimit')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.followDateLimit"></u-icon>
							</view>						
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
					<view class="search-warp-item">
						<view class="search-item-title">营业状态</view>
						<view class="search-item-input" @click="() => businessStatusVisible = true">
							<view class="picker-view" :class="searchParams.businessStatus !== '' ? '' : 'not-val'">
								{{ $util.getDictLabelByValue('business_status', searchParams.businessStatus) || '请选择营业状态'  }}
							</view>
							<view @click.stop="clearParms('businessStatus')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.businessStatus"></u-icon>
							</view>						
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
					<view class="search-warp-item">
						<view class="search-item-title">客户分层</view>
						<view class="search-item-input" @click="() => customerLevelVisible = true">
							<view class="picker-view" :class="searchParams.customerLevel !== '' ? '' : 'not-val'">
								{{ $util.getDictLabelByValue('customer_level', searchParams.customerLevel) || '请选择客户分层'  }}
							</view>
							<view @click.stop="clearParms('customerLevel')">
								<u-icon name="close-circle-fill" size="20" color="#bbb" v-show="searchParams.customerLevel"></u-icon>
							</view>						
							<u-icon class="arrow-right fjs-m-l-20" name="arrow-right" size="20" color="#333"></u-icon>
						</view>
					</view>
				</view>	
				<view class="search-btns flex" >
					<button type="primary" plain class="reset-btn" @click="reset">重置</button>
					<button type="primary" plain class="submit-btn" @click="search">搜索</button>
				</view>
			</view>
		</view>
		<view class="search-container">		
			<view class="users-list" v-if="dataList.length" >
				<view class="user-list-item" v-for="(item,index) in dataList" :key="item.id" @click="toDetails(item.id)">
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
							<view class="prototype fjs-m-r-20" >归属：{{item.salesman || '无'}}</view>
							<view class="fjs-m-r-20" v-show="item.nextFollowTime">
								<text>下次跟进：</text>{{item.nextFollowTime}}
							</view>  
							<view>营业状态：</view>{{ $util.getDictLabelByValue('business_status',item.businessStatus) || '' }}  
						</view>
					</view>
					<view class="user-item-btns flex-row-center" >
						<template v-if="isLeader">
							<view class="btn-box is-line" @click.stop="assginUser(item.id,index)">
								<image src="@/static/images/home/assign.png" />
								<text>指派客户</text>			
							</view>
							<!-- <view class="btn-box is-line" @click.stop="editUser(item.id)">
								<image src="@/static/images/home/edit.png"  />
								<text>编辑客户</text>			
							</view>			 -->		
						</template>	
						<!-- <view class="btn-box is-line" 
							@click.stop="checkUserPhone(item.id)"
						>
							<image src="@/static/images/home/phone.png"/>
							<text>联系客户</text>
						</view>
						<view class="btn-box"@click.stop="openFollowPage(item.id)" v-if="!isLeader">
							<image src="@/static/images/home/edit.png" />
							<text>写跟进</text>			
						</view>			 -->		
					</view>
				</view>
			</view>
			<view class="load-more fjs-p-b-10">
				<u-loadmore v-if="dataList.length > 0 && !loading" :status="status" paddingBottom="15" fontSize="14" />
			</view>
			<u-empty
				v-if="isLoading && dataList.length === 0"
				mode="list"
				text="暂无数据"
				icon="/static/images/no-shop.png"
			/>
			<loading v-show="loading" />
		</view>
		<!-- 所在地区uPicker -->
		<u-picker :show="cityVisible"
			ref="uPicker" 
			:columns="[multiArray[0],multiArray[1],multiArray[2]]" 
			immediateChange 
			@change="bindMultiPickerColumnChange"
			@confirm="bindRegionChange" 
			@cancel="cityVisible = false" 
			confirmColor="#FF920F">
		</u-picker>
		<!-- 所在地区uPicker -->
		<u-picker :show="gradeVisible"
			ref="dictPicker"
			:columns="[gradeTypeList]"
			keyName="label"
			immediateChange 
			@confirm="gradeChange" 
			@cancel="gradeVisible = false" 
			confirmColor="#FF920F">
		</u-picker>
		
		<!-- 指派用户 -->
		<assign-user-modal
			:show.sync="isAssignUserModal" 
			:usersText="selectUsersText" 
			:value.sync="directionVal"
			@cancel="assignUserCancel"
			@confirm="assignUserConfrim"
			@selectUser="isShowSelectUser = true"
		/>
		<!-- 指派用户 -->
		<!-- 选择用户 -->
		<select-user-modal 
			:list="memberList"
			:show.sync="isShowSelectUser"
			title="选择成员"
			@confirm="checkeMemberConfirm"
			@cancel="isShowSelectUser = false" 
			shape="circle"
		/>
		<!-- 选择用户 -->
		<!-- 联系人列表 -->
		<phone-list-popup :show.sync="isShowPhone" :list="contactList" />
		<!-- 联系人列表 -->
		<u-picker
			@confirm="businessStatusConfirm" 
			confirmColor="#FF920F" 
			:show="businessStatusVisible" 
			:columns="[businessStatusList]"
			keyName="label"
			@cancel="businessStatusVisible = false"
		>			
		</u-picker>
		<!-- 客户分层 -->
		<u-picker
			@confirm="customerLevelConfirm" 
			confirmColor="#FF920F" 
			:show="customerLevelVisible" 
			:columns="[customerLevelList]"
			keyName="label"
			@cancel="customerLevelVisible = false"
		>			
		</u-picker>
		<!-- 跟进时间 -->
		<u-picker 
			:show='isShowDate' 
			keyName="label" 
			:columns="[dateColumns]" 
			@confirm="confirmDate" 
			@cancel="isShowDate = false"
		>
		</u-picker>
	</view>
</template>

<script>
	import selectUserModal from '@/components/select-user-modal/index.vue'
	import phoneListPopup from '@/components/phone-list-popup/index.vue'
	import assignUserModal from '@/components/assign-user-modal/index.vue'
	import loading from '@/components/loading/loading.vue'
	import {
		cityListTree,
	} from '@/api/proxyRegister.js';
	import { customerSearchList,assignCustomer,customerRelease } from '@/api/index.js'
	import { teamMemberList } from '@/api/team.js'
	import { contactsList } from '@/api/contact.js'
	let curUserItem
	export default {
		name:"search",
		data() {
			return {
				searchParams: {
					cityId: "",
					customerGrade: "",
					salesmanUserId: "",
					businessStatus: "",
					customerLevel: "",
					followDateLimit: "",
					keywords: "",
				},
				cityVisible: false,
				gradeVisible:false,
				businessStatusVisible: false,
				customerLevelVisible: false,
				isShowSelectUser: false,
				isShowPhone: false,
				isAssignUserModal: false,
				loading: false,
				multiArray: [],
				valueRegion: [0,0,0],
				multiIndex: [0, 0, 0],
				region: ['省', '市', '区'],
				gradeTypeList: [],
				memberList: [],
				dataList: [],
				contactList: [],
				businessStatusList: [],
				customerLevelList: [],
				current:0,
				scrollHeight: 0,
				pageParams: {
					pageSize: 5,
					pageNum:1,
					total: 0
				},
				memberParams: {
					pageSize: 5,
					pageNum:100,
					total: 0
				},
				assignPerson:"",
				searchUsersText: '',
				selectUsersText: '请选择指派人',
				directionVal: '0',
				status: 'loadmore',
				isLeader: this.$store.state.user.userInfo?.dept?.isLeader ?? false,
				isLoading: false,
				dateColumns: [
					{label: '今日', value:'today'},
					{label: '本周', value:'week'},
					{label: '本月', value:'month'}
					],
				isShowDate: false,
				dateText: ''
			}
		},
		onLoad() {
			const { dictDataType } = this.$store.state.user 
			cityListTree().then(res => {
				this.district = res.data
				this.initialize();
			})
			this.isLeader && (this.getMemberList())
			this.businessStatusList = dictDataType['business_status'].map(item => ({label: item.dictLabel, id:item.dictValue}))
			this.gradeTypeList = dictDataType.customer_grade.map(item => ({label: item.dictLabel, id:item.dictValue}))		
			this.customerLevelList = dictDataType['customer_level'].map(item => ({label: item.dictLabel, id:item.dictValue}))
		},
		components:{
			selectUserModal,
			phoneListPopup,
			assignUserModal,
			loading
		},
		onReachBottom(){
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
			this.getMemerSearchList()
		},
		methods:{
			reset(){
				this.searchParams = {
					cityId: '',
					customerGrade: '',
					salesmanUserId: '',
					customerLevel: '',
					followDateLimit: '',
					businessStatus: '',
				}
				this.region = ['省', '市', '区']
				this.searchUsersText = ''
				this.dateText = ''
				this.search()
			},
			clearParms(keyName){
				this.searchParams[keyName] = ''
				if(keyName === 'cityId') {
					this.region = ['省', '市', '区']
				}
				if(keyName === 'salesmanUserId') {
					this.searchUsersText = ''
				}
				if(keyName === 'followDateLimit') {
					this.dateText = ''
				}
			},
			swictTab(index) {
				this.current = index
				this.searchParams = {
					cityId: '',
					customerGrade: '',
					salesmanUserId: '',
					customerLevel: '',
					followDateLimit: '',
					businessStatus: '',
				}
				this.searchUsersText =  ''
				this.dateText = ''
				this.region = ['省', '市', '区']		
			},
			search() {
				this.pageParams.pageNum = 1
				this.dataList = []
				this.isLoading = false
				this.getMemerSearchList()
			},
			async getMemerSearchList(){
				try {
					this.loading = true
					const { rows,total } = await customerSearchList({...this.searchParams,...this.pageParams})
					this.dataList = this.pageParams.pageNum === 1 ? rows : this.dataList.concat(rows)
					total < this.pageParams.pageSize &&  (this.status = 'nomore')
					this.pageParams.total = total
					this.isLoading = this.dataList.length === 0
				} finally {
					this.loading = false
				} 
			},
			gradeChange({value}){
				this.searchParams.customerGrade = value[0].id
				this.gradeVisible = false
			},
			initialize: function() {
				let that = this,province = [],city = [],area = [];
				if (that.district.length) {
					let cityChildren = that.district[0].child || [];
					let areaChildren = cityChildren.length ? (cityChildren[0].child || []) : [];
					that.district.forEach(function(item,i) {
						province.push(item.name);
						if (item.name === that.region[0]) {
							that.valueRegion[0] = i
							that.multiIndex[0] = i
						}
					});
					that.district[this.valueRegion[0]].child.forEach((item,i) => {
						city.push(item.name);
						if (that.region[1] == item.name) {
							that.valueRegion[1] = i
							that.multiIndex[1] = i
						}
					})
					that.district[this.valueRegion[0]].child[this.valueRegion[1]].child.forEach((item,i)=>{
						area.push(item.name);
						if (that.region[2] == item.name) {
							that.valueRegion[2] = i
							that.multiIndex[2] = i
						}
					})
					this.multiArray = [province, city, area]
					this.$refs.uPicker.setIndexs([this.multiIndex[0],this.multiIndex[1],this.multiIndex[2]])
				}
			},
			bindMultiPickerColumnChange: function(e) {
				let that = this,
				column = e.columnIndex,
				value = e.index,
				currentCity = this.district[value] || {
					child: []
				},
				multiArray = that.multiArray,
				multiIndex = that.multiIndex;
				multiIndex[column] = value;
				const {
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				switch (column) {
					case 0:
						let areaList = currentCity.child[0] || {
							child: []
						};
						multiArray[1] = currentCity.child.map((item) => {
							return item.name;
						});
						multiArray[2] = areaList.child.map((item) => {
							return item.name;
						});
						
						picker.setColumnValues(1, multiArray[1])
						picker.setColumnValues(2, multiArray[2])
						break;
					case 1:
						let cityList = that.district[multiIndex[0]].child[multiIndex[1]].child || [];
						multiArray[2] = cityList.map((item) => {
							return item.name;
						});
						picker.setColumnValues(2, multiArray[2])
						break;
					case 2:
			
						break;
				}
				// #ifdef MP || APP-PLUS
				this.$set(this.multiArray, 0, multiArray[0]);
				this.$set(this.multiArray, 1, multiArray[1]);
				this.$set(this.multiArray, 2, multiArray[2]);
				// #endif
				// #ifdef H5
				this.multiArray = multiArray;
				// #endif
				this.multiIndex = multiIndex
				// this.setData({ multiArray: multiArray, multiIndex: multiIndex});
			},
			bindRegionChange: function(e) {
				let multiIndex = this.multiIndex,
				province = this.district[multiIndex[0]] || {
					child: []
				},
				city = province.child[multiIndex[1]] || {
					child: []
				},
				area = city.child[multiIndex[2]] || {
					cityId: 0
				},
				multiArray = this.multiArray,
				value = e.indexs;
				this.region = [multiArray[0][value[0]], multiArray[1][value[1]], multiArray[2][value[2]]]
				this.searchParams.cityId = area.cityId;
				this.valueRegion = [0, 0, 0]
				this.cityVisible = false
				this.initialize();
			},
			checkeMemberConfirm(value) {
				const nickeName = this.memberList.find(({userId}) => userId === value).nickName			
				if (this.isAssignUserModal) {
					this.assignPerson = value
					this.selectUsersText = nickeName				
				} else {
					this.searchParams.salesmanUserId = value
					this.searchUsersText = nickeName
				}	
			},
			customerLevelConfirm({value}) {
				this.searchParams.customerLevel = value[0].id
				this.customerLevelVisible = false
			},
			confirmDate(e){
				this.dateText = e.value[0].label
				this.searchParams.followDateLimit = e.value[0].value
				this.isShowDate = false
			},
			openFollowPage(id) {
				uni.navigateTo({
					url:"/pages/users/followUp/index?id="+id
				})
			},
			async getMemberList() {
				const { rows } = await teamMemberList({page:1,pageSize:100})
				this.memberList = rows
			},
			toDetails(id) {
				uni.navigateTo({
					url: `/pages/users/userDetails/index?id=${id}`
				})
			},
			editUser(id) {
				uni.navigateTo({
					url:"/pages/users/proxyRegister/index?id="+id
				})
			},
			openFollowPage(id) {
				uni.navigateTo({
					url:"/pages/users/followUp/index?id="+id
				})
			},
			async checkUserPhone(customerId) {
				const { rows } = await contactsList({customerId})
				this.contactList = rows
				this.isShowPhone = true
			},
			async assginUser(id,index) {
				const { rows } = await teamMemberList({page:1,pageSize:100})
				this.memberList = rows
				this.isAssignUserModal = true
				curUserItem = { id, index }
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
				}
			},
			assignUserCancel() {
				this.assignPerson = []
				this.isAssignUserModal = false
				this.selectUsersText = ''
			},
			businessStatusConfirm({value}) {
				this.searchParams.businessStatus = value[0].id
				this.businessStatusVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-header {
		.tabs-container {
			border: 2rpx solid #ECECEC;
			.tab-item {
				flex:1;
				padding: 12rpx 0;
				height: 42rpx;
				align-items: center;
				font-size: 28rpx;
				&:first-child {
					border-right: 2rpx solid #ECECEC;
				}
				&.active {
					color: #FF920F;
					background-color: #fff;
				}
			}
		}
		.precise-search {
			margin: 30rpx;
			.search-form {
				background-color: #fff;	
				border-radius: 16rpx;
				.search-warp-item {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 30rpx 32rpx 30rpx;
					border-bottom: 2rpx solid #F7F7F7;
					.search-item-title {
						width: 30%;
						font-size: 28rpx;
					}
					.search-item-input {
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
					.picker-view {
						flex: 1;
						color:#333;
						padding-right: 10rpx;
						font-size: 28rpx;
						&.not-val {
							color: #ccc;	
						}
					}		
					&:last-child {
						border: none;
					}
				}
			}
		}
		
		.search-btns {
			padding:32rpx 14rpx 0;
			button {
				flex: 1;
				background-color: #ECECEC;
				color: #333;
				border-radius: 40rpx;
				margin: 0 6rpx;
				border: none;
				height: 70rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.submit-btn {
				background-color: #FF920F;
				color: #fff;
			}
		}
	}
	.fuzzy-search {
		padding: 30rpx 30rpx 24rpx;
		.fuzzy-search-wrap {
			background-color: #ECECEC;
			border-radius: 38rpx;
			padding-left: 26rpx;
			height: 76rpx;
			align-items: center;
			font-size: 24rpx;
			input {
				flex: 1;
				font-size: 24rpx;
				height: 76rpx;
			}
			.fuzzy-search-btn {
				padding: 0 38rpx 0 30rpx;
				position: relative;
				display: flex;
				align-items: center;
				::before {
					display: block;
					content: '';
					position: absolute;
					background-color: #bbb;
					left: 0;
					top: 0;
					width: 2rpx;
					height: 32rpx;
				}
			}
		}
	}
	
	.users-list {
		padding:0 30rpx;
		.user-list-item {
			background-color: #fff;
			border-radius: 12rpx;
			margin-bottom: 24rpx;
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
					display: flex;
					align-items: center;
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
	
</style>