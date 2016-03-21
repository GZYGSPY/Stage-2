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
    var numReg = /^[0-9]+$/;
    
    /**
     * dom 帮助工具
     */
    var domUtil = {  
        // 添加第一个元素
        appendFirst: function (parent,childNode) {
            listEle.insertBefore(childNode, listEle.firstChild);
        },
        // 添加最后一个元素
        appendLast: function (parent,childNode) {
            listEle.insertBefore(childNode,null);
        },      
        // 移除子节点
        removeChild: function (parent,childNode) {
            parent.removeChild(childNode);            
        },
        // 创建li元素
        createLiElement: function (innerText) {
            var ele = document.createElement('li');
            ele.innerText = innerText;
            return ele;
        }
    }
    
    // 操作验证
    var velidate = {
        inputNotNull: function () {
            return numReg.test(inputBox.value);
        },
        hasChild: function (parentNode) {
            return parentNode.children.length > 0;
        }
        
    }
    
    /**
     * btn 元素点击事件处理函数
     * @param [event] evt 点击事件 
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
                    velidate_result = velidate.inputNotNull(); // 操作验证，判断操作是否成功
                    msg = "输入数字无效";
                    child = velidate_result ? domUtil.createLiElement(inputBox.value) : ""; // 创建子节点
                    handler = domUtil.appendFirst; // 获取处理函数
                    break;
                    
                // 按钮：右侧进     
                case 'rightIn':
                    velidate_result = velidate.inputNotNull();
                    msg = "输入数字无效";
                    child = velidate_result ? domUtil.createLiElement(inputBox.value) : ""; // 创建子节点
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
     * 事件绑定
     */
    //按钮事件绑定
    btns.addEventListener('click', btnClickHanlder);  
    
    // li元素点击事件绑定  
    listEle.addEventListener('click', liClickHandler);
    
    
})()