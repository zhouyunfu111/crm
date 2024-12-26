import request from '@/utils/request'


export function dictDataType(dictType) {
  return request({
    url: `/dict/data/type/${dictType}`,
    method: 'get',
  })
}

export function setQqMapLocationNetwork(data) {
	return request({
	  url: `https://apis.map.qq.com/ws/location/v1/network`,
	  method: 'post',
	  data 
	})
}