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
				<view class="search-header  fjs-p-x-60 fjs-p-y-20" :class="scrollTop > 10 ? 'sticky' : ''">
					<u-search 
						placeholder="请输入商品名称、编号进行过滤"
						v-model="keyWord" 
						clearabled 
						@search="search"
						@custom="search"
						@clear="search"
					/>
				</view>
				<scroll-view ref="scrollViewRef" scroll-y @scroll="scroll" @scrolltolower="lower" class="user-list flex-align-center">
					<u-checkbox-group
						:value.sync="checkedVal"
						placement="column"
						@change="checkboxChange"
						v-if="type === 'checkbox'"
					>
						<view 
							class="item flex flex-row-between flex-align-center" 
							v-for="item in list" 
							:key="item[valueName]"
						>
							<view class="user-info flex flex-align-center">		
								<image class="user-head" :src="item[imageName]"></image>
								<view class="user-name flex fjs-m-l-20 ">
									<view class="taget-box fjs-m-r-10">{{item.storeNo || ''}}</view>
									{{item[labelName]}}
								</view>
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
								<view class="user-name flex fjs-m-l-20 ">
									<view class="taget-box fjs-m-r-10">{{item.storeNo || ''}}</view>
									{{item[labelName]}}
								</view>
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
					<u-empty
						v-if="!loadingVisible && list.length === 0"
						mode="list"
						:text="noDataText"
						icon="/static/images/no-shop.png"
					/>
					<view class="load-more fjs-p-b-10">
						<u-loadmore v-if="list.length > 0" :status="loadmoreStatus" paddingBottom="15" fontSize="14" />
					</view>
					<loading v-show="loadingVisible" />
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
	import loading from '@/components/loading/loading'
	export default{
		name:'selectUserModal',
		props:{
			show: {
				type: Boolean,
				default: () => false
			},
			title: {
				type: String,
				default: () => '新增商品'
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
				default: () => 'image'
			},
			shape: {
				type: String,
				default: () => 'square'
			},
			noDataText: {
				type: String,
				default: () => '暂无商品'
			},
			loadingVisible: {
				type: Boolean,
				default: () => false
			},
			loadmoreStatus: {
				type: String,
				default: () => 'loadmore'
			}
		}, 
		components: {
			loading
		},
		data () {
			return {
				checkedVal: this.type === "radio" ? "" : [],
				saveVal: this.type === "radio" ? "" : [],
				scrollTop: 0,
				keyWord: "",
				isLoading: false,
				selectionList: [],
				oldCheckedVal: [],
				firstList: []
			}
		},
		watch:{
			show(newVal) {
				if (newVal) {
					this.saveVal = this.value
					this.checkedVal = this.value					
						this.oldCheckedVal = []
					this.selectionList = []
					this.keyWord = ""
					this.firstList = []
				}		
			},
			list(newVal) {
				if (this.type === "checkbox") {
					this.oldCheckedVal = newVal.filter(item => this.checkedVal.some(el => item.productId === el)).map(item => item.productId)
					const rows = [...this.firstList,...this.list]
					const hashMap = {}
					rows.forEach(item => {
						hashMap[item.productId] = item
					})
					this.firstList = Object.values(hashMap)
				}			
			}
		},
		methods:{
			checkboxChange(rows,currentRow){
				if(this.type === 'radio') {
					this.checkedVal = rows
				} else if(this.type === 'checkbox') {	
					this.checkedVal = this.calcGoods([...new Set([...this.checkedVal,...rows])], this.oldCheckedVal, rows)
					this.oldCheckedVal = rows
				}
			},
			calcGoods(currentArr,oldArr,rows) {				
				const delIds = oldArr?.filter(el => !(rows.includes(el)))
				return currentArr.filter(el => !(delIds.includes(el)))
			},
			cancel() {
				this.$emit("cancel")
				this.$emit("update:show", false)
				this.checkedVal = this.saveVal
				this.firstList = null
			},
			confirm() {
				if(this.type === 'radio') {
					this.selectionList = [this.firstList.find(item => item[this.valueName] === rows)]
				} else if(this.type === 'checkbox') {
					this.selectionList = this.firstList.filter(item => this.checkedVal.includes(item.productId))
				}				
				this.$emit("update:value", this.checkedVal)
				this.$emit("update:show", false)
				this.$emit("confirm", { values:this.checkedVal,selectionList:this.selectionList})
			},
			lower() {
				this.$emit("scrolltolower")
			},
			scroll({detail}) {
				this.scrollTop = detail.scrollTop
			},
			search() {
				this.oldCheckedVal = []
				this.$emit("search", this.keyWord)
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
		//box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0,0,0,0.1);
		font-weight: 500;
		border-bottom: 1px solid #cccccc47
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
		.taget-box {
			padding: 5rpx;
			border-radius: 6rpx;
			background-color: rgba(255, 146, 15, 0.3);
			color: #FF920F;
			display: inline-block;
		}
	}
	
	.modal-confirm {
		padding: 36rpx 60rpx 56rpx;
	}
	.sticky{
		box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.1)
	}
</style>