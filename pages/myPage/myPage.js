// pages/myPage/myPage.js
const app = getApp()

import {
    request
} from "../../request/request.js";
import {
    addMonth,
    formatDateByH,
    formatDate
} from "../../utils/util.js"
import {
    showToast
} from "../../utils/asyncWx.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        lotteryUser : {},
        lotteryUserActivity : {},
        userLotteryList: []

    },

    async getUserLotteryList(weChatOpenId, bAId) {
        const reData = await request({
            url: "LotteryUserLottery/GetModelList/" + bAId + "/" + weChatOpenId
        });

        this.setData({
            userLotteryList: reData
        })
    },

    async getLotteryUser(weChatOpenId) {
        const reData = await request({
            url: "LotteryUser/GetModel/" + weChatOpenId
        });

        // console.log(reData);

        this.setData({
            lotteryUser: reData
        })
    },

    async getLotteryUserActivity(weChatOpenId, bAId) {
        const reData = await request({
            url: "LotteryUserActivity/GetModel/" + weChatOpenId + "/" + bAId
        });

        // console.log(reData);

        this.setData({
            lotteryUserActivity: reData
        })
    },

    toLotteryPage() {
        // console.log(this.data.lotteryUser);

        if (this.data.lotteryUser == null) {

            wx.showToast({
                title: '请输入购买信息',
                icon: 'error',
                duration: 2000
              })

            return
        }

        wx.navigateTo({
            url: '/pages/lotteryPage/lotteryPage'
        })
    },

    toRegisterPage() {
        // console.log(this.data.lotteryUser);

        if (this.data.lotteryUser == null) {

            wx.showToast({
                title: '请输入购买信息',
                icon: 'error',
                duration: 2000
              })

            return
        }

        wx.navigateTo({
            url: '/pages/registerPage/registerPage'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const baId = app.globalData.baId;
        const weChatOpenId = app.globalData.openid;

        this.getLotteryUser(weChatOpenId);
        this.getLotteryUserActivity(weChatOpenId, baId);
        this.getUserLotteryList(weChatOpenId, baId);

    }



})