import request from '@/utils/request'

// 客户分层
export function customerLevel() {
  return request({
    url: '/data/customer/level',
    method: 'get'
  })
}

// 销售排行
export function salesRank(data) {
  return request({
    url: '/data/sales/rank',
    method: 'get',
    params: data 
  })
}

// 销售趋势
export function salesTrend(data) {
  return request({
    url: '/data/sales/trend',
    method: 'get',
	params: data
  })
}

// 个人数据统计
export function statistics(data) {
  return request({
    url: '/data/statistics',
    method: 'get',
	params: data
  })
}

// 团队数据统计
export function teamStatistics(data) {
  return request({
    url: '/data/team/statistics',
    method: 'get',
	params: data
  })
}

// 团队数据统计列表
export function teamStatisticsList(data) {
  return request({
    url: '/data/team/statistics/list',
    method: 'get',
	params: data
  })
}
