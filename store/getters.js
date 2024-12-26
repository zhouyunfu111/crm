const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.userInfo.permissions || [],
  userInfo: state => state.user.userInfo,
  dictDataType: state => state.user.dictDataType
}
export default getters
