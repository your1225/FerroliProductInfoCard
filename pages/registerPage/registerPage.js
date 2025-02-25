// pages/registerPage/registerPage.js
const app = getApp()

import {
    request,
    readFile
} from "../../request/request.js";
import {
    formatDateThis
} from "../../utils/dateUtil.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        photoData: "",
        titleString: "用户信息",
        subTitleString: "请认真填写",
        savedDialog: false,
        savedTitle: "",
        savedDesc: "",
        region: ['广东省', '江门市', '鹤山市'],
        luName: "",
        luTel: "",
        luAddress: "",
        dialogButtons: [{
            type: 'primary',
            className: '',
            text: '关闭',
            value: 1
        }]
    },

    bindLuNameChange(e) {
        this.setData({
            luName: e.detail.value
        })
    },

    bindLuTelChange(e) {
        this.setData({
            luTel: e.detail.value
        })
    },

    bindLuAddressChange(e) {
        this.setData({
            luAddress: e.detail.value
        })
    },

    bindRegionChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },

    handleGetAddress(e) {
        wx.chooseAddress({
            success: res => {
                // console.log(res);

                this.setData({
                    luName: res.userName,
                    luTel: res.telNumber,
                    region: [res.provinceName, res.cityName, res.countyName],
                    luAddress: res.detailInfo
                });
            }
        })
    },

    /**
     * 保存前检查
     */
    checkData() {
        var dataLen = this.data.luAddress.length;

        if (dataLen < 1) {
            wx.showToast({
                title: "必须填入详细地址！",
                icon: "none"
            });
            return false;
        }

        dataLen = this.data.luTel.length;

        if (dataLen < 1) {
            wx.showToast({
                title: "必须填入手机号码（非常重要）！"
            });
            return false;
        }

        return true;
    },

    async saveData() {
        const weChatOpenId = app.globalData.openid;
        const luName = this.data.luName;
        const luTel = this.data.luTel;
        const luProvince = this.data.region[0];
        const luCity = this.data.region[1];
        const luDistrict = this.data.region[2];
        const luAddress = this.data.luAddress;

        const saveParams = {
            luName,
            luTel,
            luProvince,
            luCity,
            luDistrict,
            luAddress,
            weChatOpenId
        };

        // console.log(saveParams);

        const fOK = await request({
            url: "LotteryUser/UpdateData",
            method: "POST",
            data: saveParams
        });

        if (fOK === true) {
            this.fillData()

            this.setData({
                savedDialog: true,
                savedTitle: "保存成功!",
                savedDesc: "欢迎您的加入。"
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

    async fillData() {
        const weChatOpenId = app.globalData.openid;

        const reData = await request({
            url: "LotteryUser/GetModel/" + weChatOpenId
        });

        // console.log(reData);

        if (reData.luName != "") {
            this.setData({
                region: [reData.luProvince, reData.luCity, reData.luDistrict],
                luName: reData.luName,
                luTel: reData.luTel,
                luAddress: reData.luAddress
            })
        }

        if (reData.luImage != "") {
            this.setData({
                photoData: reData.luImage
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

    handleCancel() {
        wx.navigateBack({
            delta: 1
        })
    },

    async handleUpdateImage(e) {
        const avatarUrl = e.detail.avatarUrl;

        const weChatOpenId = app.globalData.openid;

        const luImage = await readFile({
            filePath: avatarUrl,
            encoding: 'base64'
        })

        const saveParams = {
            luImage,
            weChatOpenId
        };

        const fOK = await request({
            url: "LotteryUser/UpdateImage",
            method: "POST",
            data: saveParams
        });

        if (fOK === true) {
            this.setData({
                photoData: luImage
            })
        } else {
            this.setData({
                savedDialog: true,
                savedTitle: "获取头像数据失败，请重试...",
                savedDesc: fMsg
            })

            return false
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fillData();
    }

})