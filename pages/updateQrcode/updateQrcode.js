// pages/updateQrcode/updateQrcode.js
const app = getApp()

import { request } from "../../request/request.js";
import { addMonth, formatDateByH, getTitle, getSubTitle } from "../../utils/util.js"
import { showToast } from "../../utils/asyncWx.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        loId: -1,
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
        ],
        qrCode: "请扫描产品侧面或底部二维码",
        baseProductInfo: {},
        selectLotteryStore: {}
    },

    // bindQrcode(e) {
    //     this.setData({
    //         qrCode: e.detail.value
    //     })
    // },

    handleGetProductInfo(e) {
        wx.scanCode({
            onlyFromCamera: false,
            scanType: ['barCode', 'qrCode'],
            success: res => {
                if (res.errMsg == 'scanCode:ok') {
                    const codeFull = res.result

                    if (codeFull.length > 50) {
                        wx.showToast({
                            icon: 'none',
                            title: '二维码太长了吧！'
                        })

                        return
                    }

                    // console.log(codeFull)

                    this.getBaseProductInfo(codeFull)
                }
            },
            fail: res => {
                // 接口调用失败
                wx.showToast({
                    icon: 'none',
                    title: '接口调用失败！'
                })
            },
            complete: res => {
                // 接口调用结束
                // console.log(res)
            }
        });
    },

    async getBaseProductInfo(codeFull) {
        codeFull = codeFull.trim().replace(".", "dot").replace("+", "add");

        const reData = await request({ url: "ProduceInfo/GetModelByErpBarcode/" + codeFull });
        // console.log(reData);

        if (reData != null) {
            this.setData({
                qrCode: codeFull,
                baseProductInfo: reData
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '无法识别的二维码！'
            })

            this.setData({
                qrCode: "",
                baseProductInfo: {}
            })
        }
    },

    async getLotteryStore(loId) {
        const reData = await request({ url: "LotteryStore/GetModel/" + loId.toString() });
        // console.log(reData);
        // console.log(loId);

        if (reData != null) {
            this.setData({
                selectLotteryStore: reData
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '未找到这条数据'
            })

            wx.navigateBack({
                delta: 1,
            })
        }
    },

    /**
     * 保存前检查
     */
    checkData() {
        var dataLen = this.data.qrCode.length;

        if (dataLen < 1) {
            // showToast({ title: "必须填入产品条码！" });

            this.setData({
                savedDialog: true,
                savedTitle: "不允许保存",
                savedDesc: "必须填入产品条码！"
            })

            return false;
        }

        if (Object.keys(this.data.baseProductInfo).length == 0) {
            this.setData({
                savedDialog: true,
                savedTitle: "不允许保存",
                savedDesc: "请先扫描二维码！"
            })

            return false;
        }

        return true;
    },

    async saveData() {
        const loId = this.data.loId;
        const loMacQrcode = this.data.qrCode;

        const saveParams = {
            loId, loMacQrcode
        };

        // console.log(saveParams);

        const { fOK, fMsg } = await request({ url: "LotteryStore/UpdateMacQrcode", method: "POST", data: saveParams });

        if (fOK === "True") {
            this.setData({
                savedDialog: true,
                savedTitle: "保存成功!",
                savedDesc: "已经更新了机器条码"
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

        wx.navigateBack({
            delta: 1
        })
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
    onLoad(options) {
        const { passId } = options;
        const loId = Number(passId);

        // console.log(loId);

        this.getLotteryStore(loId);

        this.setData({
            loId: loId
        })
    }
})