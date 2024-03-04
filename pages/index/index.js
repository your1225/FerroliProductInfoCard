// index.js
// 获取应用实例
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
    data: {
        isUpdate: false,
        imageUrl: app.globalData.imageUrl,
        qrCode: "",
        region: [],
        // macTypes: ['电热水器', '燃气热水器', '壁挂炉', '烟机灶具', '集成灶', '套餐（多件）'],
        shopInfos: [],
        loInfos: [],
        loSelectIndex: -1,
        // typeSelectIndex: 0,
        shopSelectIndex: 0,
        loBuyDate: "2022-06-18",
        loSalesName: "",
        loCusName: "",
        loCusTel: "",
        loAddress: "",
        loMacModel: "请选择机器型号",
        loMacNum: 1,
        loMacMoney: 0.00,
        loMacQrcode: "",
        loInstallDate: "2022-06-18",
        selectProduct: {},
        baseProductModels: [],
        modelSelectIndex: 0,
        dtStart: "2018-01-01",
        dtEnd: "2021-01-01",
        savedDialog: false,
        savedTitle: "",
        savedDesc: "",
        dialogButtons: [{
            type: 'primary',
            className: '',
            text: '关闭',
            value: 1
        }]
    },

    bindLoIdSelectChange(e) {
        // console.log(e.detail.value);

        if (e.detail.value < 0 || this.data.loInfos.length == 0) {
            // console.log(e.detail.value);
            // console.log(this.data.loInfos.length);

            return;
        }

        this.setData({
            isUpdate: true,
            loSelectIndex: e.detail.value,
            loCusName: this.data.loInfos[e.detail.value].loCusName,
            loCusTel: this.data.loInfos[e.detail.value].loCusTel,
            loAddress: this.data.loInfos[e.detail.value].loAddress,
            region: [this.data.loInfos[e.detail.value].loProvince, this.data.loInfos[e.detail.value].loCity, this.data.loInfos[e.detail.value].loDistrict]
        })

        this.getShopList();
    },

    // bindLoMacModel(e) {
    //     this.setData({
    //         loMacModel: e.detail.value
    //     })
    // },

    bindShopSelectChange(e) {
        this.setData({
            shopSelectIndex: e.detail.value
        })
    },

    bindLoMacNum(e) {
        this.setData({
            loMacNum: e.detail.value
        })
    },

    bindLoMacMoney(e) {
        this.setData({
            loMacMoney: e.detail.value
        })
    },

    bindLoBuyDateChange(e) {
        this.setData({
            loBuyDate: e.detail.value
        })
    },

    bindLoInstallDateChange(e) {
        this.setData({
            loInstallDate: e.detail.value
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

    bindLoSalesName(e) {
        this.setData({
            loSalesName: e.detail.value
        })
    },

    bindLoAddress(e) {
        this.setData({
            loAddress: e.detail.value
        })
    },

    bindRegionChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)

        this.setData({
            region: e.detail.value
        })

        this.getShopList();
    },

    // bindMacTypeChange(e) {
    //     this.setData({
    //         typeSelectIndex: e.detail.value
    //     })
    // },

    bindProductModelChange(e) {
        this.setData({
            modelSelectIndex: e.detail.value
        })
    },

    bindLoMacQrcode(e) {
        this.setData({
            loMacQrcode: e.detail.value
        })
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

                this.getShopList();
            }
        })
    },

    handleGetProduct() {
        console.log(this.data.baseProductModels[this.data.modelSelectIndex].bPmId)

        wx.navigateTo({
            url: '/pages/productSearch/productSearch?bPmId=' + this.data.baseProductModels[this.data.modelSelectIndex].bPmId
        })
    },

    /**
     * 保存前检查
     */
    checkData() {
        var dataLen = this.data.loAddress.length;
        if (dataLen < 5) {
            showToast({
                title: "详细地址不少于5个字！"
            });
            return false;
        }

        dataLen = this.data.loCusTel.length;
        if (dataLen != 11) {
            showToast({
                title: "必须填入11位手机号码！"
            });
            return false;
        }

        dataLen = this.data.loMacModel.length;
        if (dataLen < 3) {
            showToast({
                title: "必须填入机器型号，且多于3个字！"
            });
            return false;
        }

        if (this.data.loMacNum == 0) {
            showToast({
                title: "必须填入购机数量！"
            });
            return false;
        }

        if (this.data.loMacMoney < 100) {
            showToast({
                title: "必须填入金额，且大于100！"
            });
            return false;
        }

        dataLen = this.data.loCusName.length;
        if (dataLen < 2) {
            showToast({
                title: "姓名不少于2个字！"
            });
            return false;
        }

        return true;
    },

    clearData() {
        this.setData({
            isUpdate: false,
            loCusName: "",
            loCusTel: "",
            region: [],
            loAddress: "",
            loMacModel: "",
            loMacNum: 1,
            loMacMoney: 0,
            loSelectIndex: -1,
            loInfos: []
        });
    },

    /**
     * 获取门店信息
     */
    async getShopList() {
        var res = []

        // console.log(this.data.region.length)

        if (this.data.region.length > 0)
            res = await request({
                url: "Base/BaseShopInfo_GetModelList/BGcName = '" + this.data.region[1] + "'"
            });
        else
            res = await request({
                url: "Base/BaseShopInfo_GetModelList/1=1"
            });

        this.setData({
            shopInfos: res
        })
    },

    /**
     * 获取预售信息
     */
    async getCustomerList() {
        var res = []

        // console.log(this.data.region.length)

        res = await request({
            url: "LotteryStore/GetModelList/WeChatOpenId='" + app.globalData.openid + "' AND LOMacNum=0"
        });

        this.setData({
            loInfos: res
        })
    },

    /**
     * 获取产品类别信息
     */
    async getBaseProductModelList() {
        var res = []

        // console.log(this.data.region.length)

        res = await request({
            url: "OnlineStore/BaseProductModel_GetModelListByParentId/-2"
        });

        this.setData({
            baseProductModels: res
        })
    },

    async saveData() {
        const loId = this.data.isUpdate == false ? -1 : this.data.loInfos[this.data.loSelectIndex].loId;
        const baId = app.globalData.baId;
        const bPmId = this.data.baseProductModels[this.data.modelSelectIndex].bPmId;
        const weChatOpenId = app.globalData.openid;
        const loBuyDate = this.data.loBuyDate;
        const loCusName = this.data.loCusName;
        const loCusTel = this.data.loCusTel;
        const loProvince = this.data.region[0];
        const loCity = this.data.region[1];
        const loDistrict = this.data.region[2];
        const loAddress = this.data.loAddress;
        const loMacNum = this.data.loMacNum;
        const loMacMoney = this.data.loMacMoney;
        const loSalesName = this.data.loSalesName;
        const loMacQrcode = this.data.loMacQrcode;
        const bSiId = this.data.shopInfos[this.data.shopSelectIndex].bSiId;
        const loInstallDate = this.data.loInstallDate;
        const loCardSellingDate = this.data.loBuyDate;

        if (bSiId == undefined) {
            bSiId = -1;
        }

        if (Object.keys(this.data.selectProduct).length == 0) {
            this.setData({
                savedDialog: true,
                savedTitle: "不允许保存",
                savedDesc: "请先选择产品名称"
            })

            return;
        }

        console.log(this.data.selectProduct);
        
        const bPiCode = this.data.selectProduct.bPiCode;
        const loMacModel = this.data.selectProduct.bPiName;
        const loMacType = this.data.baseProductModels[this.data.modelSelectIndex].bPmName;
        // console.log(bSiId);

        // return;

        const saveParams = {
            loId,
            baId,
            bPmId,
            bPiCode,
            weChatOpenId,
            loBuyDate,
            loCusName,
            loCusTel,
            loProvince,
            loCity,
            loDistrict,
            loAddress,
            loMacType,
            loMacModel,
            loMacNum,
            loMacMoney,
            loMacQrcode,
            bSiId,
            loInstallDate,
            loSalesName,
            loCardSellingDate
        };

        console.log(saveParams);

        // return;

        const {
            fOK,
            fMsg
        } = await request({
            url: this.data.isUpdate == false ? "LotteryStore/Add" : "LotteryStore/Update",
            method: "POST",
            data: saveParams
        });

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
            loBuyDate: formatDateByH(nowDate),
            loInstallDate: formatDateByH(nowDate),
            dtStart: formatDateByH(startDate),
            dtEnd: formatDateByH(endDate)
        })

        this.getCustomerList();
        this.getBaseProductModelList();
    }
})