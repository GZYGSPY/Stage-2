/**
 * 文件名：Task-18
 * 作者： zjruan
 * data: 2016/3/21
 * description: 模仿React的方式，由于react也不是很熟，所以也只是写了个皮毛
 * 感受： 刚开始的时候写的很开心，越写到后面越不开心，
 *        一开始只为 tag 设计，写完了后感觉后不错，然后发现下面还有黄色的tag，
 *        还有textarea，于是开始改代码，感觉越改越乱，大脑一团糟
 *        但没办法，改吧，改着改着思路慢慢的清晰了很多。
 *        对扩展开发，对修改关闭，这一坨代码，明显没有很好的做到这一点，比如 render 方法
 */
(function () {
    /**
     * 标签 对象
     * @param {parent} jax 父节点
     * @param {id} string 标签id
     * @param {value} string 标签值
     * @param {ele} HtmlElement dom元素
     * @return null
     */
    function Tag(parent, id, className, value, ele) {
        this.parent = parent;
        this.id = id;
        this.className = className;
        this.value = value;
        this.element = ele;
        this.htmlTemplate = '<li id="$id" class="tag"><span>$value</span></li>';
        this.events = [
            {
                 eventName:'click',
                 
                 // 闭包的方式 保存Tag对象
                 handler:function (that) {
                     return function (evt) {
                        console.log('不要删除我！：' + that.id);
                        that.parent.removeTag(that.id);
                    }                     
                 }(this)                 
            }
        ]
    }
    Tag.tagType = {
        delTag: "deleteableTag",
        defTag: "defaultTag"
    };
    
    // 渲染输入框组建
    // 创建组建对象，并生成对应dom 以及绑定事件
    Tag.prototype.render = function () {
        var ele = document.createElement('li');
        ele.id = this.id;
        ele.className = this.className;
        ele.innerHTML = '<span>'+ this.value +'</span>';        
        this.element = ele;
    };
    
    /**
     * Tag对象 的工厂方法
     * 用于创建不同类型的tag
     * @param {parentNode} Component 父级对象
     * @param {tagType} string tag类型
     * @param {value} string tag值
     */
    Tag.tagFactory = function (parentNode, value, tagType) {
        var tagId = "tag_"+(1000000000000 + parseInt(Math.random((new Date()).getTime())*1000000000000));    ;
        var tag = new Tag(parentNode, tagId, 'tag', value);
        tag.render();
        switch(tagType){            
            // 可删除标签
            case Tag.tagType.delTag:                
                for(var i = 0, len = tag.events.length; i < len; i++){
                    tag.element.addEventListener(tag.events[i].eventName,tag.events[i].handler);
                }
                tag.className = "tag deleteable";
                tag.element.className =  "tag deleteable";
                break;
                
            // 默认类型标签
            case Tag.tagType.defTag:
            default:
                
                break;                
        }
        
        return tag;
    }
    
    /**
     * 标签列表 对象
     * @param {parent} jax 父节点
     * @param {id} string 标签id
     * @param {ele} HtmlElement dom元素
     * @return null
     */
    function TagList(parent, id, ele) {
        this.id = id;
        this.parent = parent;
        this.childrenIds = [];
        this.childrenValue = [];
        this.tagChildren =  [];
        this.element = ele;
    }
    
    // 渲染输入框组建
    // 创建组建对象，并生成对应dom 以及绑定事件
    TagList.prototype.render = function () {
        var ele = document.createElement('ul');
        this.element = ele;
    };
    TagList.prototype.validate = function (value) {
        if(value == "") return false ;
        
        if(this.childrenValue.indexOf(value) >= 0) {
            console.log("重复值：" + value);
            return false ;
        }
        if(this.childrenValue.length >= 10){
            this.removeTag(this.tagChildren[0].id);
        }
        return true;
    }
    
    
    /**
     * 添加批量添加 默认类型 Tag 子组建
     * @param {valueList} Array 值列表
     * @param {tagType} string 标签类型
     */
    TagList.prototype.addTagList = function (valueList,tagType) {
        for(var i = 0, len = valueList.length; i < len; i++){
            if(this.validate(valueList[i])){
                var tag = Tag.tagFactory(this ,valueList[i], tagType);                
                this.addTag(tag);                
            }
        }
    }
    // 添加Tag组建
    // 渲染组建，并生产对于dom
    // 将tag对象保存在tagChildren字段中，方便查找操作
    // childrenIds 用于优化索引
    TagList.prototype.addTag = function (tag) {
        this.childrenIds.push(tag.id);
        this.childrenValue.push(tag.value);
        this.tagChildren.push(tag);
        this.element.appendChild(tag.element);        
    }
    // 利用id 获取元素位置，
    // 在移除对应对象，在移除对应dom
    TagList.prototype.removeTag = function (id) {
        var index = this.childrenIds.indexOf(id);
        var targetTag = this.tagChildren[index];
        this.childrenIds.splice(index,1);
        this.childrenValue.splice(index,1);
        this.tagChildren.splice(index,1);
        delete this.element.removeChild(targetTag.element);
        delete targetTag;
    }
    
    
    /**
     * 输入框 对象
     * @param {parent} jax 父节点
     * @param {id} string 标签id
     * @param {ele} HtmlElement dom元素
     * @return null
     */
    function InputBox( parent, targetType, id, ele ) {
        this.targetType = targetType;
        this.parent = parent;
        this.ele =ele;
        this.events = [
             {
                 eventName:'keyup',
                 handler:function (that){
                     return function (evt) {
                        if([13, 32, 188].indexOf(evt.keyCode) >= 0 ){
                            console.debug("文本框中的值：" + evt.target.value);
                            var valTrimStr = evt.target.value.trim();
                            if(valTrimStr === '') return;  //空格
                            var valueList = valTrimStr.split(/[\s|,|，]+/g);
                            that.parent.children.tagList.addTagList(valueList,that.targetType);
                            evt.target.value = "";
                        }
                        console.log('输入：' + evt.keyCode);
                    }
                }(this)
             }
         ]
    }
    
    // 渲染输入框组建
    // 创建组建对象，并生成对应dom 以及绑定事件
    InputBox.prototype.render = function () {
        var ele = document.createElement('div');
        ele.innerHTML = '<label><span>Tag: </span></label>';
        var inputEle = document.createElement('input');
        inputEle.type = 'text';
        inputEle.placeholder = '输入tag标签'
        for(var i = 0, len = this.events.length; i < len; i++){
            inputEle.addEventListener(this.events[i].eventName,this.events[i].handler);
        }
        ele.children[0].appendChild(inputEle);        
        this.element = ele;
    };
    
        /**
     * 输入框 对象
     * @param {parent} jax 父节点
     * @param {id} string 标签id
     * @param {ele} HtmlElement dom元素
     * @return null
     */
    function TextareaBox( parent, targetType, id, ele ) {
        this.targetType = targetType;
        this.parent = parent;
        this.element =ele;
        this.events = [
             {
                 eventName:'click',
                 handler:function (that){
                     return function (evt) {
                         var val = that.element.children[0].children[0].value.trim();
                         if(val === '') return; 
                         var valueList = val.split(/[\s|,|，]+/g);
                         that.parent.children.tagList.addTagList(valueList,that.targetType);
                         evt.target.value = "";
                        console.log('输入：' + val);
                    }
                }(this)
             }
         ]
    }
    
    // 渲染输入框组建
    // 创建组建对象，并生成对应dom 以及绑定事件
    TextareaBox.prototype.render = function () {
        var ele = document.createElement('div');
        ele.innerHTML = '<div><textarea></textarea></div>';
        var addBtn = document.createElement('button');
        addBtn.innerText = '确认兴趣爱好'
        for(var i = 0, len = this.events.length; i < len; i++){
            addBtn.addEventListener(this.events[i].eventName,this.events[i].handler);
        }
        ele.appendChild(addBtn);        
        this.element = ele;
    };
    
    
    
    /**
     * 标签组件 对象
     * @param {ele} HtmlElement 标签id
     * @param {children} jaxList 子组建列表
     * @return null
     */
    function TagComponent(ele,children) {
        this.element = ele;
        this.children = children || {};
        this.htmlTemplate = '<div class="TagComponent"></div>';
    }
    
    // 组建渲染函数
    // 用于渲染组件
    // 创建组件，创建子组件 inputBox 和 tagList 
    // 并生成对应组建的DOM 元素
    TagComponent.prototype.render = function (selector) {
        var ele = document.createElement('div');
        ele.className = 'TagComponent';
        
        var inputBox = new InputBox(this, Tag.tagType.delTag);
        var tagList = new TagList(this);
        inputBox.render();
        tagList.render();
        ele.appendChild(inputBox.element);
        ele.appendChild(tagList.element);
        this.children.inputBox = inputBox;
        this.children.tagList = tagList;
        this.element = ele;
        document.getElementById(selector).appendChild(ele);
    }
    
        /**
     * 标签组件 对象
     * @param {ele} HtmlElement 标签id
     * @param {children} jaxList 子组建列表
     * @return null
     */
    function TextareaComponent(ele,children) {
        this.element = ele;
        this.children = children || {};
        this.htmlTemplate = '<div class="TagComponent"></div>';
    }
    
    // 组建渲染函数
    // 用于渲染组件
    // 创建组件，创建子组件 TextareaBox 和 tagList 
    // 并生成对应组建的DOM 元素
    TextareaComponent.prototype.render = function (selector) {
        var ele = document.createElement('div');
        ele.className = 'TagComponent';
        
        var textareaBox = new TextareaBox(this, Tag.tagType.defTag);
        var tagList = new TagList(this);
        textareaBox.render();
        tagList.render();
        ele.appendChild(textareaBox.element);
        ele.appendChild(tagList.element);
        this.children.textareaBox = textareaBox;
        this.children.tagList = tagList;
        this.element = ele;
        document.getElementById(selector).appendChild(ele);
    }
    
    // 实例化一个标签组建
    var tagComponent = new TagComponent();
    // 渲染组件
    tagComponent.render('tag-component');
    
    // 实例化一个标签组建
    var textareaComponent = new TextareaComponent();
    // 渲染组件
    textareaComponent.render('textarea-component');
    
})()

