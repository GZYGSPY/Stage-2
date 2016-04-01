/**
 * 文件名：任务29，表单验证
 * 作者： zjruan
 * 日期： 2016/3/21
 */
(function(){
    console.debug('表单验证');
    
    // dom元素
    var nameEle = document.getElementById('myName');
    var validator = document.getElementById('validator');
    var veBoxEle = document.getElementById('ve-box');
    var msgEle = document.getElementById('msg');
    
    // 正则
    var trimReg = /^\s+|\s+$/g;  // 去除首尾空格
    var chineseReg = /[\u4E00-\uFA29]|[\uE7C7-\uE7F3]/g;
    var lenReg = /^.{4,16}$/;    // 长度验证
    
    // 定义提示信息
    var msgs={
        error_length: {
            "msg":"长度为4~16个字符",
            "className":"error"
        },
        error_required: {
            "msg":"姓名不能为空",
            "className":"error"
        },
        right: {
            "msg":"名称格式正确",
            "className":"right"
        }
    }
        
    /**
     * UI 显示信息更新接口
     */
    function UIInterface(ele,paramObj) {
        // 修改类名
        ele.className = paramObj.className;
        
        // 修改提示信息
        msgEle.innerText = paramObj.msg;
    }
    
    /**
     * 表单验证
     */
    function validate(event) {
        // 获取原信息
        var sourceVal = nameEle.value;
        // 首尾去空字符, 替换中文为英文字符好计算长度
        var testStr = sourceVal.replace(trimReg,'').replace(chineseReg, '--');
        
        var paramObj ;
        if(testStr.length === 0 ){
            // 不能为空 “姓名不能为空”
            paramObj = msgs.error_required;
        }else if( !lenReg.test(testStr)){
            // 字符长度不对 “长度为4~16个字符”
            paramObj = msgs.error_length;
        }else{
            // 格式正确
            paramObj = msgs.right;
        }
        
        // 更新页面Ui
        UIInterface(veBoxEle, paramObj);        
    }
    
    validator.addEventListener('click',validate);    
})()
