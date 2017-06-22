一、头部工具条
ext6\templates\admin-dashboard
二、extjs 组件生命周期
初始化、渲染、销毁
初始化：应用组件的配置；注册组件基本的事件；ComponentMgr注册；执行initComponent；	初始化plugins；初始化Component状态；渲染Component
三、鼠标悬停提示信息
button  Ext.QuickTips.init();  tooltip :'这里填写提示信息',
textfield      listeners : {
                    render : function(field) {
                            Ext.QuickTips.init(); //初始化激活提示插件
                            Ext.QuickTips.register({
                             target : field.el.dom,
                            text :'这里填写提示信息'
                            })
                    }
                }
四、form.submit
1.注意要写上验证 (否则上传文件成功后，总会跳到failure)
2. 回调success或failure是根据返回来的参数的json串中的"success"的值来决定的（后台）
   response.getWriter().write("{id:0001}");
   应该改为  response.getWriter().write("{success:true,id:0001}");

 if (form.getForm().isValid()) {
//验证通过后
form.submit({
    url: 'xxx',
    success: function(form, action) {
    },
    failure: function(form, action) {
    }
});
}
五、遍历对象
 var obj = {"qq":"xxx","wechat":"bbb","weibo":"aaa"};
  var props = "";
  for(var p in obj){
      if(typeof(obj[p])=="function"){
            obj[p]();
      }else{
            props+= p + "=" + obj[p] + " ";
         }
  }
  console.log(props);
六、ExtJS获取父子、兄弟容器元素方法
    1.当前对象的父对象(上级对象)        this.ownerCt:
    2.当前对象的下一个相邻的对象        this.nextSibling();
    3.当前对象的上一个相邻的对象        this.previousSibling();
    4.当前容器中的第一个子对象          this.get(0); / this.items.first();
    5.当前容器的最后一个子对象          this.items.last();
    6.查找当前对象的所有上级匹配的容器  this.findParentByType(String xtype)
    7.查找当前对象的所有下级匹配的组件  this.findByType(String xtype)

七、验证整个form符合条件才能提交
//只有该字段填写正确才提交请求
	if (!form.isValid()) {
		return false;
	}
八、Extjs按钮点击次数判断（handler）
         if (this.clickCount) {
    	       //第几次
         	  this.clickCount++;
        } else {
            // 第一次点击
            this.clickCount = 1;
        }
九、清空过滤（过滤启用与清空）
  参考链接：https://stackoverflow.com/questions/22144008/filter-a-store-with-array-of-values-from-one-property-with-extjs
  1.自定义过滤函数(filterBy)
  store.filterBy(function(record, id) {
            var store = Ext.StoreManager.lookup('client.ClientWinStore');
            var hadSelect = store.getData().items;
            var sameId = [];
            for(var i=0; i<hadSelect.length;i++){
                var data = hadSelect[i].data;
                var app_id = data.app_id;
            sameId.push(app_id)
            }
            return sameId.indexOf(record.get('app_id')) == -1;
        });
  2.清除使用的过滤函数
     var store = this.getStore();
  	 store.remoteFilter = false;
   	 store.clearFilter();
     store.remoteFilter = true;
  	 store.filter(...);
十、项目中常用请求（ajax）
    1.
    var params ={
      userName :Ext.util.Cookies.get('user_token'),
      email:'3456@qq.com'
    }//封装好你需要传递的参数
    Ext.Ajax.request( {
      url : '/cloudadmin/dealerProcess',//需要请求的接口
      method : 'post', //请求的方法
      params :params ,   //请求的参数
      cors: true,   //是否支持跨越的参数
      useDefaultXhrHeader: false, //是否支持跨越的参数
      success : function(response, options) { //成功后执行
          var jsonData = Ext.util.JSON.decode(response.responseText);   //转为json格式
          console.log(jsonData)
      },
      failure : function() {//失败后执行
        Ext.MessageBox.show({
            title: '提示',
            message: '网络连接失败，请重新请求',
            buttons: Ext.MessageBox.INFO,
            icon: Ext.MessageBox.OK,
        }); //这是一个弹出框
      }
    });
    2.
    if (form.getForm().isValid()) {
      //验证通过后
        form.submit({
            waitTitle : '请稍后...',  //加载提示框标题
            waitMsg : '正在保存用户信息,请稍后...',  //加载时提示主内容
            url : '/cloudadmin/dealerProcess',  //需要请求的接口
            method : 'post', //请求的方法
            cors: true,   //是否支持跨越的参数
            useDefaultXhrHeader: false, //是否支持跨越的参数
            success : function(form, action) {  //  成功执行
                console.log(action.result.msg);
            },
            failure : function(form, action) {  //失败执行
                console.log(action.result.msg);
            }
        });
      }
十一、Store 中的proxy
    //接口返回的数据样板
      // {
      //     "count":1,
      //     "list":[
      //         {
      //               "app_id": 0
      //               "app_name": "app",
      //           }
      //       ]
      //   }
    proxy: {
      type: 'ajax',
      url: '/cloudadmin/dealerProcess', //调用的接口
      reader: {
        type: 'json', //返回的方式
        rootProperty: 'list', //数据的根目录
        totalProperty: 'count' //数据的数量
      },
      cors: true,   //是否支持跨越的参数
      useDefaultXhrHeader: false, //是否支持跨越的参数
      actionMethods: {
        create: 'POST',
        read: 'POST', // by default GET
        update: 'POST',
        destroy: 'POST'
      }, //修改store的方法
      listeners: {
        exception: function (store, response, operation, opts) {
          CloudApp.ajax_failure(response);
        }
      } //错误处理
    }
十二、store的remove与add
    1.获取store的方法  var store = Ext.StoreManager.lookup('store');
    remove() //只能删除record数据
    removeAll() //删除store里的所有数据
    add() //给store添加数据
    2.给远程store 插入数据（插入位置为第一个，combox）insert
    //在store下添加一个load函数
    listeners:{
          load : function( store, records, successful, operation){
            if(successful){
                var ins_rec ={
                    app_id : 'all',
                    app_name :'插入数据',
                };
                store.insert(0,ins_rec);
            }
        }
    }

    3.动态添加store参数（proxy）
    //例子如下
    store.setProxy({
       type: 'ajax',
       url:'/cloudadmin/orderProcess/list',
       reader:{
         type:'json',
         rootProperty:'list',
         totalProperty: 'count'
       },
       cors: true,
       useDefaultXhrHeader:false,
       actionMethods: {
         create : 'POST',
         read   : 'POST', // by default GET
         update : 'POST',
         destroy: 'POST'
       },
       extraParams:{
         "user_token":Ext.util.Cookies.get('user_token'),
         "start":0,
         "date_type":date_type,
         "startdate":startdate,
         "enddate":enddate,
         'language':'zh_CN',
         "time_zone":new Date().getTimezoneOffset()/60,
       }　
     });

十三、grid常用配置（小技巧）
  1.常用配置
    viewConfig: {
        stripeRows:true, //显示斑马线
        enableTextSelection:true //可以复制表格
    },//页面配置
    selModel: {
        type: 'checkboxmodel'
    },//模型为CheckBox grid
  2.监听表格常用方法
    listeners: {
        afterrender: 'onAfterRenderGrid', //表格渲染后执行
        selectionchange: 'onSelectionChangeRecord',
        itemclick: 'onItemClick'
   }
   //获取grid选择的操作数
   onSelectionChangeRecord: function (grid, records) {
		var viewModel = this.getViewModel();
		viewModel.set('selectRecords', records);
	},
  //点击按钮执行
  //相应按钮view写法
  {
        xtype: 'widgetcolumn',
        align: 'center',
        text: '操作',
        widget: {
            xtype: 'button',
            align: 'center',
            width: 65,
            height: 25,
            cls:'viewBtn',
            text: '查看'

        }
    }
  //点击按钮执行部分
  onItemClick:function(grid, records){
      //获取按钮方法
      var button = grid.focusEl.dom.getElementsByTagName('a')[0];
      if(button == null || button == undefined) return;
      var buttonArrt = grid.focusEl.dom.getElementsByTagName('a')[0].getAttribute('role');
      if(buttonArrt != 'button'){
        return;
      }
      var buttonType = button.getAttribute('class');
      if(buttonType.indexOf('viewBtn') < -1 ){
        return;
      }
      //获取成功后执行各种想执行的
    }
  3.grid 分页问题
  //自定义分页插件
  Ext.define('CloudApp.view.public.CusPagingToolbar', {
    extend : 'Ext.toolbar.Paging',
    alias : 'widget.cuspagingtoolbar',
    displayInfo : true,
    prependButtons : true,
    dock : 'bottom',
    initComponent : function() {
        var me = this;
        me.items = [ {
            xtype : 'combobox',
            fieldLabel : CloudApp.language.text('per_page_show'),
            width : 130,
            editable : false,
            labelWidth : 60,
            store : [ '20', '50', '100' ],
            listeners : {
                afterrender : function(combo, eOpts) {
                    combo.setValue(combo.ownerCt.getStore().getPageSize());
                },
                select : function(combo, records, eOpts) {
                    var ownerCt = combo.ownerCt, store = ownerCt.getStore();
                    store.pageSize = combo.getValue();
                    store.currentPage = 1;
                    ownerCt.doRefresh();
                }
            }
        } ];
        me.callParent();
        me.on('afterrender', function() {
            me.ownerCt.on('reconfigure', function() {
                me.bindStore(me.ownerCt.store || 'ext-empty-store', true);
            });
        });
    }
})
//在页面直接引入使用
dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            ui: 'footer',
            items:[
              {
                xtype: 'cuspagingtoolbar'
              }
            ]
        }
  //在store里加上以下函数便可以设置选择的页数
  listeners:{
   beforeload:function (store, options) {
              var params =options.config.scope.proxy.extraParams;
              Ext.apply(params, {start: options.config.start,count:options.config.limit, limit:options.config.limit});
              Ext.apply(store.proxy.extraParams, params);
      },
}
十四、图片上传

    /**
     * 从 file 域获取 本地图片 url
     */
    getFileUrl: function (dom) {
        var url;
        if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
            url = dom.value;
        } else { //非ie
            url = window.URL.createObjectURL(dom.files.item(0));
        }
        return url;
    },

    /**
     * 上传图片按钮
     *
     */

    onChangeFileField: function (e) {
        // 文件路径console.log(e.value)
        //在这里获取viewModel 存入图片url
        var storeGoodsId = e.id.replace('form_file_',"");
        var me = this;
        var viewModel = this.getViewModel();
        var fileUrl = this.getFileUrl(e.fileInputEl.dom);
        viewModel.set('goodsImage', fileUrl);
        viewModel.set('file', e.fileInputEl.dom.value) //files[0]
        //当前图片上传
        var file = e.fileInputEl.dom.files[0]
        //console.log(file)
        var user_token = Ext.util.Cookies.get('user_token');
        var oData = new FormData();
        oData.append('goods_img', file)
        oData.append('user_token', user_token);
        oData.append("resource_name", "goods_img")

        var XHR = new XMLHttpRequest();
        XHR.open( "POST", "/cloudadmin/goodsProcess/upload" , true );
        XHR.onreadystatechange  = function(oEvent) {
            if (XHR.readyState == 4 && XHR.status == 200) {
              var responseJSON = JSON.parse(XHR.responseText)
              //console.log(responseJSON);
              responseJSON['goods_id'] = storeGoodsId;
              console.log(responseJSON);

              //这里可以将新增的商品图片保存在goodswinstore
              var goodswinstore = Ext.data.StoreManager.lookup('goods.goodswinstore');
                var findRecord = goodswinstore.findRecord('goods_id', storeGoodsId)
              console.log(findRecord)
              if(findRecord == ''|| findRecord == null || findRecord == undefined){
                goodswinstore.add(responseJSON);
              }else{
                findRecord.set('goods_imgurl', responseJSON.goods_imgurl)
                findRecord.set('goods_object', responseJSON.goods_object)
              }
              console.log(goodswinstore);


            //  var goodsPics =goodswinstore.getData().items;
              //console.log(goodswinstore);
              var goods_img = document.querySelectorAll('.goods_img');
              console.log(goods_img[goods_img.length-1])
                goods_img[goods_img.length-1].setAttribute('src',responseJSON.goods_imgurl);

           } else if(XHR.readyState == 4 && XHR.status != 200){
                console.log('error:'+XHR.responseText)
           }
        };
        XHR.send(oData);

    },
