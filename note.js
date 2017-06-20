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
