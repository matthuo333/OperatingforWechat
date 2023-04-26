 //封装request方法
 const request = (url, method, data) => {
    var promise = new Promise((resolve, reject) => {
        //提示一下
        wx.showLoading({
          title: '加载中'
        })
        //网络请求
        wx.request({
            url: url,
            data: data,
            method: method,
            //header: {
            //    'Content-Type': 'application/x-www-form-urlencoded',//这是python后台使用的
            //    'Cookie': 'sessionid=' + getApp().globalData.cookie //这是我保存在全局变量中的的sessionid
            //},
            success: function (res) {
                wx.hideLoading()
                //服务器返回数据
                if (res.statusCode == 200) {
                    resolve(res);
                } else {
                    //返回错误提示信息
                    reject(res.data);
                }
            },
            fail: function (e) {
                wx.hideLoading()
                wx.showToast({
                  title: '无法连接服务器',
                  icon: 'loading',
                  duration: 1000
                })
                reject('网络出错');
            }
    })
    });
        return promise;
    }
    
    module.exports = {
        request:request
    }