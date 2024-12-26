// 应用全局配置
let domain = 'https://crm.api.fanjunshi.com'
if (process.env.NODE_ENV === 'development') {
	//domain = 'http://192.168.0.120:8090'
	domain = 'http://192.168.0.131:8090'
	//domain = 'https://crm.api.fanjunshi.com'
} 
module.exports = {
   //baseUrl: 'https://vue.ruoyi.vip/prod-api',
   baseUrl: domain,
   
   tokenName: 'AuthoriZation',
  //baseUrl: 'http://localhost:8090',
  // 应用信息
  mapkey: 'SKGBZ-HJ53U-L2ZVW-GG77N-6IW4K-7KF75',
  appInfo: {
    // 应用名称
    name: "饭军师crm系统",
    // 应用版本
    version: "1.1.0",
    // 应用logo
    logo: "/static/logo.png",
    // 政策协议
    agreements: [{
        title: "隐私政策",
        url: ""
      },
      {
        title: "用户服务协议",
        url: ""
      }
    ]
  }
}
