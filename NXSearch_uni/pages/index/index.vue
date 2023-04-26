<template>
    <block>
        <view class="weui-search-bar">
            <view class="weui-search-bar__form">
                <view class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
                    <input type="text" class="weui-search-bar__input" :disabled="true" placeholder="搜索入口" @tap="wxSearchTab" />
                </view>
            </view>
        </view>

        <view :data-index="item.viewid" @tap="clickitem" v-for="(item, index) in searchValue2" :key="item.viewid">
            {{ item.message }}
        </view>
    </block>
</template>

<script>
//index.js
export default {
    data() {
        return {
            searchValue2: ''
        };
    }, // 搜索页面跳回
    onLoad: function (options) {
        //var words = options.searchValue;
        if (options && options.searchValue) {
            //words = words.split("\n,");
            console.log('接收到的参数是searchValue=' + options.searchValue);
            this.setData({
                //searchValue2: "搜索："+options.searchValue
                searchValue2: JSON.parse(options.searchValue)
            });
        }
    },
    methods: {
        // 搜索入口
        wxSearchTab: function () {
            uni.redirectTo({
                url: '../search/search'
            });
        },

        //点击列表Item 事件
        clickitem: function (e) {
            console.log('Click  transfer prra :' + e.currentTarget.dataset.index); //var index = parseInt(e.currentTarget.dataset.index);
            //console.log("Click send prra :"+this.data.index)

            uni.navigateTo({
                url: '../DLPage/dlpage?list_index=' + e.currentTarget.dataset.index
            });
        }
    }
};
</script>
<style>
@import '../../wxSearchView/wxSearchView.vue';
</style>
