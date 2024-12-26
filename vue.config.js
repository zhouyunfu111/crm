let filePath = ''  //默认文件路径
let timeStamp = '' //时间戳
let version = '-v1.0.0-' //版本号

// 编译环境判断，可根据不同环境做不同的配置
if (process.env.UNI_PLATFORM === 'h5') { 
    filePath = 'static/js/'
    timeStamp = new Date().getTime()
    process.env.VUE_APP_INDEX_CSS_HASH = `${version}${timeStamp}` //给css文件也使用该时间戳
}

module.exports = {
    configureWebpack: {
        output: { //重构文件名
            filename: `${filePath}[name].${version}${timeStamp}.js`, //index文件重命名带有版本号+时间戳的格式
            chunkFilename: `${filePath}[name].${version}${timeStamp}.js` //static/js/文件重命名带有版本号+时间戳的格式
        }
    },
    chainWebpack: config => {
        // config.plugin('html').map(args => {
        //     console.log(args)
        //     args[0].title = '饭军师'
        //     return args
        // })
    },
}