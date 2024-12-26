import request from '@/utils/request'

// 销售商品列表
export function customerSaleProductList(params) {
	return request({
		url: '/customer/sale/product/list',
		method: 'get',
		params
	})
}	

// 删除列表记录
export function deleteSaleProduct(id) {
	return request({
		url: `/customer/sale/product/remove/${id}`,
		method: 'delete',
	})
}	

// 修改销售商品
export function editSaleProduct(data) {
	return request({
		url: `/customer/sale/product/edit`,
		method: 'put',
		data
	})
}	
// 销售商品详情
export function saleProductDeatils(id) {
	return request({
		url: `/customer/sale/product/detail/${id}`,
		method: 'get',
	})
}	
// 添加销售商品
export function addSaleProductSave(data) {
	return request({
		url: `/customer/sale/product/save`,
		method: 'post',
		data
	})
}	
//销售商品附件列表
export function saleProductAnnexList(params) {
	return request({
		url: `/customer/sale/product/annex/list`,
		method: 'get',
		params
	})
}
//添加销售商品附件列表
export function addProductSaleAnnexSave(data) {
	return request({
		url: `/customer/sale/product/annex/save`,
		method: 'post',
		data
	})
}

//删除销售商品附件
export function deleteSaleProductAnnex(id) {
	return request({
		url: `/customer/sale/product/annex/remove/${id}`,
		method: 'delete'
	})
}

//商品列表
export function storeProductList() {
	return request({
		url: `/store/product/list`,
		method: 'get',
	})
}


//销售商品更改附件状态
export function updateProductannexStatus(customerId) {
	return request({
		url: `/customer/sale/product/annex/status/${customerId}`,
		method: 'put',
	})
}

//议价商品列表
export function bargainingSelectProductList(params) {
	return request({
		url: `/customer/product/bargaining/selectProduct`,
		method: 'get',
		params
	})
}

//议价申请
export function productBargainingApply(data) {
	return request({
		url: `/customer/product/bargaining/apply`,
		method: 'post',
		data
	})
}


//历史议价记录
export function productBargainingRecord(params) {
	return request({
		url: `/customer/product/bargaining/record`,
		method: 'get',
		params
	})
}

//获取客户已议价商品信息
export function productBargainingAttrDetail(data) {
	return request({
		url: `/customer/product/bargaining/attr/detail`,
		method: 'get',
		data
	})
}

//议价详情
export function productBargainingDetail(params) {
	return request({
		url: '/customer/product/bargaining/detail',
		method: 'get',
		params
	})
}


//议价审核
export function productBargainingAudit(data) {
	return request({
		url: '/customer/product/bargaining/audit',
		method: 'post',
		data
	})
}

//议价检测
export function productBargainingAuditCheck(params) {
	return request({
		url: '/customer/product/bargaining/audit/check',
		method: 'get',
		params
	})
}
//修改议价(仅限未通过时)
export function productBargainingChange(data) {
	return request({
		url: '/customer/product/bargaining/change',
		method: 'put',
		data
	})
}