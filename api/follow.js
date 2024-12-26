import request from '@/utils/request'

export function followSave(data) {
  if(data.id){
	  return request({
	    url: '/customer/follow/edit',
	    method: 'put',
	  	data: data
	  })
  }else{
	  return request({
	    url: '/customer/follow/save',
		//baseUrl: 'http://192.168.0.134:3000/customer/follow/save',
	    method: 'post',
	  	data: data
	  })
  }
  
  
}

export function followList(pageParams) {
  return request({
	url: '/customer/follow/list' ,
    method: 'get',
	data:pageParams
  })
}

export function followDel(id) {
  return request({
    url: '/customer/follow/del' ,
    method: 'delete',
	data:{id:id}
  })
}

export function followDetail(id) {
  return request({
    url: `/customer/follow/detail/${id}` ,
    method: 'get'
  })
}
