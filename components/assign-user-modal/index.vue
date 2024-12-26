<template>
	<view class="assign-user-modal">
		<!-- 选择用户 -->
		<u-modal :show.sync="show" title="指派客户" showCancelButton @cancel="assignUserCancel" @confirm="assignUserConfrim">
			<view class="slot-content">
				<view class="riado-wrap">
					<u-radio-group 
						:value.sync="value"
						class="flex-row-between"
						@change="onChange"
						placement="row">
						<u-radio activeColor="#FF920F" name="0" label="移入公海"></u-radio>
						<u-radio activeColor="#FF920F" name="1" label="指定人员"></u-radio>
					</u-radio-group>
				</view>
				<view class="assign-person" v-show="value === '1'">
					指定给
					<view class="flex text-color-999 flex-align-center fjs-font-30">
						<view class="person-box" @click="selectUser('user')">
							{{usersText || '请选择指派人'}}
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
			usersText: {
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
		padding: 42rpx 14rpx 0 ;
	}
	.assign-person {
		display: flex;
		justify-content: space-between;
		margin-top: 60rpx;
		align-items: center;
	}
	.person-box {
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		border: 2rpx solid #ccc;
		width: 180rpx;
		text-align: center;
	}
</style>