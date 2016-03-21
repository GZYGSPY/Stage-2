(function () {
    /**
     * aqiData，存储用户输入的空气指数数据
     * 示例格式：
     * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
     */
    var aqiData = {};
    var aqiCityInput = document.querySelector("#aqi-city-input");
    var aqiValueInput = document.querySelector("#aqi-value-input");
    var aqiTable = document.querySelector("#aqi-table");
    var tableHeader = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";

    var regCNEN = /^[\u4e00-\u9fa5a-zA-Z]+$/;
    var regNUM = /^[0-9]+$/;

    /**
     * 从用户输入中获取数据，向aqiData中增加一条数据
     * 然后渲染aqi-list列表，增加新增的数据
     */
    function addAqiData() {
        var city = aqiCityInput.value.trim();
        var value = aqiValueInput.value.trim();
        if (validate(city, value)) {
            aqiData[city] = value;
        }
    }

    function validate(city, value) {
        if (!regCNEN.test(city)) {
            alert("你输入的信息有误，城市名必须为中英文字符");
            return false;
        }
        if (!regNUM.test(value)) {
            alert("你输入的信息有误，空气质量指数必须为整数");
            return false;
        }
        return true;
    }

    /**
     * 渲染aqi-table表格
     */
    function renderAqiList() {
        var result = "";
        //第一步，表头
        result += tableHeader;
        //第二步，表项
        for (var city in aqiData) {
            var value = aqiData[city];
            result += makeTr(city, value);
        }
        aqiTable.innerHTML = result;
    }

    /**
     * 构造一个需要的<tr>标签
     * @param city 城市
     * @param value 值
     * @returns {string} HTML代码
     */
    function makeTr(city, value) {
        var elment = "<tr><td>" + city + "</td><td>" + value + "</td><td><button class=\"del-btn\" city=\"" + city + "\">删除</button></td></tr>"
        return elment;
    }

    /**
     * 点击add-btn时的处理逻辑
     * 获取用户输入，更新数据，并进行页面呈现的更新
     */
    function addBtnHandle() {
        addAqiData();
        renderAqiList();
    }

    /**
     * 点击各个删除按钮的时候的处理逻辑
     * 获取哪个城市数据被删，删除数据，更新表格显示
     */
    function delBtnHandle() {
        // do sth.
        for (var i in this.attributes) {
            var attr = this.attributes[i];
            if (attr.name == "city") {
                delete aqiData[attr.value];
            }
        }

        renderAqiList();
    }

    function onEvent(event, father, target, handler) {
        document.querySelector(father).addEventListener(event, function (e) {
            var elements = this.querySelectorAll(target);
            var isSelected = false;
            for (var i in elements) {
                if (elements[i] == e.target) {
                    isSelected = true;
                }
            }
            if (!isSelected) {
                return;
            }
            handler.bind(e.target)();
        });
    }

    function init() {

        // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
        document.querySelector("#add-btn").onclick = addBtnHandle;
        // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
        onEvent("click", "#aqi-table", ".del-btn", delBtnHandle);
    }

    init();
})();