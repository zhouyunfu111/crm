<template>
	<view>
		<view class="page-body">
			<view id="container" class="page-section page-section-gap" style="width: 100%;height:100vh;">
				<web-view :src="urlAdd"></web-view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config'
	import setQqMapLocationNetwork from '@/api/utils'
	export default {
		data() {
			return {
				urlAdd: '',
			}
		},
		async onLoad(options){		
			this.urlAdd = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${options.latitude},${options.longitude};title:${options.shopName};addr:${options.address}&key=${config.mapkey}&referer=fjsapp`
		},
	}
</script>

<style lang="scss">
	#container {
		width: 100%;
		height: 500rpx;
	}
</style>