//LiteLoaderScript Dev Helper
/// <reference path="e:\llseapi/dts/llaids/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "SBDS",
    /* introduction */ "bds基础",
    /* version */[1, 0, 3],
    /* otherInformation */ {}
);
var version = "1.0.3"
log("SBDS---SBDS基础---加载成功,版本V" + version + "作者:SCFY")
let config = new JsonConfigFile("./plugins/SCFY/BDS/config.json", JSON.stringify({
    //公告模块
    //每个模块第一行默认是开启或关闭的，开启(true),关闭(false)
    notice: "true",
    //公告标题
    title: "公告",
    //公告内容
    text: "公告内容",
    //公告弹出标题
    bt: "弹出标题",
    //进服退服模块
    //由于llbds限制，无法屏蔽例如xxxx进入了游戏
    jl: "true",
    onjoin: "[+]",
    //onjoin,onleft后面自动加玩家名，如果需要玩家名在前面请自行修改插件
    onleft: "[-]",
    //tpa模块
    tpa: "true",
    //ping模块
    ping: "true",
    //tpr模块
    tpr: "true",
    //假名检测模块
    jmjc: "true",
    //返回死亡点模块
    back: "true",
}))
//公告模块----------------------------------------------------
if (config.get("notice") == "true") {
    let notice = mc.newSimpleForm()
    notice.setTitle(config.get("title"))
    notice.setContent(config.get("text"))
    notice.addButton("确定")
    mc.regPlayerCmd("notice", "查看公告", function (gg, pl) {
        pl.sendForm(notice, function (pl) {
            pl.setTitle(config.get("bt"))
        })
    })
    mc.listen("onJoin", function (pl) {
        pl.sendForm(notice, function (pl) {
            pl.setTitle(config.get("bt"))
        })
    })
}
//OnJoin和OnLeft模块---------------------------------------------
if (config.get("jl") == "true") {
    mc.listen("onJoin", function (pl) {
        mc.broadcast(config.get("onjoin") + pl.realName)
    })
    mc.listen("onLeft", function (pl) {
        mc.broadcast(config.get("onleft") + pl.realName)
    })
}
//tpa模块---------------------------------------------------------------------------------
if (config.get("tpa") == "true") {
    mc.regPlayerCmd('tpa', '§b打开tpa界面', function (player) {
        tpamenu(player)
    })
}
function tpamenu(player) {
    let fm = mc.newCustomForm()
    fm.setTitle("BDS-tpa")
    let players = []
    mc.getOnlinePlayers().forEach(pl => {
        players.push(pl.realName)
    })
    players.forEach(function (item, index, arr) {
        if (item === player.name) {
            arr.splice(index, 1);
        }
    });
    let mode = new Array();
    mode[0] = "tpa"
    mode[1] = "tpahere"
    fm.addDropdown('玩家列表', players)
    fm.addDropdown('选择模式', mode)
    player.sendForm(fm, (pl, args) => {
        if (args != undefined) {
            if (args[1] != null && args[0] != null && players[args[0]] != undefined) {
                if (mode[args[1]] == "tpa") {
                    tpar(pl, mc.getPlayer(players[args[0]]))
                }
                else if (mode[args[1]] == "tpahere") {
                    tparh(pl, mc.getPlayer(players[args[0]]))
                }
            }
            else {
                pl.tell("[BDS-tpa]请选择正确的参数！")
            }
        }

    })
}
function tpar(player1/*请求玩家*/, player2/*接受玩家*/) {
    let fm = mc.newSimpleForm()
    fm.setTitle("TPA请求")
    fm.setContent('玩家' + player1.name + "向您发送了一个TPA请求，是否接受？")
    fm.addButton('是')
    fm.addButton('否')
    player2.sendForm(fm, function (player, id) {
        if (id == undefined) {
            player1.tell("[BDS-tpa]对方拒绝了你的请求")
        }
        else {
            if (id == 0) {
                tpa(player1, player2)
            }
            if (id == 1) {
                player1.tell("[BDS-tpa]对方拒绝了你的请求")
            }
        }

    })
}
function tparh(player1/*请求玩家*/, player2/*接受玩家*/) {
    let fm = mc.newSimpleForm()
    fm.setTitle("TPA请求")
    fm.setContent('玩家' + player1.name + "向您发送了一个TPAHERE请求，是否接受？")
    fm.addButton('是')
    fm.addButton('否')
    player2.sendForm(fm, function (player, id) {
        if (id == undefined) {
            player1.tell("[BDS-tpa]对方拒绝了你的请求")
        }
        else {
            if (id == 0) {
                tpah(player1, player2)
            }
            if (id == 1) {
                player1.tell("[BDS-tpa]对方拒绝了你的请求")
            }
        }
    })
}
function tpa(player1, player2) {
    player1.teleport(player2.pos)
}
function tpah(player1, player2) {
    player2.teleport(player1.pos)
}
//ping模块------------------------------------------------------------------------------------------
if (config.get("ping") == "true") {
    mc.regPlayerCmd("ping", "检测延迟", function (pl) {
        var pingpl = pl.getDevice()
        var ping = mc.newSimpleForm()
        ping.setTitle("PING结果")
        ping.setContent("延迟:" + pingpl.lastPing + "丢包率:" + pingpl.lastPacketLoss + "%")
        ping.addButton("确定")
        pl.sendForm(ping, function (pl) {
            var pingsj = pingpl.lastPing
            if (pingsj >= 130) {
                pl.tell("[BDS-Ping]延迟和手机:你牛掰,你清高")
            }
            else {
                if (pingsj >= 70) {
                    pl.tell("[BDS-Ping]这延迟。。。。凑活能玩吧")
                }
                else {
                    if (pingsj >= 35) {
                        pl.tell("[BDS-Ping]延迟不错，加油啊")
                    }
                    else {
                        pl.tell("[BDS-Ping]延迟Very Good,继续保持！")
                    }
                }
            }
        })
    })
}
//Tpr模块--------------------------------------------------------------------
if (config.get("tpr") == "true") {
    function load() {
        mc.regPlayerCmd('tpr', '随机传送', tpr, 0)
    };
    function tpr(pl, comm) {
        var zb = fu(pl).split(",");
        mc.runcmdEx('execute "' + pl.realName + '" ~~~ tp @s ' + zb[0] + ' ' + zb[1] + ' ' + zb[2]);
        mc.runcmdEx('effect "' + pl.realName + '" resistance 30 10 true');
        mc.runcmdEx('effect "' + pl.realName + '" slow_falling 30 1 true');
        mc.runcmdEx('effect "' + pl.realName + '" Fire_Resistance 30 1 true');
        mc.runcmdEx('effect "' + pl.realName + '" Water_Breathing 30 1 true');
        pl.tell('[BDS-tpr]已将您传送置§e' + zb[0] + ',' + zb[1] + ',' + zb[2]);
        return false;
    };
    //运算部分
    function rando(pl) {
        var x = Math.floor(Math.random() * 10000);
        if (pl.pos.dimid == 0) {
            var y = 120;
        } else if (pl.pos.dimid == 1) {
            var y = 90;
        } else if (pl.pos.dimid >= 1) {
            var y = 150;
        };
        var z = Math.floor(Math.random() * 10000);
        return x + ',' + y + ',' + z;
    };
    function fu(pl) {
        var p = Math.floor(Math.random() * 4);
        var zhi = rando(pl).split(",");
        if (p == 0) {
            return zhi[0] + ',' + zhi[1] + ',' + zhi[2];
        }
        if (p == 1) {
            return -zhi[0] + ',' + zhi[1] + ',-' + zhi[2];
        }
        if (p == 2) {
            return zhi[0] + ',' + zhi[1] + ',-' + zhi[2];
        }
        if (p == 3) {
            return -zhi[0] + ',' + zhi[1] + ',' + zhi[2];
        }
    };
    load();
}
//假名检测----------------------------------------------------------------------------------
if (config.get("jmjc") == "true") {
    mc.listen("onJoin", function (pl) {
        if (pl.name == pl.realName) {
            pl.tell("[SBDS假名检测]假名检测通过")
        }
        else {
            mc.broadcast("[SBDS假名检测]玩家" + pl.realName + "(假名)试图使用假名进入游戏,他的真实名称为" + pl.realName + ",请大家不要学习!")
            pl.kick("[SBDS假名检测]你试图使用假名进入服务器,你已被踢出服务器")
        }
    })
}
//back模块
if (config.get("back") == "true") {
    mc.regPlayerCmd("back", "返回趋势点", function (pl) {
        pl.teleport(pl.lastDeathPos)
        mc.runcmdEx('effect "' + pl.realName + '" resistance 30 10 true')
        mc.runcmdEx('effect "' + pl.realName + '" slow_falling 30 1 true')
        mc.runcmdEx('effect "' + pl.realName + '" Fire_Resistance 30 1 true')
        mc.runcmdEx('effect "' + pl.realName + '" Water_Breathing 30 1 true')
    })
}