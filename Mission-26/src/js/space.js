/**
 * 宇宙类
 * 每秒辐射 5能量
 * 无线电传输丢包率 30%
 */

function Space() {
    //时钟
    var time = 0;

    //反推
    var pushBack = function () {

    }

    //宇宙中的物体
    this.item = {}

    //宇宙中的无线电接收器
    this.radios = [];

    //收到能量
    this.receiveEnergy = function (power) {
        console.log(power);
    }

    //辐射能量
    this.radiantEnergy = function () {

    }
}

Space.prototype.addRadio = function (radio) {
    this.radios[radio.id] = radio;
}

Space.prototype.removeRadio = function (radio) {
    delete this.radios[radio.id];
}