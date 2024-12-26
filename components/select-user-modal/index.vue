<template>
	<u-popup 
		:show="show" 
		mode="center" 
		:customStyle="{
			borderRadius: '6px',
			overflow: 'hidden'
		}"
		zIndex="10076"
	>
		<view class="modal">
			<view class="modal-tile">
				{{title}}
			</view>
			<view class="modal-content">
				<scroll-view scroll-y @scrolltolower="lower" class="user-list flex-align-center">
					<u-checkbox-group
						v-model="checkedVal"
						placement="column"
						@change="checkboxChange"
						v-if="type === 'checkbox'"
					>
						<view 
							class="item flex flex-row-between flex-align-center" 
							v-for="item in list" 
							:key="item.userId"
						>
							<view class="user-info flex flex-align-center">
								<image class="user-head" :src="item[imageName]"></image>
								<text class="user-name fjs-m-l-20 ">
									{{item[labelName]}}
								</text>
							</view>
							<view class="check-box">
								<u-checkbox 
									:name="item[valueName]" 
									activeColor="#FF920F" 
									iconSize="18"
								>
								</u-checkbox>
							</view>
						</view>
						<u-empty
							v-if="list.length === 0"
							mode="list"
							text="暂无可选成员"
							icon="/static/images/no-shop.png"
						/>
					</u-checkbox-group>
					<u-radio-group
					    v-model="checkedVal"
					    placement="column"
					    @change="checkboxChange"
						v-if="type === 'radio'"
					  >
						<view
							class="item flex flex-row-between flex-align-center" 
							v-for="item in list" 
							:key="item[valueName]"
						>	
							<view class="user-info flex flex-align-center">
								<image class="user-head" :src="item[imageName]" :class="shape"></image>
								<text class="user-name fjs-m-l-20 ">
									{{item[labelName]}}
								</text>
							</view>
							<view class="check-box">
								<u-radio
								  :name="item[valueName]"
								  activeColor="#FF920F"
								  iconSize="18"
								>
								</u-radio>
							</view>
						</view>
					</u-radio-group>
				</scroll-view>
			</view>	
			<view class="modal-confirm flex flex-row-center" >
				<u-button type="primary" class="cancel fjs-m-r-10" shape="circle" color="#ECECEC" @click="cancel">取消</u-button>
				<u-button type="primary" class="confirm  fjs-m-l-10" shape="circle" text="确定" color="#FF920F" @click="confirm"></u-button>
			</view>
		</view>
	</u-popup>
</template>


<script>
	export default{
		name:'selectUserModal',
		props:{
			show: {
				type: Boolean,
				default: () => false
			},
			title: {
				type: String,
				default: () => '新增成员'
			},
			value: {
				type: [Array, String, Number],
				default: () => [] || ''
			},
			list: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: () => 'radio'
			},
			labelName: {
				type: String,
				default: () => 'nickName'
			},
			valueName: {
				type: String,
				default: () => 'userId'
			},
			imageName: {
				type: String,
				default: () => 'avatar'
			},
			shape: {
				type: String,
				default: () => 'square'
			}
		}, 
		data () {
			return {
				checkedVal: this.type === 'radio' ? '' : [],
				saveVal: this.type === 'radio' ? '' : []
			}
		},
		watch:{
			show(newVal) {
				if(newVal) {
					this.saveVal = this.value
					this.checkedVal = this.value
				}
			}
		},
		methods:{
			checkboxChange(value){
				this.checkedVal = value		
			},
			cancel() {
				this.$emit('cancel')
				this.$emit('update:show', false)
				this.checkedVal = this.saveVal
			},
			confirm() {
				this.$emit('update:value', this.checkedVal)
				this.$emit('update:show', false)
				this.$emit('confirm', this.checkedVal)
			},
			lower() {
				this.$emit('scrolltolower')
			}
		}
	}
</script>

<style lang="scss">
	.modal {
		width: 650rpx;
	}
	.modal-tile {
		padding: 30rpx 0;
		text-align: center;
		font-size: 36rpx;
		color: #333;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0,0,0,0.1);
		font-weight: 500;
	}
	.user-list {
		flex: 1;
		height: 600rpx;
		.item {
			border-bottom: 1rpx solid #F7F7F7;
			padding: 30rpx 64rpx;
		}
		.user-head {
			width: 60rpx;
			height: 60rpx;
			&.square {
				border-radius: 0;
			}
			&.circle{
				border-radius: 50%;
			}
		}
	}
	.modal-confirm {
		padding: 36rpx 60rpx 56rpx;
	}
</style>