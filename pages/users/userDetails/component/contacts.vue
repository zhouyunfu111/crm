<template>
	<view class="contacts">
		<view class="header flex" v-if="isOwner">
		<!-- 	<view class="add-contacts-button"  color="#FF920F">添加联系人</view> -->
			<button class="add-contacts-button" color="#FF920F" plain @click="toAdd">
				<u-icon name="plus" color="#FF920F" size="12"></u-icon>			
				<text class="fjs-m-l-10">添加联系人</text>
			</button>
		</view>
		<view class="contacts-list">
			<view class="contacts-list-item" v-for="item in list" :key="item.id">
				<view class="contacts-list-title flex flex-row-between">
					<view class="name flex">
						<text>{{item.realName}}（{{item.dutyText}}）</text>
						<view v-if="item.isDefault==1" class="tag">默认</view>
					</view>
					<view class="tool flex flex-align-center" v-if="isOwner">
						<image @click="remove(item.id)" class="fjs-m-r-40" src="@/static/images/userDetails/delete-icon.png"></image>
						<image @click="toEdit(item.id)" src="@/static/images/userDetails/edit-icon.png"></image>
					</view>
				</view>
				<view class="contacts-list-phone color-info">
					{{item.mobile}}
				</view>
				<view class="contacts-list-remark color-info" v-if="item.remark && item.remark.length>0">
					备注：{{item.remark}}
				</view>
				<view class="contacts-list-tag flex fjs-p-b-30">
					<view class="tag-box">{{item.sexText}}</view>
					<view class="tag-box">{{item.age}}岁</view>
				</view>
				<view class="contacts-list-button flex" v-if="isOwner">
					<view class="setting-default flex flex-align-center fjs-flex-1 flex-row-center" v-if="item.isDefault==0" @click="setDefault(item)">
						<image class="icon" src="@/static/images/userDetails/setting-icon.png"></image>
						设为默认 
					</view>
					<view class="call-phone flex flex-align-center fjs-flex-1 flex-row-center" @click="makePhoneCall(item.mobile)">
						<image class="icon" src="@/static/images/userDetails/phone-icon.png"></image>
						联系他
					</view>
				</view>
			</view>
			<u-empty 
				v-if="list.length === 0"
				mode="list"
				text="暂无数据"
				icon="/static/images/no-shop.png">
			</u-empty>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { contactsList,updateDefault,delContacts} from '@/api/contact.js'
	export default {
		name: 'contacts',
		props:{
			nodeClass: {
				type: Object,
				default: () => ({})
			},
			customerId: {
				type: Number,
				default: 0
			},
			isOwner: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				list:[],
				sexColumns:[],
				dutyColumns:[],
			}
		},
		computed:mapGetters(['dictDataType']),
		methods:{
			// 计算年龄
			calculateAge(birthDateString) {
			    const birthDate = new Date(birthDateString);
			    const ageDifference = Date.now() - birthDate.getTime();
			    const age = new Date(ageDifference).getUTCFullYear() - 1970;
			    return age;
			},
			// 联系人列表
			getContactsList(){
				let that = this;
				contactsList({customerId : that.customerId }).then(res => {
					res.rows.forEach(item=>{
						item.dutyText = that.dutyColumns.find(e=> e.value == item.duty).label;
						item.sexText = that.sexColumns.find(e=> e.value == item.sex).label;
						item.age = that.calculateAge(item.birthday)
					});
					that.list = res.rows
				})
			},
			// 删除联系人
			remove(id){
				uni.showModal({
					title: '删除联系人',
					content: '确定删除该联系人吗？',
					confirmColor:"#FF920F",
					success: async(res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '后台处理中...'
							})
							await delContacts({id:id})
							uni.showToast({
								title: '操作成功',
								icon: 'success'
							})
							this.getContactsList();
						}
					}
				})
			},
			// 设置默认
			setDefault(item){
				let that = this;
				updateDefault({id:item.id}).then(res => {
					that.$modal.msgSuccess("操作成功");
					that.getContactsList();
				});
			},
			// 拨打电话
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 去新增页面
			toAdd() {
				uni.navigateTo({
					url: `/pages/users/addContacts/index?customerId=${this.customerId}`
				})
			},
			// 去修改页面
			toEdit(id) {
				uni.navigateTo({
					url: `/pages/users/addContacts/index?customerId=${this.customerId}&id=${id}`
				})
			},
		},
		mounted(){
			let that = this;
			this.sexColumns = this.dictDataType['sys_user_sex'].map(item => ({label:item.dictLabel,value:item.dictValue}))
			this.dutyColumns = this.dictDataType['contacts_duty'].map(item => ({label:item.dictLabel,value:item.dictValue}))
			this.getContactsList()
			uni.$on('refresh_contacts', function(){
				that.getContactsList();
			})
		}
	}
</script>

<style lang="scss" scoped>
	.contacts {
		.header {
			background-color: #fff;
			padding: 20rpx 30rpx;
			font-size: 22rpx;
			justify-content: flex-start;
			.add-contacts-button {
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
				padding: 0 20rpx;
			}
		}
		.contacts-list-item {
			background-color: #fff;
			padding: 30rpx;
			margin-bottom: 30rpx;
			.contacts-list-title {
				font-size: 28rpx;
				.tag {
					padding: 2rpx 8rpx;
					font-size: 20rpx;
					background: rgba(0, 199, 106, 0.3);
					color: #00C76A;
					display: flex;
					align-items: center;
				}
				.tool  image{
					width: 24rpx;
					height: 24rpx;				
				}
			}
			.contacts-list-phone {
				padding: 10rpx 0  18rpx;
				font-size: 28rpx;
			}
			.contacts-list-remark {
				padding: 0rpx 0  18rpx;
				font-size: 24rpx;
			}
			.contacts-list-tag {
				font-size: 24rpx;
				.tag-box {
					background-color: rgba(255, 146, 15, 0.3);
					color: #FF920F;
					margin-right: 10rpx;
					padding: 4rpx 10rpx;
				}
			}
			.contacts-list-button {
				border-top: 2rpx solid #F7F7F7;
				padding-top: 32rpx;
				font-size: 28rpx;
				color: #333;
				.icon {
					width: 24rpx;
					height: 24rpx;
					margin-right: 10rpx;
					display: block;
				}
				.setting-default {
					border-right: 2rpx solid #ECECEC;
				}
			}
		}
	}
</style>