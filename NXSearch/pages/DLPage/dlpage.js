const tools = require('../../Util/util.js');

Page({
    data:{
        list_index:null,
        percent1:0
    },

    requestMessage(){
        return new Promise((resolve,reject)=>{

            var that = this
            wx.request({
                url: 'http://127.0.0.1:9000/SearchAPP/progress/',
                //data: data,
                dataType: 'json',
                method: 'GET',
                responseType: 'text',
                success:res=>{
                    console.log(res);
                    that.setData({
                        ["percent1"]:res.data.result
                    })
                    resolve();
                }
            })
        })
    },

    onLoad: function(options){
        var that = this
        console.log("Click get prra :"+options.list_index)
        that.setData({
            list_index:options.list_index
        })
        wx.request({
            url: 'http://127.0.0.1:9000/SearchAPP/DL/',
            data: {"test":options.list_index},
            dataType: 'json',
            method: 'POST',
            //timeout: 60000,
            success: (result) => {
              console.log(result.data)
              //list = JSON.parse(result.data)
              //list = result.data
              //console.log(list)
              //that.setData({
              //  searchValue1:result.data
              //})
              //console.log(that.data.searchValue1.SearchedName)
            },
            fail: (res) => {
                console.log("FAIL :"+this.data.percent1)
            }
          }),
          
          (async ()=>{
            while(that.data.percent1 != 100){
                await this.requestMessage();
            }
          })()
          
          //while(that.data.percent1 != 100){
           /*  
            setTimeout(function (){
                //console.log("while :"+this.data.percent1)  
                wx.request({
                    url: 'http://127.0.0.1:9000/SearchAPP/progress/',
                    //data: data,
                    dataType: 'json',
                    method: 'GET',
                    responseType: 'text',
                    //timeout: 0,
                        
                    success: (result) => {
                        console.log("return progress:"+result.data.result)
                        that.setData({
                            ["percent1"]:result.data.result
                        })
                    },
                    fail: (res) => {},
                    complete: (res) => {},
                    })

                },15000) */
/*
            setTimeout(function (){
                //console.log("while :"+this.data.percent)  
            },10000)
           
            wx.request({
                url: 'http://127.0.0.1:9000/SearchAPP/progress/',
                //data: data,
                dataType: 'json',
                method: 'GET',
                responseType: 'text',
                //timeout: 0,
                
                success: (result) => {
                    console.log("return progress:"+result.data.result)
                    that.setData({
                        ["percent1"]:result.data.result
                    })
                },
                fail: (res) => {},
                complete: (res) => {},
              })*/
              /*
              tools.request ('http://127.0.0.1:9000/SearchAPP/progress/','GET' ,null).then(res => {
                //服务器返回数据
                console.log('success:',res );
                that.setData({
                    ["percent1"]:res.data.result
                })
              }).catch(res => {
                  //报错
                  console.log('fail:',res);
              }).finally(()=>{
                  //完成
                 console.log('finally:', "结束");
              })*/
              
           //} 

    }
})