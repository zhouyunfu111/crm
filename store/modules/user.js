import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
	login,
	logout,
	getInfo,
	getDictTypeGroup
} from '@/api/login'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'

const baseUrl = config.baseUrl

const user = {
	state: {
		token: getToken(),
		name: storage.get(constant.name),
		avatar: storage.get(constant.avatar),
		roles: storage.get(constant.roles),
		userInfo: storage.get(constant.userInfo),
		dictDataType:storage.get(constant.dictDataType)
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, name) => {
			state.name = name
			storage.set(constant.name, name)
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
			storage.set(constant.avatar, avatar)
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
			storage.set(constant.roles, roles)
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.permissions = permissions
			storage.set(constant.permissions, permissions)
		},
		SET_USER_INFO: (state, data) => {
			state.userInfo = data
			storage.set(constant.userInfo, data)
		},
		SET_DICT_DATA_TYPE: (state,data) => {
			state.dictDataType = data
			storage.set(constant.dictDataType, data)
		}
	},

	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			const username = userInfo.username.trim()
			const password = userInfo.password
			const code = userInfo.code
			const uuid = userInfo.uuid
			return new Promise((resolve, reject) => {
				login(username, password, code, uuid).then(({
					data: {
						token
					}
				}) => {
					setToken(token)
					commit('SET_TOKEN', token)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
		}) {
			return new Promise((resolve, reject) => {
				getInfo().then(res => {
					const { roles,nickName } = res.data
					const avatar = (res.data == null || avatar == "" || avatar == null) ?
						require("@/static/images/profile.jpg") : baseUrl + user.avatar
					const userName = (res.data == null || nickName == "" || nickName ==
						null) ? "" : nickName
					if (roles && roles.length > 0) {
						commit('SET_ROLES', roles)
					} else {
						commit('SET_ROLES', ['ROLE_DEFAULT'])
					}
					commit('SET_NAME', nickName)
					commit('SET_AVATAR', avatar)
					commit('SET_USER_INFO', res.data)
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		
		GetDictData({
			commit,
		}) {
			return new Promise((resolve, reject) => {
				getDictTypeGroup().then(res => {
					const mapDictData = res.data.reduce((cur,next) => {
						cur[next.type] = next.dataList
						return cur
					},{})
					commit('SET_DICT_DATA_TYPE',mapDictData)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 退出系统
		LogOut({
			commit,
			state,
			dispatch
		}) {
			return new Promise(async(resolve, reject) => {
				try {
					await logout(state.token)
					dispatch('ClearCacheData')
					resolve()
				} catch(e) {
					reject(e)
				}				
			})
		},
		ClearCacheData({
			commit,
			state
		}) {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			commit('SET_PERMISSIONS', [])
			commit('SET_USER_INFO', {})
			removeToken()
			storage.clear()
		}
	}
}

export default user