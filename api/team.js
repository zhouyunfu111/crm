import request from '@/utils/request'

// 获取团队成员
export function teamMemberList(params) {
	return request({
		url: '/team/member/list',
		method: 'get',
		params
	})
}

//获取bdm成员列表
export function teamMemberListBdm() {
	return request({
		url: '/team/member/list/bdm',
		method: 'get'
	})
}

//获取还没加入团队的成员列表
export function teamNoMemberList(params) {
	return request({
		url: '/team/noMember/list',
		method: 'get',
		params
	})
}


//移除团队成员
export function deleteTeamMember(data) {
	return request({
		url: '/team/member/delete',
		method: 'delete',
		data
	})
}

//添加团队成员
export function addTeamMember(data) {
	return request({
		url: '/team/member/add',
		method: 'post',
		data
	})
}