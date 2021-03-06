/**
 * 跟着勇哥刷py 太空飞船中型能源电池
 * 性能详情：最大输出功率  5
 *              最大输入功率  4
 *              最大容量       200
 *              太阳能电板    1
 * @param spaceshipInterface 飞船上的动力系统接口
 * @constructor
 */
function Energy(spaceshipInterface) {
    this.spaceshipInterface = spaceshipInterface;
    //能源剩余量
    this.surplus = 100;
    this.id = Math.random() + "";
}

/**
 * 名称
 * @type {string}
 */
Energy.prototype.name = "跟着勇哥刷py 太空飞船中型能源电池"

/**
 * 最大输入功率
 * @type {number}
 */
Energy.prototype.maxIn = 4;

/**
 * 最大输出功率
 * @type {number}
 */
Energy.prototype.maxOut = 5;

/**
 * 最大容量
 * @type {number}
 */
Energy.prototype.maxSurplus = 200;

/**
 * 开机
 */
Energy.prototype.on = function () {
    //自检
    if (!this.spaceshipInterface) {
        console.error("接口故障，请检查动力系统插槽是否松动！！");
        return;
    }

    //注册进飞船接口
    if (this.spaceshipInterface.energy) this.spaceshipInterface.energy[this.id] = this;

    //将太阳能电板注册到太空
    if (this.spaceshipInterface.space) this.spaceshipInterface.space.addEnergyReceiver(this);

    console.info("剩余" + this.surplus + "点能量");
};

/**
 * 关机
 */
Energy.prototype.off = function () {
    if (this.spaceshipInterface) {
        if (this.spaceshipInterface.energy) {
            delete this.spaceshipInterface.energy[this.id];
        }
    }
}

Energy.prototype.collect = function (power) {
    //如果收集的能量超过能源系统最大容量，则丢弃多余能量
    power = this.maxSurplus - this.surplus > power ? power : this.maxSurplus - this.surplus;
    //功率控制
    this.surplus += power > 0 ? (power <= this.maxIn ? power : this.maxIn) : 0;
    return power;
};

Energy.prototype.consume = function (power) {
    //如果剩余容量不足，则只能提供较少能量
    power = power <= this.surplus ? power : this.surplus;
    //功率控制
    this.surplus -= power > 0 ? (power <= this.maxOut ? power : this.maxOut) : 0;
    return power;
};

/**
 * 动力系统 跟着勇哥刷py 太空飞船引擎-1型
 * 性能详情：最大功率 10
 * @param spaceshipInterface 飞船上的动力系统接口
 * @constructor
 */
function Engine(spaceshipInterface) {
    //飞船上的动力系统接口（插槽）
    this.spaceshipInterface = spaceshipInterface;
    //功率
    this.power = 5;
    this.id = Math.random() + "";
}

Engine.prototype.name = "跟着勇哥刷py 太空飞船引擎-1型";

/**
 * 最大功率
 * @type {number}
 */
Engine.prototype.maxOut = 10;

/**
 * 开机
 */
Engine.prototype.on = function () {
    //自检
    if (!this.spaceshipInterface) {
        console.error("接口故障，请检查动力系统插槽是否松动！！");
        return;
    }

    //注册进飞船接口
    this.spaceshipInterface.engine[this.id] = this;
    //检查有没有能源系统
    if (!this.spaceshipInterface.energy) {
        console.error("找不到可用能源系统");
    }

    //检查有没有放到可飞行的环境中
    if (this.spaceshipInterface.space) {
        this.space = this.spaceshipInterface.space;
    } else {
        console.error("找不到可飞行的环境");
    }
};

/**
 * 关机
 */
Engine.prototype.off = function () {
    if (this.spaceshipInterface) {
        if (this.spaceshipInterface.engine) {
            delete this.spaceshipInterface.engine[this.id];
        }
    }
}

/**
 * 设置功率
 * @param power
 */
Engine.prototype.setPower = function (power) {
    this.power = power;
};

/**
 * 开始输出动力
 */
Engine.prototype.start = function () {
    this.spaceshipInterface.status = Status.START;
    //开始引擎线程
    var power = this.spaceshipInterface.energy.consume(this.power);
    this.space.receiveEnergy(power);
};

/**
 * 停止输出动力
 */
Engine.prototype.stop = function () {
    this.spaceshipInterface.status = Status.STOP;
    //停止引擎线程
};

/**
 * 无线电类
 * @param spaceshipInterface
 * @constructor
 */
function Radio(spaceshipInterface) {
    //飞船上的无线电系统（插槽）
    this.spaceshipInterface = spaceshipInterface;
    this.list = [];
    this.id = Math.random() + "";
}

/**
 * 开机
 */
Radio.prototype.on = function () {
    //开机
    console.log("开始接受无线电");

    //自检
    if (!this.spaceshipInterface) {
        console.error("接口故障，请检查动力系统插槽是否松动！！");
        return;
    }

    //注册进飞船接口
    this.spaceshipInterface.radio[this.id] = this;

    //系统接口中的消息接收器
    if (!this.spaceshipInterface.messageListener) {
        console.error("消息接收器错误，未检测到消息接收器，消息将暂存");
    }

    //注册到太空
    if (this.spaceshipInterface.space) {
        this.space = this.spaceshipInterface.space;
        this.space.addRadio(this);
    } else {
        console.error("消息接收器无法探测到太空")
    }
};

/**
 * 关机
 */
Radio.prototype.off = function () {
    //注销飞船接口
    if (this.spaceshipInterface) {
        if (this.spaceshipInterface.radio) delete this.spaceshipInterface.radio[this.id];
        if (this.space) this.space.removeRadio(this);
    }

};

Radio.prototype.getMessageListener = function () {
    if (!this.spaceshipInterface.messageListener) {
        console.error("消息接收器错误，消息将暂存");
        return {
            notify: function (message) {
                this.list.push(message);
            }
        };
    }

    if (this.list.length > 0) {
        for (var i in this.list) {
            this.spaceshipInterface.messageListener.notify(this.list[i]);
        }
    }

    return this.spaceshipInterface.messageListener;
};

Radio.prototype.receiveMessage = function (message) {
    if (message.id == this.spaceshipInterface.id) {
        this.getMessageListener().notify(message);
    }
};

/**
 * 飞船---型号：跟着勇哥刷py-原型机
 * 配置详情：能源系统插槽个数：1
 *              动力系统插槽个数：1
 *              信号接收器插槽个数：1
 *              电子控制系统：1
 *              自爆系统：1
 * @param id
 * @param space
 * @constructor
 */
function Spaceship(id, space) {

    this.status = Status.INIT;

    //飞船总系统开机
    this.id = id;
    this.space = space;

    //取得图像
    this.getFrame = function (time) {
        return frames[status][time / frames[status].length - 1];
    };

    //自爆系统，用于自我销毁
    this.blew = {
        start: function () {

        }
    };

    /**
     * 初始化此飞船的内部接口
     * @param that: Spaceship
     * @returns {{id: number, space: Space, name: string, messageListener: {notify: messageListener.notify}}}
     * @constructor
     */
    this.initSpaceshipInterface = function () {
        var that = this;
        this.spaceshipInterface = {
            id: that.id,
            space: that.space,
            name: that.name,
            energy: {},
            engine: {},
            radio: {},
            get status() {
                return status
            },
            set status(n) {
                this.status = n
            },
            messageListener: {
                notify: function (message) {
                    console.debug("飞船消息接收器已经接收到消息", message);
                }
            }
        }
    };
}

Spaceship.prototype.frames = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: []
};

/**
 * 飞船内部系统接口
 * @type {{}}
 */
Spaceship.prototype.spaceshipInterface = {};

/**
 * 飞船总电源开机系统
 */
Spaceship.prototype.on = function () {
    if (this.status == Status.INIT) {
        this.status = Status.TAKEOFF;
        //初始化接口
        this.initSpaceshipInterface();

        //能源系统，提供能源，并且在宇宙中通过太阳能充电（比如每秒增加2%，具体速率自定）
        //1.装载能源系统
        var energy = new Energy(this.spaceshipInterface);
        //动力系统，可以完成飞行和停止飞行两个行为，暂定所有飞船的动力系统飞行速度是一致的，比如每秒20px，飞行过程中会按照一定速率消耗能源（比如每秒减5%）
        //2.装载动力系统
        var engine = new Engine(this.spaceshipInterface);
        //信号接收处理系统，用于接收行星上的信号
        //3.装载信号接收处理系统
        var radio = new Radio(this.spaceshipInterface);

        energy.on();
        engine.on();
        radio.on();
    }
};

Status = {
    INIT: "init",
    TAKEOFF: "takeoff",
    LANDING: "landing",
    START: "start",
    STOP: "stop"
};
