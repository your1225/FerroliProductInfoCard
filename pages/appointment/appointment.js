// pages/appointment/appointment.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, formatDate } from "../../utils/util.js"
import { showToast } from "../../utils/asyncWx.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        region: [],
        shopInfos: [],
        shopSelectIndex: 0,
        loCardSellingDate: "2023-03-01",
        loCusName: "",
        loCusTel: "",
        loAddress: "",
        loSalesName: "",
        dtStart: "2018-01-01",
        dtEnd: "2021-01-01",
        savedDialog: false,
        savedTitle: "",
        savedDesc: "",
        dialogButtons: [
            {
                type: 'primary',
                className: '',
                text: '关闭',
                value: 1
            }
        ]
    },

    bindShopSelectChange(e) {
        this.setData({
            shopSelectIndex: e.detail.value
        })
    },

    bindLoCardSellingDateChange(e) {
        this.setData({
            loCardSellingDate: e.detail.value
        })
    },

    bindLoCusName(e) {
        this.setData({
            loCusName: e.detail.value
        })
    },

    bindLoCusTel(e) {
        this.setData({
            loCusTel: e.detail.value
        })
    },

    bindLoAddress(e) {
        this.setData({
            loAddress: e.detail.value
        })
    },

    bindLoSalesName(e) {
        this.setData({
            loSalesName: e.detail.value
        })
    },

    bindRegionChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)

        this.setData({
            region: e.detail.value
        })

        this.getCustomerList();
    },

    handleGetAddress(e) {
        wx.chooseAddress({
            success: res => {
                // console.log(res);

                this.setData({
                    loCusName: res.userName,
                    loCusTel: res.telNumber,
                    region: [res.provinceName, res.cityName, res.countyName],
                    loAddress: res.detailInfo
                });

                this.getCustomerList();
            }
        })
    },

    /**
    * 保存前检查
    */
    checkData() {
        var dataLen = this.data.loAddress.length;
        if (dataLen < 5) {
            showToast({ title: "详细地址不少于5个字！" });
            return false;
        }

        dataLen = this.data.loCusTel.length;
        if (dataLen != 11) {
            showToast({ title: "必须填入11位手机号码！" });
            return false;
        }

        dataLen = this.data.loCusName.length;
        if (dataLen < 2) {
            showToast({ title: "姓名不少于2个字！" });
            return false;
        }

        return true;
    },

    clearData() {
        this.setData({
            loCusName: "",
            loCusTel: "",
            region: [],
            loAddress: ""
        });
    },

    /**
   * 获取客户信息
   */
    async getCustomerList() {
        var res = []

        // console.log(this.data.region.length)

        if (this.data.region.length > 0)
            res = await request({ url: "Base/BaseShopInfo_GetModelList/BGcName = '" + this.data.region[1] + "'" });
        else
            res = await request({ url: "Base/BaseShopInfo_GetModelList/1=1" });

        this.setData({
            shopInfos: res
        })
    },

    async saveData() {
        const loId = -1;
        const baId = app.globalData.baId;
        const weChatOpenId = app.globalData.openid;
        const loCardSellingDate = this.data.loCardSellingDate;
        const loSalesName = this.data.loSalesName;
        const loCusName = this.data.loCusName;
        const loCusTel = this.data.loCusTel;
        const loProvince = this.data.region[0];
        const loCity = this.data.region[1];
        const loDistrict = this.data.region[2];
        const loAddress = this.data.loAddress;
        const bSiId = this.data.shopInfos[this.data.shopSelectIndex].bSiId;

        if (bSiId == undefined) {
            bSiId = -1;
        }

        // console.log(bSiId);

        // return;

        const saveParams = {
            loId, baId, weChatOpenId, loCusName, loCusTel, loProvince, loCity, loDistrict, loAddress, bSiId, loCardSellingDate, loSalesName
        };

        // console.log(saveParams);

        const { fOK, fMsg } = await request({ url: "LotteryStore/AddAppointment", method: "POST", data: saveParams });

        if (fOK === "True") {
            this.clearData();
            // this.setData({
            //   savedDialog: true,
            //   savedTitle: "保存成功!",
            //   savedDesc: "待市场部人员审核。"
            // })
            wx.navigateTo({
                url: '/pages/tips/tips',
            })
        } else {
            // console.log(fMsg);

            this.setData({
                savedDialog: true,
                savedTitle: "保存失败，请重试...",
                savedDesc: fMsg
            })
        }
    },

    closeDialog() {
        this.setData({
            savedDialog: false
        });
    },

    /**
     * 提交数据
     */
    handlePost() {
        if (this.checkData() === false) {
            return;
        }

        this.saveData();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var nowDate = new Date();
        var startDate = new Date(addMonth(-12));
        var endDate = new Date(addMonth(12));

        this.setData({
            loCardSellingDate: formatDateByH(nowDate),
            dtStart: formatDateByH(startDate),
            dtEnd: formatDateByH(endDate)
        })
    }
})