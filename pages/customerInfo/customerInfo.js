// pages/customerInfo/customerInfo.js
const app = getApp()

import { request } from "../../request/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lotteryStoreList: []
    },

    handleSetMacQrcode(e) {
        let value = e.currentTarget.dataset.value

        wx.navigateTo({
          url: '/pages/updateQrcode/updateQrcode?passId=' + value,
        })
    },

    //获取用户事件列表数据
    async getRecordList() {
        const res = await request({ url: "LotteryStore/GetModelList/WeChatOpenId='" + app.globalData.openid + "'" });

        this.setData({
            lotteryStoreList: res
        })
        // console.log(res);

        //关闭下拉刷新窗口
        wx.stopPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getRecordList();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.getRecordList();
    }
})