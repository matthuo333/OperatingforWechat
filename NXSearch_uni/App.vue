<script>
//app.js
export default {
    data() {
        return {};
    },
    onLaunch: function () {
        // 展示本地存储能力
        var logs = uni.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        uni.setStorageSync('logs', logs); // 登录

        uni.login({
            success: (res) => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        }); // 获取用户信息

        uni.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    uni.getUserInfo({
                        success: (res) => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo; // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况

                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res);
                            }
                        }
                    });
                }
            }
        });
    },
    globalData: {
        userInfo: null
    }
};
</script>
<style>
page {
    background-color: #f8f8f8;
    font-size: 16px;
    font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
}
.page__hd {
    padding: 40px;
}
.page__bd {
    padding-bottom: 40px;
}
.page__bd_spacing {
    padding-left: 15px;
    padding-right: 15px;
}

.page__ft {
    padding-bottom: 10px;
    text-align: center;
}

.page__title {
    text-align: left;
    font-size: 20px;
    font-weight: 400;
}

.page__desc {
    margin-top: 5px;
    color: #888888;
    text-align: left;
    font-size: 14px;
}
</style>
