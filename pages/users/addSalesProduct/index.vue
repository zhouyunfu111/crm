<template>
	<view class="add-sales-product">
		<view class="sales-product-from">
			<view class="item">
				<view class="title"><text>*</text>商品名称</view>
				<view class="title-info">
					<input type="text" v-model="form.productName" class="uni-input" placeholder="请输入商品名称" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>规格</view>
				<view class="title-info">
					<input type="text" v-model="form.specName" class="uni-input" placeholder="请输入商品规格" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>采购价</view>
				<view class="title-info">
					<input type="text" v-model="form.purchasePrice" class="uni-input" placeholder="请输入采购价" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>品牌</view>
				<view class="title-info">
					<input type="text" v-model="form.brandName" class="uni-input" placeholder="请输入采购价" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>采购渠道</view>
				<view class="title-info">
					<input type="text" v-model="form.purchaseChannel" class="uni-input" placeholder="请输入采购渠道" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>日销量</view>
				<view class="title-info">
					<input type="text" v-model="form.dailySales" class="uni-input" placeholder="请输入日销量" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>是否领样</view>
				<view class="title-info">
					<u-radio-group
						v-model="form.isSample"
						placement="row"
						@change="groupChange"
						iconSize="16"
						activeColor="#FF920F"
					  >
						<u-radio
							v-for="(item, index) in radiolist1"
							:key="index"
							:label="item.label"
							:name="item.name"
							:custom-style="{marginRight: '30px'}"
						>
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="item" @click="isProductType = true">
				<view class="title">类型</view>
				<view class="title-info">
					<view class="picker-view" :class="form.productType ? '' : 'not-val'">{{ getDictLabelByValue('product_type',form.productType) || '请选择商品类型'}}</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">关联我司商品</view>
				<view class="title-info" @click="isStoreProduct = true">
					<view class="picker-view" :class="form.relatedProductId ? '' : 'not-val'">{{ productTypeText || '请选择我司商品'}}</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
		</view>
		<view class="remark">
			<view class="title">备注</view>
			<view class="title-info fjs-m-t-20">
				<textarea v-model="form.remark" placeholder-style="color:#ccc" placeholder="请输入备注"/>
			</view>
		</view> 
		
		<view class="submit-button">
			<button @click="$u.debounce(onSubmit,500)" type="primary" plain>立即提交</button>
		</view>
		<!-- 类型 -->
		<u-picker 
			:show="isProductType" 
			confirmColor="#FF920F" 
			:columns="[productTypeList]"
			keyName="label"
			@confirm="productTypechange" 
			@cancel="isProductType = false" />
		<!-- 类型 -->
		<!-- 选择商品 -->
		<select-user-modal 
			:value.sayn="form.relatedProductId"
			:list="productList"
			:show.sync="isStoreProduct"
			title="选择商品"
			@confirm="checkeMemberConfirm"
			label-name="productName"
			value-name="id"
			image-name="image"
			@cancel="isStoreProduct = false" 
		/>
		<!-- 选择商品 -->
	</view>
</template>

<script>
	import { mapGetters } from 'vuex' 
	import selectUserModal from '@/components/select-user-modal/index.vue'
	import { storeProductList, addSaleProductSave,editSaleProduct,saleProductDeatils } from '@/api/userDetail.js'
	
	export default {
		data(){
			return {
				form: {
					productName: '', //姓名
					dailySales: '', //职务
					isSample: 0 ,//是否默认
					brandName: '',
					relatedProductId: '',
					purchaseChannel: '',
					purchasePrice: '',
					specName: '',
					productType: '',
					remark: ''
				},
				productTypeText: '',
				isProductType: false,
				isStoreProduct:false,
				productTypeList:[],
				productList:[],
				radiolist1: [
					{
						label: '是',
						name: 1,
						disabled: false
					},
					{
						label: '否',
						name: 0,
						disabled: false
					},
				],
				id: '',
				customerId: '',
				isSubmit: true
			}
		},
		onLoad(params){
			if(params.id) {
				this.id = params.id
				this.saleProductDeatils()
			}
			this.customerId = params.customerId
			this.productTypeList = this.dictDataType.product_type.map(item => ({label:item.dictLabel,value:item.dictValue}))
			this.getStoreProductList()
		},
		components:{
			selectUserModal
		},
		computed:{
			...mapGetters(['dictDataType'])
		},
		methods:{
			getDictLabelByValue(dictType,id){
				return this.$util.getDictLabelByValue(dictType,id)
			},
			async saleProductDeatils() {
				const { data } = await saleProductDeatils(this.id)
				this.form = data
				this.productTypeText = data.relatedProductName
			},
			productTypechange({value}){
				this.form.productType = value[0].value
				this.isProductType = false
			},
			groupChange(value){
				this.form.isSample = value
			},
			async getStoreProductList(){
				const { rows } = await storeProductList()
				this.productList = rows
			},
			checkeMemberConfirm(value){
				this.form.relatedProductId = value
				this.productTypeText = this.productList.find(item => item.id === value)?.productName  || ''
			},
			async onSubmit() {
				const { productName,brandName,specName,purchasePrice,purchaseChannel,dailySales } = this.form				
				if(productName === "") {
					return this.$u.toast("请输入商品名称"); 
				}
				if(specName === "") {
					return this.$u.toast("请输入规格名称"); 
				}
				if(purchasePrice ==="") {
					return this.$u.toast("请输入采购价"); 
				}
				if(brandName === "") {
					return this.$u.toast("请输入品牌名"); 
				}
				if(purchaseChannel === "") {
					return this.$u.toast("请输入采购渠道"); 
				}
				if(dailySales === "") {
					return this.$u.toast("请输入日销量"); 
				}				
				const params = {
					...this.form,
					customerId: this.customerId
				}
				if(!this.isSubmit) return
				this.isSubmit = false
				try {
					this.id ? editSaleProduct(params) : await addSaleProductSave(params)
					this.$modal.msgSuccess(`${this.id ? '修改' : '新增'}成功`);
					const confirm = await this.$modal.confirm('是否继续添加商品?')
					if (confirm) {
						this.form = Object.assign(this.form, {
							productName: '', //姓名
							dailySales: '', //职务
							isSample: 0 ,//是否默认
							brandName: '',
							relatedProductId: '',
							purchaseChannel: '',
							purchasePrice: '',
							specName: '',
							productType: '',
							remark: ''
						})
					} else {
						setTimeout(function(){
							uni.$emit("refresh_product")
							uni.navigateBack();
						},1000)
					}		
				} catch(e) {
					console.log(e)
				} finally {
					this.isSubmit = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-sales-product {
		padding: 30rpx;
		.sales-product-from {
			background-color: #fff;
			padding: 0 30rpx;
			border-radius: 16rpx;
			.item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 32rpx 24rpx 0;
				border-bottom: 2rpx solid #F7F7F7;
				.title {
					width: 30%;
					font-size: 28rpx;
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
		.remark {
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			.title {
				width: 30%;
				font-size: 30rpx;
				text {
					color: #C60203;
				}
			}
			.title-info {
				flex: 1;
				textarea {
					height: 140rpx;
					width: 100%;
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