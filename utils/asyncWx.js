/**
 * promise 形式的 getSetting
 */
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 chooseAddress
 */
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 openSetting
 */
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 showModel
 * @param {object} param0 参数
 */
export const showModel = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: "提示",
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 showModel
 * @param {object} param0 参数
 */
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 login
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

/**
 * promise 形式的 小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment = ({ pay }) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    }).catch(error => {
        console.log(error);
    });
}