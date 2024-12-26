<template>
	<view class="contacts">
		<view class="content-from">
			<view class="item">
				<view class="title"><text>*</text>姓名</view>
				<view class="title-info">
					<input type="text" v-model="form.realName"  placeholder="请输入联系人姓名" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>联系电话</view>
				<view class="title-info">
					<input @blur="checkPhone" type="number" maxlength="11" v-model="form.mobile" placeholder="请输入联系电话" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>职务</view>
				<view class="title-info" @click="dutyPicker = true">
					<view class="picker-view" :class="form.duty !== '' ? '' : 'not-val'">
						{{ form.dutyText || '请选择职务' }}
					</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">生日</view>
				<view class="title-info" @click="birthdayPicker = true">
					<view class="picker-view" :class="form.birthday !== '' ? '' : 'not-val'">{{ form.birthday || '请选择生日' }}</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>	
				</view>
			</view>
			<view class="item">
				<view class="title">性别</view>
				<view class="title-info" @click="sexPicker = true">
					<view class="picker-view" :class="form.sex !== '' ? '' : 'not-val'">{{ form.sexText || '请选择性别' }}</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
		</view>
		<view class="remark">
			<view class="title">备注</view>
			<view class="title-info">
				<input type="text"  v-model="form.remark" placeholder="请输入备注" />
			</view>
		</view> 
		<view class="setting-default flex flex-row-between" @click.capture="changRadioVal">
			<view class="title">设为默认</view>
			<view class="title-info fjs-flex-0">
				<view class="riado-box" :class="form.isDefault === 0 ? '' :'active'"></view>
			</view>
		</view> 
		<view class="submit-button">
			<button :disabled="!isSubmit" @click="$u.debounce(onSubmit,500)" type="primary" plain>立即提交</button>
		</view>
		<!--  生日选择器 -->
		<u-datetime-picker :show="birthdayPicker" mode="date" :minDate="-28800000" @confirm="birthdayChange" @cancel="birthdayPicker = false" />
		<!--  性别 -->
		<u-picker :show="sexPicker" confirmColor="#FF920F"  :columns="[sexColumns]" keyName="label" @confirm="sexChange" @cancel="sexPicker = false" />
		<!--  职务 -->
		<u-picker :show="dutyPicker" confirmColor="#FF920F" :columns="[dutyColumns]" keyName="label" @confirm="dutyChange" @cancel="dutyPicker = false" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { addContacts,editContacts,contactsDetail} from '@/api/contact.js'
	export default {
		data() {
			return {
				form: {
					realName: '', //姓名
					mobile: '', //电话
					duty: '', //职务
					dutyText:  '', //性别文本
					birthday: '', //生日
					sex: '', //性别
					sexText:  '', //性别文本
					remark: '', //备注
					isDefault: 0 ,//是否默认
					customerId: null
				},
				id: null,
				sexColumns: [],
				dutyColumns: [],
				birthdayPicker: false,
				sexPicker: false,
				dutyPicker: false,
				isSubmit: true
			}
		},
		computed:mapGetters(['dictDataType']),
		onLoad(options){
			this.sexColumns = this.dictDataType['sys_user_sex'].map(item => ({label:item.dictLabel,value:item.dictValue}))
			this.dutyColumns = this.dictDataType['contacts_duty'].map(item => ({label:item.dictLabel,value:item.dictValue}))
			if(options.customerId){
				this.form.customerId = options.customerId;
			}else{
				this.$modal.msgError("客户id不能为空")
			}
			if(options.id){
				this.id = options.id;
				this.getDetail(this.id);
				uni.setNavigationBarTitle({title: '修改联系人'})
			}
		},
		methods:{
			async onSubmit() {
				if(!this.isSubmit) return
				this.isSubmit = false
				try {
					this.id ? await editContacts({...this.form,id:this.id}) : await addContacts(this.form)
					this.$modal.msgSuccess(`${this.id ? '修改' : '新增'}成功`);
					setTimeout(function(){
						uni.$emit("refresh_contacts")
						uni.navigateBack();
					},1000)
				} catch(e) {	
					console.log(e)
				} finally {
					this.isSubmit = true
				}	
			},
			getDetail(id){
				contactsDetail(id).then(res => {
				  this.form = res.data
				  this.form.dutyText = this.dutyColumns.find(e=> e.value == this.form.duty).label;
				  this.form.sexText = this.sexColumns.find(e=> e.value == this.form.sex).label;
				})
			},
			changRadioVal() {		
				this.form.isDefault = this.form.isDefault === 1 ? 0 : 1	
			},
			birthdayChange(e) {
				this.birthdayPicker = false
				this.form.birthday = this.$u.timeFormat(e.value, 'yyyy-mm-dd')				
			},
			sexChange(e) {
				this.sexPicker = false
				this.form.sex = e.value[0].value
				this.form.sexText = e.value[0].label
			},
			dutyChange(e) {
				this.dutyPicker = false
				this.form.duty = e.value[0].value
				this.form.dutyText = e.value[0].label
			},
			checkPhone(event) {
				let p = /^1[3456789]\d{9}$/
				if (!p.test(event.target.value)) {
					this.$modal.msgError("请输入正确的手机号")
				}
			},
		}
	}
</script>

<style lang="scss">
	.contacts {
		padding: 30rpx;
		.content-from {
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
		
		.remark, .setting-default {
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title {
				width: 30%;
				font-size: 28rpx;
				text {
					color: #C60203;
				}
			}
			.title-info {
				flex: 1;
				input {
					font-size: 28rpx;
				}
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
				border: none;
			}
		}
	}
</style>