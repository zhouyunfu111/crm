import request from '@/utils/request'

// 客户管理
export function customer(id) {
  return request({
    url: `/customer/${id}`,
    method: 'get',
  })
}

// 客户指派
export function assignCustomer(id, params) {
  return request({
    url: `/customer/assign/${id}`,
    method: 'PUT',
	params
  })
}

// 客户批量指派
export function batchAssignCustomer(params) {
  return request({
    url: `/customer/batch/assign`,
    method: 'PUT',
	params
  })
}

// 客户认领
export function claimCustomer(id) {
  return request({
    url: `/customer/claim/${id}`,
    method: 'PUT'
  })
}

// 客户优惠券信息
export function customerCoupon(id) {
  return request({
    url: `/customer/coupon${id}`,
    method: 'get'
  })
}

// 客户详情
export function customerDetail(customerId) {
  return request({
    url: `/customer/detail/${customerId}`,
    method: 'get'
  })
}

// 客户跟进选项卡头部
export function customerfollowTabs() {
  return request({
    url: `/customer/follow/tabs/headers`,
    method: 'get'
  })
}

// 客户列表
export function customerList(params) {
  return request({
    url: `/customer/list`,
    method: 'get',
	params
  })
}

// 客户地图
export function customerMap(params) {
  return request({
    url: `/customer/map`,
    method: 'get',
	params
  })
}

// 客户选项卡头部
export function customertabsHeaders() {
  return request({
    url: `/customer/tabs/headers`,
    method: 'get'
  })
}

// 释放客户
export function customerRelease(id) {
  return request({
    url: `/customer/release/${id}`,
    method: 'put'
  })
}

// 订单列表
export function orderList(params) {
  return request({
    url: `/customer/order/list`,
    method: 'get',
	params
  })
}

// 已购商品列表
export function orderProductList(params) {
  return request({
    url: `/customer/order/product`,
    method: 'get',
	params
  })
}

// 优惠券列表
export function couponList(params) {
  return request({
    url: `/customer/coupon`,
    method: 'get',
	params
  })
}

// 操作日志列表
export function operaLogList(params) {
  return request({
    url: `/customer/operaLog`,
    method: 'get',
	params
  })
}


// 搜索列表
export function customerSearchList(params) {
  return request({
    url: `/customer/search/list`,
    method: 'get',
	params
  })
}

// 流失反馈

export function customerLossFeed(data) {
	return request({
		url: `/customer/loss/feed`,
		method: 'post',
		data
	})
}