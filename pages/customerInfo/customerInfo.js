// pages/customerInfo/customerInfo.js
const app = getApp()

import { request } from "../../request/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        slideButtons: [
            {
                type: 'warn',
                text: '删除'
            }
        ],
        lotteryStoreList: []
    },

    handleSetMacQrcode(e) {
        let value = e.currentTarget.dataset.value

        wx.navigateTo({
          url: '/pages/updateQrcode/updateQrcode?passId=' + value,
        })
    },

    slideButtonTap(e){
        var model = this.data.lotteryStoreList[e.currentTarget.dataset.index];

        if (model == null) {
            wx.showModal({
                title: '系统错误，请刷新后重试',
                icon: 'none',
                duration: 2000
            })
            return;
        }

        this.deleteData(model.loId)
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

    async deleteData(loId) {
        const saveParams = loId
        const { fOK, fMsg } = await request({ url: "LotteryStore/Delete", method: "POST", data: saveParams });

        if (fOK === "True") {
            this.getRecordList();
        } else {
            wx.showToast({
                title: fMsg,
                icon: 'none',
                duration: 2000
            })
        }
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