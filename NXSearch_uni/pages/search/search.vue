<script>
//index.js
var WxSearch = require('../../wxSearchView/wxSearchView.vue');

export default {
    data() {
        return {
            searchValue1: '',

            wxSearchData: {
                value: '',
                tipKeys: [],
                his: '',
                hotKeys: ''
            }
        };
    }, // 搜索栏
    onLoad: function () {
        var that = this;
        WxSearch.init(
            that, // 本页面一个引用
            ['杭州', '嘉兴', '海宁', '桐乡', '宁波', '金华'], // 热点搜索推荐，[]表示不使用
            ['湖北', '湖南', '北京', '南京'], // 搜索匹配，[]表示不使用
            that.mySearchFunction, // 提供一个搜索回调函数
            that.myGobackFunction //提供一个返回回调函数
        );
    },
    methods: {
        // 转发函数,固定部分
        wxSearchInput: WxSearch.wxSearchInput,

        // 输入变化时的操作
        wxSearchKeyTap: WxSearch.wxSearchKeyTap,

        // 点击提示或者关键字、历史记录时的操作
        wxSearchDeleteAll: WxSearch.wxSearchDeleteAll,

        // 删除所有的历史记录
        wxSearchConfirm: WxSearch.wxSearchConfirm,

        // 搜索函数
        wxSearchClear: WxSearch.wxSearchClear,

        // 清空函数
        // var that=this
        // 搜索回调函数
        mySearchFunction: function (value) {
            // do your job here
            var that = this;
            var list = {};
            uni.request({
                url: 'http://127.0.0.1:9000/SearchAPP/Search/',
                data: {
                    test: value
                },
                dataType: 'json',
                method: 'POST',
                timeout: 60000,
                success: (result) => {
                    console.log(result.data); //list = JSON.parse(result.data)

                    list = result.data;
                    console.log(list);
                    that.setData({
                        searchValue1: result.data
                    });
                    console.log(that.searchValue1.SearchedName);
                }
            }); // 跳转

            setTimeout(function () {
                if (list['status'] == 'MattTrue') {
                    console.log('Matt get list');
                    uni.redirectTo({
                        //url: '../index/index?searchValue='+value
                        //console.log(list.SearchedName),
                        url: '../index/index?searchValue=' + JSON.stringify(list.SearchedName)
                    });
                } else {
                    console.log('time out');
                }
            }, 60000); //wx.redirectTo({
            //url: '../index/index?searchValue='+value
            // url: '../index/index?searchValue='+list
            //})
        },

        // 返回回调函数
        myGobackFunction: function () {
            // do your job here
            // 跳转
            uni.redirectTo({
                url: '../index/index?searchValue=返回'
            });
        }
    }
};
</script>
<style>
@import '../../wxSearchView/wxSearchView.vue';
</style>
vue