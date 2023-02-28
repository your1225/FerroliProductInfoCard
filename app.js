// app.js
App({
//   onLaunch() {
//     // 展示本地存储能力
//     const logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//   },
  globalData: {
    baseUrl: 'https://barcode.ferroli.com.cn:9014/api/',
    imageUrl: 'http://barcode.ferroli.com.cn:9020/FerroliFile/WeChat/',
    userInfo: null,
    publishDate: '法罗力 发布日期：2022-10-15',
    baId: 0,
    openid: ""
  }
})
