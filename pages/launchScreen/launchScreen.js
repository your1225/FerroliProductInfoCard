// pages/launchScreen.js
const app = getApp()

import { request } from "../../request/request.js";

Page({
    data: {
        currentBackgroundImage: ""
    },

    /**
   * 看能不能自动登录，如果不能，就到登录页面
   */
    async autoLogin(wxUserCode) {
        const reData = await request({ url: "LotteryStore/WeChatAutoLogin/" + wxUserCode });
        // console.log(wxUserCode);
        app.globalData.openid = reData;
    },

    async getCurrentActivity() {
        const reData = await request({ url: "Base/BaseActivity_GetModelByDate" });

        if (reData != null) {
            app.globalData.baId = reData.baId
            
            this.setData({
                currentBackgroundImage: reData.baImagePath
            })

            setTimeout(function () {
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            }, 1000)
        } else {
            this.setData({
                currentBackgroundImage: "http://183.236.245.250:9015/WeChat/ferroli_not_yet.png"
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCurrentActivity()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                this.autoLogin(res.code)
            }
        })
    }
})