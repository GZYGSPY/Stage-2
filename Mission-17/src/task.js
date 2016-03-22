(function () {
    /* 数据格式演示
     var aqiSourceData = {
     "北京": {
     "2016-01-01": 10,
     "2016-01-02": 10,
     "2016-01-03": 10,
     "2016-01-04": 10
     }
     };
     */

// 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }

    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };

// 用于渲染图表的数据
    var chartData = {
        opt: {city: "", time: ""},
        data: {}
    };

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        console.log(chartData);
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        // 确定是否选项发生了变化
        if (chartData.opt.time == this.value) return;
        chartData.opt.time = this.value;

        // 设置对应数据
        initAqiChartData();

        // 调用图表渲染函数
        renderChart();
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化
        if (chartData.opt.city == this.value) return;
        chartData.opt.city = this.value;
        // 设置对应数据
        initAqiChartData()

        // 调用图表渲染函数
        renderChart();
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var radios = document.querySelectorAll("[name=\"gra-time\"]");
        for (var i = 0, len = radios.length; i < len; i++) {
            var checkedRadio = radios[i];
            checkedRadio.addEventListener("click", graTimeChange);
            if (checkedRadio.checked) {
                chartData.opt.time = checkedRadio.value;
            }
        }
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        var citySelect = document.querySelector("#city-select");
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        for (var i in aqiSourceData) {
            var option = document.createElement("option");
            option.innerText = i;
            citySelect.options.add(option);
        }
        chartData.opt.city = citySelect.value;
        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        citySelect.addEventListener("click", citySelectChange);

    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        chartData.data = {}
        var aqiCity = aqiSourceData[chartData.opt.city];
        if (chartData.opt.time == "day") {
            chartData.data = aqiCity;
        } else {
            chartData.data = getAverages(aqiCity, chartData.opt.time);
        }
    }

    function getAverages(aqiCity, mode) {
        var result = {}, first = null, last = null, vernier, count = 0, sum = 0;
        for (var i in aqiCity) {
            vernier = new Date(i);
            if (first == null) {
                first = vernier;
            }
            if (mode == "month" ? first.getMonth() != vernier.getMonth() : vernier - first > 518400000) {
                result[getDateStr(first) + "-" + getDateStr(last)] = sum / count;
                sum = 0;
                count = 0;
                first = vernier;
            }
            sum += aqiCity[i];
            count++;
            last = vernier;
        }

        if (count != 0) {
            result[getDateStr(first) + "-" + getDateStr(last)] = sum / count;
        }
        return result;
    }


    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
    }

    init();
})();