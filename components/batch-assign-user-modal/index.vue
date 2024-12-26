<template>
	<view class="assign-user-modal">
		<!-- 选择用户 -->
		<u-modal :show.sync="show" title="批量指派" showCancelButton @cancel="assignUserCancel" @confirm="assignUserConfrim">
			<view class="slot-content">
				<view class="assign-person">
					归属BD
					<view class="flex text-color-999 flex-align-center fjs-font-30">
						<view class="person-box" @click="selectUser('fromUser')">
							{{fromUsersText || '请选择归属BD'}}
						</view>
					</view>
				</view>
				<view class="assign-person">
					转移至
					<view class="flex text-color-999 flex-align-center fjs-font-30">
						<view class="person-box" @click="selectUser('toUser')">
							{{toUsersText || '请选择指派人'}}
						</view>
					</view>
				</view>
			</view>	
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: 'assignUserModal',
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			value: {
				type: String,
				default:() => '1'
			},
			fromUsersText: {
				type: String,
				default:() => ''
			},
			toUsersText: {
				type: String,
				default:() => ''
			}
		},
		data() {
			return {}
		},
		methods: {
			assignUserCancel() {
				this.$emit('update:show', false)
				this.$emit('cancel')
			},
			async assignUserConfrim() {
				this.$emit('confirm')
			},
			async selectUser(type) {
				this.$emit('selectUser')
				this.$emit('update:userType',type)
			},
			onChange(value){
				this.$emit("update:value",value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-modal__title {
		border-bottom: 1px solid rgba(214, 215, 217,0.5);
		padding-bottom: 30rpx;
		padding-top: 30rpx;
	}
	.slot-content {
		width: 100%;
		padding: 20rpx 14rpx 0 ;
	}
	.assign-person {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		align-items: center;
	}
	.person-box {
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		border: 2rpx solid #ccc;
		width: 300rpx;
		text-align: center;
	}
</style>