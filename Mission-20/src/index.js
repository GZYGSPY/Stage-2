/**
 * 文件名：Task-18
 * 作者： zjruan
 * data: 2016/3/21
 */
(function () {
    
    // 元素对象缓存
    var listEle = document.querySelector(".data-list");
    var btns = document.querySelector(".btns");
    var inputBox = document.querySelector('#inputBox');
    
    // 数字验证
    var numReg = /^\s*$/;
    
    var dataCache = {
        valueList:[],
        elementList:[]
    };
    
    /**
     * dom 帮助工具
     */
    var domUtil = {  
        // 添加第一个元素
        appendFirst: function (parent,value) {
            var valList = value.split(/[\s|,|，|、|　]+/);
            var liEle = document.createElement('li');
            var firstChild = listEle.firstChild;
            for(var i = 0, len = valList.length; i < len; i++){
                if(!velidate.inputIsNull(valList[i])){
                    var tempNode = liEle.cloneNode();
                    tempNode.innerText = valList[i];                
                    listEle.insertBefore(tempNode,firstChild);  
                    dataCache.valueList.push(valList[i]);    
                    dataCache.elementList.push(tempNode);
                }
            }
        },
        // 添加最后一个元素
        appendLast: function (parent,value) {
            var valList = value.split(/[\s|,|，|、|　]+/);
            var liEle = document.createElement('li');            
            for(var i = 0, len = valList.length; i < len; i++){
                if(!velidate.inputIsNull(valList[i])){
                    var tempNode = liEle.cloneNode();
                    tempNode.innerText = valList[i];                
                    listEle.insertBefore(tempNode,null); 
                    dataCache.valueList.push(valList[i]);    
                    dataCache.elementList.push(tempNode);  
                }                      
            }
            
        },      
        // 移除子节点
        removeChild: function (parent,childNode) {
            for(var i = 0, len = dataCache.elementList.length; i< len; i++ ){
                if(childNode === dataCache.elementList[i]){
                   delete dataCache.elementList.splice(i,1)[0];
                   dataCache.valueList.splice(i,1);
                }
            }
            dataCache.elementList
            
            parent.removeChild(childNode);
        },
        // 创建li元素
        createLiElement: function (innerText) {
            var ele = document.createElement('li');
            ele.innerText = innerText;
            return ele;
        },        
        // 获取元素在父级元素的索引
        getElenentIndex: function (element) {
            
        }
    }
    
    // 操作验证
    var velidate = {
        inputIsNull: function (value) {
            return numReg.test(value);
        },
        hasChild: function (parentNode) {
            return parentNode.children.length > 0;
        }
        
    }
    
    /**
     * btn 元素点击事件处理函数
     * @param [event] evt 点击事件 
     * 为btns 标签绑定事件，实现对内部的按钮的事件委托机制
     * 当点击事件发生后，判断点击的target，来选择相应的逻辑
     * 
     * 委托的简单猜想: （伪代码）
     * 
     * function delegate(parentSeletor, selector, eventType, callback){
     *  parentSeletor.addEventListener(eventType,function(evt){
     *      var target = evt.target || window.target;
     *      if( target.classList.contains(selector.substr(1))){
     *          var childevt = document.createEvent('MouseEvents')
     *          childevt.initEvent();
     *          callback(childevt);
     *      }
     *  }) 
     * }
     */
    function btnClickHanlder(evt) {
        var target = evt.target || window.target;
        
        // 如果点击的是按钮
        if(Object.prototype.toString.call(target) === '[object HTMLAnchorElement]') {
            var className = target.className.replace(/btn|\s/g,"");
            console.log(className);
            var velidate_result, msg, handler, child;
            switch(className){
                // 按钮：左侧进 
                case 'leftIn':
                    child = inputBox.value;                 
                    velidate_result = !velidate.inputIsNull(child); // 操作验证，判断操作是否成功
                    msg = "输入为空";
                    handler = domUtil.appendFirst; // 获取处理函数
                    break;
                    
                // 按钮：右侧进     
                case 'rightIn':
                    child = inputBox.value;                 
                    velidate_result = !velidate.inputIsNull(child);
                    msg = "输入为空";
                    handler = domUtil.appendLast; // 获取处理函数
                    break;
                    
                // 按钮：左侧出     
                case 'leftOut': 
                    velidate_result = velidate.hasChild(listEle);
                    msg = "没有可弹出元素了";
                    child = velidate_result ? listEle.children[0] : "";  // 获取第一个子元素
                    handler = domUtil.removeChild; // 获取处理函数
                    break;
                    
                // 按钮：右侧出   
                case 'rightOut':
                    velidate_result = velidate.hasChild(listEle);
                    msg = "没有可弹出元素了";
                    child = velidate_result ? listEle.children[listEle.children.length-1] : ""; // 获取最后一个子元素
                    handler = domUtil.removeChild; // 获取处理函数
                    break;
                    
                default: console.log('你点了个空气');  break;
            }
            
            if(velidate_result) {
                handler(listEle, child);
            }else{
                alert(msg);
            }
        }
    }
    
    /**
     * li 元素点击事件处理函数
     * @param [event] evt 点击事件 
     */
    function liClickHandler(evt) {
        var target = evt.target || window.target;
        
        // 点击事件过滤： 如果点击的是数字元素
        if(Object.prototype.toString.call(target) === '[object HTMLLIElement]') {
            domUtil.removeChild(listEle,target);
        }
    }
    
    /**
     * 更新UI: 显示高亮文字
     */
    function updateUI(searchText) {
        for(var i = 0, len = dataCache.valueList.length; i < len; i++){
            var value = dataCache.valueList[i];            
            if(value.indexOf(searchText) >= 0 ){
                var targetHtml = value.replace(searchText,"<strong>"+searchText+"</strong>");
                dataCache.elementList[i].innerHTML = targetHtml;                
            }
        }
    }
    
    /**
     * 清除高亮文字
     */
    function clearUI() {
        for(var i = 0, len = dataCache.valueList.length; i < len; i++){
            dataCache.elementList[i].innerText = dataCache.valueList[i];
        }
    }
    
    /**
     * 事件绑定
     */
    //按钮事件绑定
    btns.addEventListener('click', btnClickHanlder);  
    
    // li元素点击事件绑定  
    listEle.addEventListener('click', liClickHandler);
    
    // 搜索框获取焦点
    document.querySelector('#searchBox').addEventListener('focus',function (evt) {
        // 清除标记
        console.log('获取焦点');
        clearUI();
    })
    
    // 搜索框失去焦点
    document.querySelector('#searchBox').addEventListener('blur',function (evt) {
        var searchText = this.value;
        updateUI(searchText);
    })
})()