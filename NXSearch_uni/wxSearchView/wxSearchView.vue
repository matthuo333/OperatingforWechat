<template>
	<view>
        <view class="weui-search-bar">
            <view class="weui-search-bar__form">
                <view class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
                    <input type="text" class="weui-search-bar__input" placeholder="请输入查询内容" :value="wxSearchData.value" @input="wxSearchInput" @confirm="wxSearchConfirm" />
                    <view class="weui-icon-clear" v-if="wxSearchData.value.length > 0" @tap="wxSearchClear">
                        <icon type="clear" size="14"></icon>
                    </view>
                </view>
            </view>
            <view class="weui-search-bar__cancel-btn" @tap="wxSearchConfirm">
                <text v-if="wxSearchData.value.length > 0" data-key="search">搜索</text>
                <text v-else data-key="back">返回</text>
            </view>
        </view>

        <view class="wxSearch" :style="'block;height:'+(wxSearchData.view.seachHeight)+'px;top:'+(wxSearchData.view.barHeight)+'px;'">
            <view class="wxSearchInner">
                <!-- 搜索提示部分 -->
                <view class="wxSearchMindKey">
                    <view class="wxSearchMindKeyList">
                        <block v-for="(item, index) in wxSearchData.tipKeys" :key="index">
                            <view class="wxSearchMindKeyItem" @tap="wxSearchKeyTap" :data-key="item">"{{item}}"</view>
                        </block>
                    </view>
                </view>

                <view v-if="wxSearchData.his[0]" class="wxSearchHistory" :style="'display:' + (wxSearchData.value.length > 0 ? 'none' : 'block')">
                    <view class="wxSearchHistoryItem">
                        <text class="wxSearchHistoryItemTitle">搜索记录</text>
                        <!-- text class="wxSearchHistoryItemDel" bindtap="wxSearchDeleteAll">删除</text -->
                        <icon type="clear" @tap="wxSearchDeleteAll" size="18" />
                    </view>
                    <view class="wxSearchKeyList">
                        <block v-for="(item, index) in wxSearchData.his" :key="index">
                            <view class="wxSearchKeyItem" @tap="wxSearchKeyTap" :data-key="item">"{{ item }}"</view>
                        </block>
                    </view>
                </view>

                <view class="wxSearchKey" :style="'display:' + (wxSearchData.value.length > 0 ? 'none' : 'block')">
                    <text v-if="wxSearchData.hotKeys[0]" class="wxSearchTitle">搜索热点</text>
                    <view class="wxSearchKeyList">
                        <block v-for="(item, index) in wxSearchData.hotKeys" :key="index">
                            <view class="wxSearchKeyItem" @tap="wxSearchKeyTap" :data-key="item">"{{ item }}"</view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
/***
 * // 定义数据格式
 * "wxSearchData":{
 *  configconfig:{
 *    style: "wxSearchNormal"
 *  },
 *  view:{
 *    hidden: true,
 *    searchbarHeght: 20
 *  }
 *  hotKeys:[],//自定义热门搜索
 *  his:[]//历史搜索关键字
 *  value
 * }
 */
// 提示集合
var __tipKeys = []; // 搜索回调函数

var __searchFunction = null; // 返回函数

var __goBackFunction = null; // 应用变量

var __that = null; // 初始化函数

function init(that, hotKeys, tipKeys, searchFunction, goBackFunction) {
    __that = that;
    __tipKeys = tipKeys;
    __searchFunction = searchFunction;
    __goBackFunction = goBackFunction;
    var temData = {};
    var barHeight = 43;
    var view = {
        barHeight: barHeight
    };
    temData.hotKeys = hotKeys;
    uni.getSystemInfo({
        success: function (res) {
            var wHeight = res.windowHeight;
            view.seachHeight = wHeight - barHeight;
            temData.view = view;

            __that.setData({
                wxSearchData: temData
            });
        }
    });
    getHisKeys(__that);
} // 搜索框输入时候操作

function wxSearchInput(e) {
    var inputValue = e.detail.value; // 页面数据

    var temData = __that.data.wxSearchData; // 寻找提示值

    var tipKeys = [];

    if (inputValue && inputValue.length > 0) {
        for (var i = 0; i < __tipKeys.length; i++) {
            var mindKey = __tipKeys[i]; // 包含字符串

            if (mindKey.indexOf(inputValue) != -1) {
                tipKeys.push(mindKey);
            }
        }
    } // 更新数据

    temData.value = inputValue;
    temData.tipKeys = tipKeys; // 更新视图

    __that.setData({
        wxSearchData: temData
    });
} // 清空输入

function wxSearchClear() {
    // 页面数据
    var temData = __that.data.wxSearchData; // 更新数据

    temData.value = '';
    temData.tipKeys = []; // 更新视图

    __that.setData({
        wxSearchData: temData
    });
} // 点击提示或者关键字、历史记录时的操作

function wxSearchKeyTap(e) {
    search(e.target.dataset.key);
} // 确任或者回车

function wxSearchConfirm(e) {
    var key = e.target.dataset.key;

    if (key == 'back') {
        __goBackFunction();
    } else {
        search(__that.data.wxSearchData.value);
    }
}

function search(inputValue) {
    if (inputValue && inputValue.length > 0) {
        // 添加历史记录
        wxSearchAddHisKey(inputValue); // 更新

        var temData = __that.data.wxSearchData;
        temData.value = inputValue;

        __that.setData({
            wxSearchData: temData
        }); // 回调搜索

        __searchFunction(inputValue);
    }
} // 读取缓存

function getHisKeys() {
    var value = [];

    try {
        value = uni.getStorageSync('wxSearchHisKeys');

        if (value) {
            // Do something with return value
            var temData = __that.data.wxSearchData;
            temData.his = value;

            __that.setData({
                wxSearchData: temData
            });
        }
    } catch (e) {
        // Do something when catch error
    }
} // 添加缓存

function wxSearchAddHisKey(inputValue) {
    if (!inputValue || inputValue.length == 0) {
        return;
    }

    var value = uni.getStorageSync('wxSearchHisKeys');

    if (value) {
        if (value.indexOf(inputValue) < 0) {
            value.unshift(inputValue);
        }

        uni.setStorage({
            key: 'wxSearchHisKeys',
            data: value,
            success: function () {
                getHisKeys(__that);
            }
        });
    } else {
        value = [];
        value.push(inputValue);
        uni.setStorage({
            key: 'wxSearchHisKeys',
            data: value,
            success: function () {
                getHisKeys(__that);
            }
        });
    }
} // 删除缓存

function wxSearchDeleteAll() {
    uni.removeStorage({
        key: 'wxSearchHisKeys',
        success: function (res) {
            var value = [];
            var temData = __that.data.wxSearchData;
            temData.his = value;

            __that.setData({
                wxSearchData: temData
            });
        }
    });
} // 导出接口

module.exports = {
    init: init,
    //初始化函数
    wxSearchInput: wxSearchInput,
    // 输入变化时的操作
    wxSearchKeyTap: wxSearchKeyTap,
    // 点击提示或者关键字、历史记录时的操作
    wxSearchDeleteAll: wxSearchDeleteAll,
    // 删除所有的历史记录
    wxSearchConfirm: wxSearchConfirm,
    // 搜索函数
    wxSearchClear: wxSearchClear // 清空函数
};
</script>
<style>
/** 整个区域 */
.wxSearch {
    position: absolute;
    top: 43px;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 1px #eee solid;
    background-color: rgba(200, 200, 200, 0.1);
    z-index: 9999;
}

/** 搜索框下面的提示区域 */
.wxSearchInner {
    background-color: #fff;
}

/** 搜索热点标题 */
.wxSearchTitle {
    display: block;
    padding: 10px 5px 5px 10px;
    font-size: 13px;
    text-align: left;
}

/** 提示样式 */
.wxSearchMindKeyItem {
    padding: 10px 5px 10px 15px;
    margin-left: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    font-size: 13px;
}

/** 标签样式 */
.wxSearchKeyList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;
}

/** 标签样式 */
.wxSearchKeyItem {
    flex: 0 0 18%;
    font-size: 13px;
    text-align: center;
    border: 1px solid #eee;
    margin: 5px;
    padding: 4px 5px 4px 5px;
    border-radius: 0px;
    background-color: rgba(200, 200, 200, 0.1);
}

/** 搜索记录标题栏 */
.wxSearchHistoryItem {
    padding-left: 10px;
    padding-top: 10px;
    padding-right: 5px;
    padding-bottom: 5px;
    display: flex;
}

/** 搜索记录标题 */
.wxSearchHistoryItemTitle {
    flex: 8;
    font-size: 13px;
}

/** 搜索记录删除按钮 */
.wxSearchHistoryItemDel {
    flex: 1;
    font-size: 13px;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    border: 1px solid #eee;
    border-radius: 2px;
}

/** ---------------------- 以下是搜索框的 we-ui 样式--------------------------------*/

/*!
 * WeUI v1.1.1 (https://github.com/weui/weui-wxss)
 * Copyright 2017 Tencent, Inc.
 * Licensed under the MIT license
 */

.weui-search-bar {
    position: relative;
    padding: 8px 10px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    background-color: #efeff4;
    border-top: 1rpx solid #d7d6dc;
    border-bottom: 1rpx solid #d7d6dc;
}

.weui-icon-search {
    margin-right: 8px;
    font-size: inherit;
}

.weui-icon-search_in-box {
    position: absolute;
    left: 10px;
    top: 7px;
}

.weui-search-bar__text {
    display: inline-block;
    font-size: 14px;
    vertical-align: middle;
}

.weui-search-bar__form {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: auto;
    flex: auto;
    border-radius: 5px;
    background: #fff;
    border: 1rpx solid #e6e6ea;
}

.weui-search-bar__box {
    position: relative;
    padding-left: 30px;
    padding-right: 30px;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
}

.weui-search-bar__input {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
}

.weui-icon-clear {
    position: absolute;
    top: 0;
    right: 0;
    padding: 7px 8px;
    font-size: 0;
}

.weui-search-bar__label {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    border-radius: 3px;
    text-align: center;
    color: #9b9b9b;
    background: #fff;
    line-height: 28px;
}

.weui-search-bar__cancel-btn {
    margin-left: 10px;
    line-height: 28px;
    color: #09bb07;
    white-space: nowrap;
}
</style>
