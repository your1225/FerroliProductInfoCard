//同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    ajaxTimes++;

    //显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })

    //定义公共的url
    // const baseUrl = "https://barcode.ferroli.com.cn:9013/api/";
    const baseUrl = getApp().globalData.baseUrl;

    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                //关闭正在等待的图标
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

export const readFile = (params) => {
    ajaxTimes++;

    //显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })

    return new Promise((resolve, reject) => {
        wx.getFileSystemManager().readFile({
            ...params,
            success: (result) => {
                resolve(result.data);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                //关闭正在等待的图标
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}