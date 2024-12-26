<template>
	<view class="proxy-register">
		<view class="form-title flex flex-row-between">
			<view class="title-icon flex flex-align-center">
				基础信息
			</view>
			<view class="is-edit flex flex-align-center" v-if="form.id !== ''" @click="enableBase = !enableBase">
				<view class="riado-box" :class="enableBase ? 'active' :''"></view>
				<text class="fjs-m-l-20 fjs-font-28" :class="enableBase ? 'color-primary' :''">开启编辑</text>
			</view>
		</view>
		<view class="content-form">
			<view class="item">
				<view class="title"><text>*</text>企业名称</view>
				<view class="title-info">
					<input type="text" :disabled="!enableBase" v-model="form.enterpriseName" class="uni-input"
						placeholder="请输入营业执照上的名称" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>门头名称</view>
				<view class="title-info">
					<input type="text" :disabled="!enableBase" v-model="form.shopName" class="uni-input"
						placeholder="请输入门头名称" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>所在地区</view>
				<view class="title-info" @click="enableBase && (cityVisible = true)">
					<view class="picker-view">{{`${region[0]}，${region[1]}，${region[2]}`}}</view>
					<u-icon v-if="enableBase" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>详细地址</view>
				<view class="title-info">
					<input type="text" :disabled="!enableBase" class="uni-input" name='detail' v-model="form.address"
						maxlength="100" placeholder="请输入详细地址，包含楼号/门牌号等" />
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>门店位置</view>
				<view class="title-info" @click="openMap">
					<view class="picker-view" :class="(form.latitude && form.longitude) ? '' : 'not-val'">
						{{((form.latitude?form.latitude+",":'')+(form.longitude?form.longitude:'')) || '请选择门店位置' }}</view>
					<u-icon v-if="enableBase" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title"><text>*</text>门店类型</view>
				<view class="title-info" @click="enableBase && (bindSelectData('customer_type','customerType','form'))">
					<view class="picker-view" :class="form.customerType !== null ? '' : 'not-val'">
						{{ getDictLabelByValue('customer_type', form.customerType) || '请选择门店类型' }}
					</view>
					<u-icon v-if="enableBase" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="shop-photo">
				<view class="title">
					<view><text class="required-stars">*</text>门头照片</view>
				</view>
				<view class="upload-btn">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="9" v-if="enableBase">
					</u-upload>
					<view class="shop-image-wrap" v-else>
						<view class="wrap-preview" v-for="(imgItem,index) in fileList1" :key="imgItem.id"
							@click="$util.previewImage(index,[imgItem.url])">
							<image :src="imgItem.url" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="shop-photo">
				<view class="title">
					<view><text class="required-stars">*</text>店内照片</view>
				</view>
				<view class="upload-btn">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" multiple
						:maxCount="9" v-if="enableBase"></u-upload>
					<view class="shop-image-wrap" v-else>
						<view class="wrap-preview" v-for="(imgItem,index) in fileList2" :key="imgItem.id"
							@click="$util.previewImage(index,[imgItem.url])">
							<image :src="imgItem.url" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="extend-info fjs-m-t-30">
			<view class="form-title flex flex-row-between">
				<view class="title-icon flex flex-align-center">
					扩展信息
				</view>
				<view class="is-edit flex flex-align-center" v-if="form.id !== ''"
					@click="enableExtend = !enableExtend">
					<view class="riado-box" :class="enableExtend ? 'active' :''"></view>
					<text class="fjs-m-l-20 fjs-font-28" :class="enableExtend ? 'color-primary' :''">开启编辑</text>
				</view>
			</view>
			<view class="extend-info-content">
				<view class="item">
					<view class="title">经营品类</view>
					<view class="title-info" @click="enableExtend && bindSelectData('category','category','form')">
						<view class="picker-view" :class="form.category !== '' ? '' : 'not-val'">
							{{ getDictLabelByValue('category', form.category) || '请选择经营品类' }}
						</view>
						<u-icon v-if="enableExtend" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">客户分层</view>
					<view class="title-info"
						@click="enableExtend && bindSelectData('customer_level','customerLevel','form')">
						<view class="picker-view" :class="form.customerLevel !== null ? '' : 'not-val'">
							{{ getDictLabelByValue('customer_level', form.customerLevel) || '请选择客户分层' }}
						</view>
						<u-icon v-if="enableExtend" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">客户等级</view>
					<view class="title-info"
						@click="enableExtend && bindSelectData('customer_grade','customerGrade','form')">
						<view class="picker-view" :class="form.customerGrade !== null ? '' : 'not-val'">
							{{ getDictLabelByValue('customer_grade', form.customerGrade) || '请选择客户等级' }}
						</view>
						<u-icon v-if="enableExtend" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">客户阶段</view>
					<view class="title-info"
						@click="enableExtend && bindSelectData('customer_stage','customerStage','form')">
						<view class="picker-view" :class="form.customerStage !== null ? '' : 'not-val'">
							{{ getDictLabelByValue('customer_stage', form.customerStage) || '请选择客户阶段' }}
						</view>
						<u-icon v-if="enableExtend" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">营业状态</view>
					<view class="title-info"
						@click="enableExtend && bindSelectData('business_status','businessStatus','form')">
						<view class="picker-view" :class="form.businessStatus !== null ? '' : 'not-val'">
							{{ getDictLabelByValue('business_status', form.businessStatus) || '请选择营业状态' }}
						</view>
						<u-icon v-if="enableExtend" class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">客户来源</view>
					<view class="title-info">
						<view class="picker-view" :class="form.customerSource !== '' ? '' : 'not-val'">
							{{form.id ? getDictLabelByValue('customer_source', form.customerSource) : 'BD新建'}}
						</view>
						<!-- <u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon> -->
					</view>
				</view>
			</view>
		</view>

		<view class="remark fjs-m-t-30">
			<view class="item">
				<view class="title">备注</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="form.remark" placeholder="请输入备注" />
				</view>
			</view>
		</view>

		<view class="contacts" v-if="form.id === ''">
			<view class="form-title fjs-m-t-30">
				<view class="title-icon flex flex-align-center">
					联系人
				</view>
			</view>
			<view class="contacts-tips fjs-m-t-20 fjs-m-b-30">该手机号码会自动在饭军师批发商城注册账号</view>
			<view class="contacts-content">
				<view class="item">
					<view class="title"><text>*</text>姓名</view>
					<view class="title-info">
						<input type="text" v-model="contacts.realName" class="uni-input" placeholder="请输入联系人姓名" />
					</view>
				</view>
				<view class="item">
					<view class="title"><text>*</text>手机号码</view>
					<view class="title-info">
						<input type="number" name="phone" maxlength="11" @blur="getPhone" :value="contacts.mobile"
							placeholder="请输入联系电话"></input>
					</view>
				</view>
				<view class="item">
					<view class="title"><text>*</text>验证码</view>
					<view class="title-info">
						<input type="number" class="uni-input" v-model="contacts.captcha" placeholder="请输入验证码" />
						<button class="getCode" @click="getCode">{{text}}</button>
					</view>
				</view>
				<view class="item">
					<view class="title"><text>*</text>身份</view>
					<view class="title-info" @click="bindSelectData('contacts_duty','duty','contacts')">
						<view class="picker-view" :class="contacts.duty !== '' ? '' : 'not-val'">
							{{ getDictLabelByValue('contacts_duty', contacts.duty) || '请选择客户身份' }}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">生日</view>
					<view class="title-info" @click="isShowBirthday = true">
						<input type="text" class="uni-input" v-model="contacts.birthday" placeholder="请选择生日" />
						<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
				<view class="item">
					<view class="title">性别</view>
					<view class="title-info" @click="bindSelectData('sys_user_sex','sex','contacts')">
						<view class="picker-view" :class="contacts.sex !== '' ? '' : 'not-val'">
							{{ getDictLabelByValue('sys_user_sex', contacts.sex) || '请选择客户性别' }}
						</view>
						<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
					</view>
				</view>
			</view>
			<view class="remark fjs-m-t-30">
				<view class="item">
					<view class="title">备注</view>
					<view class="title-info">
						<input type="text" class="uni-input" v-model="contacts.remark" placeholder="请输入备注" />
					</view>
				</view>
			</view>
		</view>
		<view class="submit-button">
			<button :disabled="!isSubmit" @click="onSubmit">立即提交</button>
		</view>
		<!-- 所在地区uPicker -->
		<u-picker :show="cityVisible" ref="uPicker" :columns="[multiArray[0],multiArray[1],multiArray[2]]"
			immediateChange @change="bindMultiPickerColumnChange" @confirm="bindRegionChange"
			@cancel="cityVisible = false" confirmColor="#FF920F">
		</u-picker>
		<!-- 所在地区uPicker -->
		<!-- 商家信息和联系人选择uPicker -->
		<u-picker :show="pickerVisible" ref="dictPicker" :columns="[dictTypeList]" keyName="label" immediateChange
			@confirm="bindValuehange" @cancel="pickerVisible = false" confirmColor="#FF920F">
		</u-picker>
		<!-- 商家信息和联系人选择uPicker -->
		<!-- 生日 -->
		<u-datetime-picker :show="isShowBirthday" :minDate="-28800000" mode="date" confirmColor="#FF920F"
			@confirm="birthdayconfirm" @cancel="isShowBirthday = false" immediateChange></u-datetime-picker>
		<!-- 生日 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		cityListTree,
		customerRegister,
		getCustomerDetail,
		updateCustomer,
		registerShop
	} from '@/api/proxyRegister.js';
	import {
		sendCode,
	} from '@/api/login.js';
	import {
		mapGetters
	} from 'vuex'
	import sendVerifyCode from '@/mixins/SendVerifyCode.js'
	export default {
		data() {
			return {
				form: {
					shopName: '', //店铺名称
					address: '', //详细地址
					category: '', //经营品类,多个用逗号隔开
					contacts: '', //联系人
					latitude: '', //经度
					longitude: '', //纬度
					city: '', //市
					cityId: '', //城市id
					customerGrade: null, //客户等级
					customerLevel: null, //客户分层
					customerSource: '', //客户来源
					customerStage: null, //客户阶段
					customerType: null, //客户类型
					businessStatus: null,//营业状态
					district: '', //区县
					doorPic: [], //门头照片
					indoorPic: [], //室内照片
					enterpriseName: '', //企业名称
					id: '', //id，修改时必传
					province: '', //省
					remark: '', //备注
					location: ''
				},
				contacts: {
					birthday: '', //生日
					captcha: '', //验证码
					duty: '', //职务：1.老板 2.员工
					mobile: '', //	电话
					realName: '', //姓名
					remark: '', //备注
					sex: '' //性别 0=男,1=女,2=未知
				},
				district: [],
				EvUrl: '',
				multiArray: [],
				valueRegion: [0, 0, 0],
				multiIndex: [0, 0, 0],
				region: ['省', '市', '区'],
				fileList1: [], // 门头照片
				fileList2: [], //室内照片
				cityVisible: false,
				pickerVisible: false,
				isShowBirthday: false,
				curFormName: '',
				curFormText: '',
				dataNma: '',
				dictTypeList: [],
				enableBase: true, //是否开启编辑基础信息
				enableExtend: true, //是否开启编辑扩展信息
				mapData: {},
				isSubmit: true
			}
		},
		mixins: [sendVerifyCode],
		computed: mapGetters(['token', 'isLogin', 'dictDataType']),
		async onLoad(params) {
			let that = this;
			if (params.id) {
				uni.setNavigationBarTitle({
					title: '修改客户详情'
				})
				const {
					data,
					data: {
						province,
						city,
						district,
						doorPic,
						indoorPic
					}
				} = await getCustomerDetail(params.id)
				this.form = {
					...data,
					id: params.id
				}

				this.region = [province, city, district]
				this.fileList1 = doorPic.map((url, id) => ({
					url,
					message: '',
					status: 'success',
					id
				}))
				this.fileList2 = indoorPic.map((url, id) => ({
					url,
					message: '',
					status: 'success',
					id
				}))
				this.enableBase = false
				this.enableExtend = false
			}
			this.EvUrl = this.$config.baseUrl + '/crm/upload/image?model=shop&pid=0'
			cityListTree().then(res => {
				this.district = res.data
				this.initialize();
			})
			uni.$on("selectLocationEvent", function(e) {
				that.setLocationValue(e)
			})
		},
		methods: {
			openMap(e) {
				if(this.enableBase){
					uni.navigateTo({
						url: '/pages/users/map/tencentMap'
					})
				}
			},
			setLocationValue(e) {
				console.log("e:", e)
				let that = this;
				that.form.location = e.poiaddress;
				console.log("this.form.location:", that.form.location)
				that.form.latitude = e.latlng.lat;
				that.form.longitude = e.latlng.lng;
			},
			getDictLabelByValue(dictType, id) {
				return this.$util.getDictLabelByValue(dictType, id)
			},
			bindValuehange({
				value
			}, name, showName, text) {
				this[this.dataNma][this.curFormName] = value[0].id
				this.pickerVisible = false
			},
			bindSelectData(dictName, formName, dataName) {
				this.dictTypeList = this.dictDataType[dictName].map(item => ({
					label: item.dictLabel,
					id: item.dictValue
				}))
				this.curFormName = formName
				this.dataNma = dataName
				this.pickerVisible = true
				this.$refs.dictPicker.setIndexs([0])
			},
			async getCode() {
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.contacts.mobile)) {
					return uni.showToast({
						title: '请填写完整的手机号码',
						icon: 'none'
					})
				}
				if (this.disabled) return
				try {
					const {
						msg
					} = await sendCode({
						phone: this.contacts.mobile
					})
					this.$util.Tips({
						title: msg
					});
					this.sendCode();
				} catch (err) {
					console.log(err, this.$util)
					this.$util.Tips({
						title: err
					})
				}
			},
			birthdayconfirm({
				value
			}) {
				this.contacts.birthday = this.$u.timeFormat(value, 'yyyy-mm-dd')
				this.isShowBirthday = false
			},
			async onSubmit() {
				let that = this;
				if(!that.enableBase && !that.enableExtend){
					uni.showToast({
						title:'请先开启编辑，再修改数据后提交',
						icon:"none",
						duration:3000
					})
					return	
				}
				const {
					form: {
						enterpriseName,
						shopName,
						cityId,
						address,
						customerType,
						category,
						id,
						latitude,
						longitude,
						location
					},
					contacts: {
						realName,
						mobile,
						captcha,
						duty
					},
					region,
					fileList1,
					fileList2,
					enableBase,
					enableExtend,
				} = this
				if (enableBase && !enterpriseName) {
					return this.$u.toast('请输入企业名称');
				}
				if (enableBase && !shopName) {
					return this.$u.toast('请输入店铺名(门头名称)');
				}
				if (enableBase && !customerType) {
					return this.$u.toast('请选择门店类型');
				}
				if (enableBase && !address) {
					return this.$u.toast('请填写门店的详细地址');
				}
				if (enableBase && !latitude || !longitude) {
					return this.$u.toast('请选择门店位置');
				}
				if (enableBase && !cityId) {
					return this.$u.toast('请选择省市区');
				}
				if (enableBase && fileList1.length === 0) {
					return this.$u.toast('请上传门头图片');
				}
				if (enableBase && fileList2.length === 0) {
					return this.$u.toast('请上传店内图片');
				}
				if (id === "" && !realName) {
					return this.$u.toast('请输入姓名');
				}
				if (id === "" && !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.contacts.mobile)) {
					return this.$u.toast('请输入正确的手机号码!');
				}
				if (id === "" && !captcha) {
					return this.$u.toast('请输入验证码');
				}
				if (id === "" && !duty) {
					return this.$u.toast('请选择客户身份');
				}

				const params = {
					...this.form,
					contacts: {
						...this.contacts
					},
					doorPic: fileList1.map(item => item.url),
					indoorPic: fileList2.map(item => item.url),
					province: region[0],
					city: region[1],
					district: region[2],
					enableBase, //是否开启编辑基础信息
					enableExtend, //是否开启编辑基础信息
					latitude,
					longitude,
				}
				if(!this.isSubmit) return
				this.isSubmit = false
				const modifyAddressTips = () => {
					return new Promise((resolve, reject) => {
						uni.showModal({
							title: '提示',
							content: '地址需要详细到号、室，否则可能无法为您配送到位',
							confirmText: '修改一下',
							cancelText: '继续保存',
							confirmColor: '#FF920F',
							success: (res) => {
								if (res.confirm) {
									uni.hideLoading()
									this.isSubmit = true
								} else if (res.cancel) {
									resolve()
								}
							}
						});
					})
				}
				if (enableBase && !address.includes('号') && !address.includes('室')) await modifyAddressTips.bind(this)()
				try {
					uni.showLoading({
						title: '后台处理中...'
					})
					const result = id ? await updateCustomer(params) : await customerRegister(params)
					uni.hideLoading()
					if(id === "" && !result.data) {	
						return 	uni.showModal.call(this, {
									title:"提示",
									content: result.msg,
									confirmColor: '#FF920F',
									success:(e) => {
										if(e.confirm){
											this.registerShop(params);
										}
									}
								})
					}
					this.showToast({
						message: `${id ? '修改': '新增'}成功`,
						type: 'success',
						duration: 1500
					})						
				} catch(e) {	
					console.log(e)
				} finally {
					this.isSubmit = true
				}
			},
			registerShop(params){		
				registerShop(params).then((res) => {
					this.isSubmit = true
					this.showToast({
						title: '操作成功！',
						type: 'success',
						duration: 1500
					})
				})
			},
			getPhone(e) {
				this.contacts.mobile = e.detail.value
			},
			changeMap() {
				const Tips = this.$util.Tips
				this.$util.$L.getLocation(Tips).then(res => {
					uni.chooseLocation({
						latitude: uni.getStorageSync('user_latitude'),
						longitude: uni.getStorageSync('user_longitude'),
						success: ({
							address,
							name,
							latitude,
							longitude
						}) => {
							this.form.latitude = latitude
							this.form.longitude = longitude
							this.userAddress.location = latitude + ',' + longitude;
						}
					})
				})
			},
			initialize: function() {
				let that = this,
					province = [],
					city = [],
					area = [];
				if (that.district.length) {
					let cityChildren = that.district[0].child || [];
					let areaChildren = cityChildren.length ? (cityChildren[0].child || []) : [];
					that.district.forEach(function(item, i) {
						province.push(item.name);
						if (item.name === that.region[0]) {
							that.valueRegion[0] = i
							that.multiIndex[0] = i
						}
					});
					that.district[this.valueRegion[0]].child.forEach((item, i) => {
						city.push(item.name);
						if (that.region[1] == item.name) {
							that.valueRegion[1] = i
							that.multiIndex[1] = i
						}
					})
					that.district[this.valueRegion[0]].child[this.valueRegion[1]].child.forEach((item, i) => {
						area.push(item.name);
						if (that.region[2] == item.name) {
							that.valueRegion[2] = i
							that.multiIndex[2] = i
						}
					})
					this.multiArray = [province, city, area]
					this.$refs.uPicker.setIndexs([this.multiIndex[0], this.multiIndex[1], this.multiIndex[2]])
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
				this.form.cityId = area.cityId;
				this.valueRegion = [0, 0, 0]
				this.cityVisible = false
				this.initialize();
			},
			//显示提示，并可配置提示成功跳转到指定的页面
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						uni.navigateBack()
					}
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			async afterRead(event) {
				console.log(event)
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					let item = this[`fileList${event.name}`][fileListLen]
					try {
						const result = await this.uploadFilePromise(lists[i].url)
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url
						}))
						fileListLen++
					} catch (data) {
						this[`fileList${event.name}`].splice(fileListLen, 1)
						//TODO handle the exception
					}
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.EvUrl,
						filePath: url,
						name: 'multipart',
						header: {
							// #ifdef MP
							"Content-Type": "multipart/form-data",
							// #endif
							['AuthoriZation']: this.token
						},
						success: (res) => {
							const data = res.data ? JSON.parse(res.data) : {};
							if (data.code === 200) {
								resolve(data.data);
							} else if ([410000, 410001, 410002, 401].indexOf(data.code) !== -1) {
								// toLogin();
								reject(data);
							} else {
								this.$u.toast(data.message)
								reject(data)
							}
						},
						fail: (res) => {
							uni.showToast({
								title: "上传失败",
								icon: 'error'
							})
							reject(res)
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss">
	.proxy-register {
		padding: 30rpx 30rpx 180rpx;

		.form-title {
			display: flex;
			font-size: 32rpx;
			font-weight: bold;
			align-items: center;
			margin-bottom: 22rpx;
			letter-spacing: 2rpx;
			color: #333;

			.title-icon::before {
				display: block;
				content: '';
				width: 12rpx;
				height: 32rpx;
				background-color: #FF920F;
				border-radius: 6rpx;
				margin-right: 18rpx;
			}
		}

		.content-form,
		.contacts-content,
		.register,
		.remark,
		.extend-info-content {
			background-color: #fff;
			padding: 0 30rpx;
			border-radius: 16rpx;

			.item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 32rpx 30rpx 0;
				border-bottom: 2rpx solid #F7F7F7;

				.title {
					width: 30%;
					font-size: 28rpx;

					text {
						color: #C60203;
					}
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
					color: #333;
					padding-right: 10rpx;
					font-size: 28rpx;
					max-width: 420rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;

					&.not-val {
						color: #ccc;
					}
				}

				&:last-child {
					border: none;
				}
			}

			.shop-photo {
				display: flex;
				padding: 30rpx 32rpx 22rpx 0;
				flex-direction: column;
				border-bottom: 2rpx solid #F7F7F7;
				font-size: 28rpx;

				.info-error {
					color: #C60203;
					font-size: 24rpx;
					margin-top: 6rpx;
				}

				.upload-btn {
					margin-top: 30rpx;
				}

				&:last-child {
					margin-top: 30rpx;
					padding-top: 0 !important;
				}
			}

			.getCode {
				background-color: rgba(255, 146, 15, 0.1);
				border-color: #FF920F;
				height: 54rpx;
				color: #FF920F;
				font-size: 28rpx;
				line-height: 54rpx;
			}

			.required-stars {
				color: #C60203;
			}
		}

		.shop-image-wrap {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			flex: 1;

			.wrap-preview {
				border-radius: 2px;
				margin: 0 8px 8px 0;
				position: relative;
				overflow: hidden;
				display: flex;
				flex-direction: row;

				image {
					width: 80px;
					height: 80px;
				}
			}
		}

		.contacts-tips {
			color: #FF920F;
			font-size: 24rpx;
			// padding-left: 30rpx;
		}

		.submit-button {
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 40rpx 30rpx;
			background-color: #fff;
			width: 100%;
			box-sizing: border-box;
			z-index: 5;

			button {
				background-color: #FF920F;
				color: #fff;
				border-radius: 16rpx;
				height: 82rpx;
				font-size: 32rpx;
			}
		}

		.color-333 {
			color: #333;
		}
	}
</style>