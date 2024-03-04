// pages/productSearch/productSearch.js
const app = getApp()

import {
    request
} from "../../request/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl: app.globalData.imageUrl,
        baseProductInfos: [],
        bPmId: 0,
        piName: "",
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { bPmId } = options;
        const bPmIdTmp = Number(bPmId);

        console.log(options)

        this.setData({
            bPmId: bPmIdTmp
        })
    },

    bindPiName(e) {
        this.setData({
            piName: e.detail.value
        })
    },

    hanldeSearch() {
        const piName = this.data.piName;

        if (piName.length < 2) {
            this.setData({
                savedDialog: true,
                savedTitle: "查询内容太少",
                savedDesc: "请至少输入两个字符"
            })
        } else {
            this.getBaseProductInfo();
        }
    },

    async getBaseProductInfo() {
        const bPmId = this.data.bPmId;
        const searchText = this.data.piName.trim().replace(".", "dot").replace("+", "add");

        const saveParams = {
            searchText,
            bPmId
        };

        console.log(saveParams)

        const reData = await request({
            url: "ProduceInfo/GetModelListByName",
            method: "POST",
            data: saveParams
        });

        // console.log(reData)

        if (reData != null) {
            this.setData({
                baseProductInfos: reData
            })
        } else {
            this.setData({
                baseProductInfos: []
            })

            this.setData({
                savedDialog: true,
                savedTitle: "无任何产品信息",
                savedDesc: "请尝试其他关键字查找"
            })
        }
    },

    closeDialog() {
        this.setData({
            savedDialog: false
        });

        // wx.navigateBack({
        //     delta: 1
        // })
    },

    handleSelectProduct(e) {
        const selectedCode = e.currentTarget.dataset.code;
        const selectedItem = e.currentTarget.dataset.item

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            selectProduct: selectedItem,
            loMacModel: selectedItem.displayName
        });
        wx.navigateBack({
            delta: 1
        })
    }
})