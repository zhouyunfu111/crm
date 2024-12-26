<template>
	<view>
		<view class="page-body">
			<view id="container" class="page-section page-section-gap" style="width: 100%;height:100vh;">	
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config'
	import setQqMapLocationNetwork from '@/api/utils'
	import request from '@/utils/request'
	import { customerMap } from '@/api/index.js'
	let geometries = [],map = null,infoWindow = null 
	export default {
		data() {
			return {
				param: {
					tabsType: null,
					followTabsType: null
				}
			}
		},
		async onLoad(options){
			if(options.tabsType){
				this.param.tabsType = options.tabsType
			}
			if(options.followTabsType){
				this.param.followTabsType = options.followTabsType
			}
			const { latitude, longitude } = await this.$util.$L.getLocation()
			
			const center = new TMap.LatLng(latitude, longitude)
			//定义map变量，调用 TMap.Map() 构造函数创建地图		
			this.$nextTick(() => {
				map = new TMap.Map(document.getElementById('container'), {
					center,//设置地图中心点坐标
					zoom: 14.9,   //设置地图缩放级别
					pitch: 43.5,  //设置俯仰角
					rotation: 45,    //设置地图旋转角度
					viewMode: '2D'
				});
				this.getData()
				this.createInfoWindows(latitude, longitude)
			})	
		},
		methods: {
			async getData() {
				try {
					const {rows:geometriesList} = await customerMap(this.param)
					geometries = geometriesList.map(({id,position:{ latitude, longitude },properties}) => {
						return {
							title: 'marker'+ id,
							styleId: "marker",
							position: new TMap.LatLng(latitude,longitude),
							properties
						}
					})
					this.createMarkerLayer()
				} catch(e) {
					console.log(e)
				}			
			},
			createMarkerLayer() {
				const marker = new TMap.MultiMarker({
					id: 'marker-layer',
					map,
					styles: {
						marker: new TMap.MarkerStyle({
							width: 48,
							height: 48,
							anchor: { x: 27, y: 45 },
							src: '/static/images/shop-icon.png'
						})
					},
					geometries
				})
				marker.on("click", this.checkMarkerInfo) //添加事件
			},
			createInfoWindows(latitude, longitude) {
				infoWindow = new TMap.InfoWindow({
				    map,
				    position: new TMap.LatLng(latitude, longitude),
					enableCustom: true,
				    offset: { x: 0, y: -48 } //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
				})
				infoWindow.close()				
			},
			checkMarkerInfo(evt) {
				console.log(evt.geometry.properties)
				const { id,shopName,address,lastFollowUserName,lastFollowTime } = evt.geometry.properties
				const content = `
					<div class="info-window" >
					 ${lastFollowUserName && lastFollowTime ?
						`<div class="info-window-head flex flex-align-center">
							<div class="to-page fjs-m-r-10">访</div>
							<span class="fjs-m-r-12">${lastFollowUserName}</span>
							<span>${lastFollowTime}</span>
						</div>
						` : ``}
						<div class="info-window-title">${shopName}</div>
						<p class="color-info">${address}</p>
					</div>
				`
				infoWindow.open(); //打开信息窗
				infoWindow.setPosition(evt.geometry.position);//设置信息窗位置
				infoWindow.setContent(content);//设置信息窗内容
				const infoWindowDom = document.querySelector(".info-window")
				infoWindowDom.addEventListener("click",() => {
					this.toDetailPage(id)
				},{capture:true})
			},
			toDetailPage(id) {
				uni.navigateTo({
					url:`/pages/users/userDetails/index?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	#container {
		width: 100%;
		height: 500rpx;
	}
</style>