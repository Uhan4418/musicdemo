const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)
}

module.exports = {
  lintOnSave:false   ,//关闭eslint
  devServer:{
    port: '8089',
    proxy:{  // 配置代理服务器 解决跨域问题 
      // 接口小暗号
      '/recommend':{
        target:'http://ustbhuangyi.com',  //要转发的目标网址
        changeOrigin:true,
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite:{
          '^/recommend':''  // 将路径中多余的暗号删除
        }
      },

      // 接口小暗号
      '/xixi':{
        target:'http://47.95.207.1:3000',  //要转发的目标网址
        changeOrigin:true,
        pathRewrite:{
          '^/xixi':''  // 将路径中多余的暗号删除
        }
      },
    }
  },
  // 绝对路径的别名
  chainWebpack:(config)=>{
    config.resolve.alias
    .set('@',resolve('./src'))  // 给src的绝对路径起一个别名@
    .set('api',resolve('./src/api'))
    .set('style',resolve('./src/style'))
    .set('components',resolve('./src/components'))
  }
}
