import request from "@/utils/request"

// 获取城市tree结构的列表
export function cityListTree() {
  return request({
    url: "/city/salesArea/list/tree",
    method: "get",
  })
}


// 注册客户资料
export function customerRegister(data) {
  return request({
    url: "/customer/register",
    method: "post",
	data
  })
}

// 仅注册门店数据
export function registerShop(data) {
  return request({
    url: "/customer/add",
    method: "post",
	data
  })
}

// 查询客户详情
export function getCustomerDetail(customerId) {
 return request({
   url: `/customer/${customerId}`,
   method: "get",
 })
}

// 修改客户详情
export function updateCustomer(data) {
 return request({
   url: "/customer/update",
   method: "put",
   data
 })
}
