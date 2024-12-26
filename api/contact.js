import request from '@/utils/request'

// 获取客户联系人列表
export function contactsList(params) {
  return request({
    url: '/customer/contacts/list',
    method: 'get',
	params
  })
}

// 联系人详情
export function contactsDetail(id) {
  return request({
    url: `/customer/contacts/detail/${id}`,
    method: 'get'
  })
}

// 添加联系人
export function addContacts(data) {
  return request({
    url: '/customer/contacts/add',
    method: 'post',
	data: data
  })
}

// 修改联系人
export function editContacts(data) {
  return request({
    url: '/customer/contacts/edit',
    method: 'put',
	data: data
  })
}

// 删除联系人
export function delContacts(data) {
  return request({
    url: '/customer/contacts/del',
    method: 'delete',
	data: data
  })
}

// 设置默认联系人
export function updateDefault(data) {
  return request({
    url: '/customer/contacts/default',
    method: 'put',
	data: data
  })
}


