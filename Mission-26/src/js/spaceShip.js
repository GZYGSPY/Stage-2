/**
 * 飞船类
 */

function spaceship(id, space) {
    var INIT = 0, TAKEOFF = 1, LANDING = 2, START = 3, STOP = 4;
    var status = INIT;
    var frames = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
    };

    //取得图像
    this.getFrame = function (time) {
        return frames[status][time / frames[status].length - 1];
    }

    //动力系统，可以完成飞行和停止飞行两个行为，暂定所有飞船的动力系统飞行速度是一致的，比如每秒20px，飞行过程中会按照一定速率消耗能源（比如每秒减5%）
    this.engine = {
        start: function () {

        },
        stop: function () {

        }
    }
    //能源系统，提供能源，并且在宇宙中通过太阳能充电（比如每秒增加2%，具体速率自定）
    this.battery = {
        collectEnergy: function cool(power) {
            getFrea
        },
        surplus: 100,
    }
    //信号接收处理系统，用于接收行星上的信号
    this.radio = {
        list: [],
        start: function () {

        }
    }
    //自爆系统，用于自我销毁
    this.blew = {
        start: function () {

        }
    }
}