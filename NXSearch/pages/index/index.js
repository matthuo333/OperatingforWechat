//index.js
Page({
  data: {
    searchValue2:''
  },

  // 搜索页面跳回
  onLoad: function (options) {
    
    //var words = options.searchValue;
    if (options && options.searchValue){
      //words = words.split("\n,");
      console.log("接收到的参数是searchValue="+options.searchValue);
      this.setData({
        //searchValue2: "搜索："+options.searchValue
        searchValue2: JSON.parse(options.searchValue)
      });
    }
  },

  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },
  //点击列表Item 事件
  clickitem: function(e){
    console.log("Click  transfer prra :"+e.currentTarget.dataset.index)
    //var index = parseInt(e.currentTarget.dataset.index);
    //console.log("Click send prra :"+this.data.index)
    wx.navigateTo({
      url: '../DLPage/dlpage?list_index='+e.currentTarget.dataset.index
    })
  }
})
