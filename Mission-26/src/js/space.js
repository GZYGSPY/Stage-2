/**
 * 时钟类
 */

function Timer(interval) {
    this.interval = interval;
    this.listener = [];
    this.lastDate = new Date();
    setInterval(this.tita.bind(this), interval);
}

Timer.prototype.tita = function () {
    //所有注册时钟
    var now = new Date();
    for (var i = 0, len = this.listener.length; i < len; i++) {
        this.listener[i](now - this.lastDate);
    }
    this.lastDate = now;
}

Timer.prototype.addListener = function (listener) {
    var exist = false;
    for (var i = 0, len = this.listener.length; i < len; i++) {
        if (this.listener[i] == listener) {
            exist = true;
        }
    }
    if (!exist) {
        this.listener.push(listener);
    }
}

Timer.prototype.removeListener = function (listener) {
    for (var i = 0, len = this.listener.length; i < len; i++) {
        if (this.listener == listener) {
            this.listener.splice(i, 1);
        }
    }
}

Timer.prototype.timeout = function (callback, time) {
    setTimeout(callback, time)
}

/**
 * 宇宙类
 * 每秒辐射 5能量
 * 无线电传输丢包率 30%
 * 无线电传输时间 1000
 */

function Space() {
    //丢包率
    this.packetLossRate = 0.3;

    //每秒辐射能量
    this.radiationEnergyPerSecond = 5;

    //无线电传输时间
    this.radioTransmissionTime = 1000;

    //反推
    var pushBack = function () {

    }

    //宇宙中的物体
    this.item = {}

    //宇宙中的无线电接收器
    this.radios = {};

    //宇宙中的能源接收器（太阳能电板）
    this.energyReceiver = {};


    //时钟
    this.timer = new Timer(1000 / 60);

    this.timer.addListener(function (speed) {
        this.radiantEnergy(this.radiationEnergyPerSecond * speed / 1000);
    }.bind(this))
}

Space.prototype.addRadio = function (radio) {
    this.radios[radio.id] = radio;
}

Space.prototype.removeRadio = function (radio) {
    delete this.radios[radio.id];
}

Space.prototype.broadcastMessage = function (packet) {
    for (var i in this.radios) {
        if (Math.random() > this.packetLossRate) {
            this.timer.timeout(function () {
                this.radios[i].receiveMessage(packet)
            }.bind(this), this.radioTransmissionTime);
        } else {
            console.log("消息已丢包");
        }
    }
}

Space.prototype.addEnergyReceiver = function (receiver) {
    this.energyReceiver[receiver.id] = receiver;
}

Space.prototype.removeEnergyReceiver = function (receiver) {
    delete this.energyReceiver[receiver.id];
}

//收到能量
Space.prototype.receiveEnergy = function (power) {
    //此处需要反推
    console.log(power);
};

//辐射能量
Space.prototype.radiantEnergy = function (power) {
    for (var i in this.energyReceiver) {
        this.energyReceiver[i].collect(power);
    }
};