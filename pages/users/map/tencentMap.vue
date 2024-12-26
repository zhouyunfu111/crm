<template>
	<view class="map">
		<web-view
			src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=EDEBZ-DLO64-R5FUY-KLBUR-PXOJS-JTFPP&referer=fjsapp"></web-view>
	</view>
</template>

<script>

	window.addEventListener('message', event => {
		var mapResult = event.data;
		if (mapResult && mapResult.module == 'locationPicker') {
			let location = {
				poiaddress: mapResult.poiaddress,
				poiname: mapResult.poiname,
				latlng: mapResult.latlng
			}
			uni.$emit("selectLocationEvent",location)
			uni.navigateBack();
		}
	}, false);
</script>

<style></style>