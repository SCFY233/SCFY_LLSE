//LiteLoaderScript Dev Helper
/// <reference path="e:\llseapi/dts/llaids/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "SBDS",
    /* introduction */ "大不了从头再来嘛",
    /* version */[2, 0, 0],
    /* otherInformation */ {}
);
log("===================================================")
log("插件名称:SBDS-BDS基础")
log("作者:SCFY233 QQ:2837356981")
log("服务器版本:" + mc.getBDSVersion() + "协议:" + mc.getServerProtocolVersion())
log("配置文件位置:BDS根目录/plugins/SCFY/SBDS/config.json")
log("插件版本:V2.0.0-大不了从头再来嘛")
log("SCFY仓库https://gitee.com/SCFY233/SCFY_LLSE/")
log("===================================================")
let config = new JsonConfigFile("./plugins/SCFY/SBDS/config.json", JSON.stringify({
    //每个模块第一行默认是开启或关闭的，开启(true),关闭(false)
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
    //跨服传送模块
    servers: "true",
    //玩家信息模块
    playerlist: "true",
    //登录模块
    pwd: "true",
    //注册密码最短
    pwdlength: "6",
    //提示，丫的自己看示例
    pwdregyes: "注册成功！",
    pwdregno: "两次密码不相同！",
    pwdloginyes: "登陆成功",
    pwdloginno: "登陆失败,密码错误！",
    //公告模块
    notice: "true",
    noticetitle: "公告",
    noticetext: "示例公告",
    //公告弹出标题模块
    noticebt: "true",
    noticebttext: "弹出标题",

}))
let pwd = new JsonConfigFile("./plugins/SCFY/SBDS/password.json")
//登录以及notice部分
var notice = mc.newSimpleForm()
notice.setContent(config.get("noticetext"))
notice.setTitle(config.get("noticetitle"))
notice.addButton("确定")
if (config.get("pwd") == "true") {
    mc.listen("onJoin", function (pl) {
        var loginmenu = mc.newCustomForm()
        var regmenu = mc.newCustomForm()
        loginmenu.setTitle("登录")
        loginmenu.addInput("输入你的密码！")
        regmenu.setTitle("注册")
        regmenu.addInput("输入你想要的密码(不可修改)")
        regmenu.addInput("重复密码")
        if (pwd.get(pl.realName + "pwd") == null) {
            pl.sendForm(regmenu, function (pl, data) {
                if (data == null) {
                    pl.kick("表单被关闭!")
                } else {
                    if (data[0].length >= config.get("pwdlength")) {
                        if (data[0] == data[1]) {
                            pwd.set(pl.realName + "pwd", data[0])
                            pl.tell(config.get("pwdregyes"))
                            pl.sendForm(notice, function (pl) {
                                if (config.get(noticebt) == "true") {
                                    pl.setTitle(config.get("noticebt"))
                                }
                            })
                        } else {
                            pl.kick(config.get("pwdregno"))
                        }
                    } else {
                        pl.kick("密码过短，必须有" + config.get("pwdlength") + "个字符以上")
                    }
                }
            })
        } else {
            pl.sendForm(loginmenu, function (pl, data) {
                if (data == null) {
                    pl.kick()
                } else {
                    if (data[0] == pwd.get(pl.realName + "pwd")) {
                        pl.tell(config.get("pwdloginyes"))
                    } else {
                        pl.kick(config.get("pwdloginno"))
                    }
                }
            })
        }
    })
} else {
    if (config.get("pwd") == "false") {
        if (config.get("notice") == "true") {
            mc.listen("onJoin", function (pl) {
                pl.sendForm(notice, function (pl) {
                    if (config.get(noticebt) == "true") {
                        pl.setTitle(config.get("noticebt"))
                    }
                })
            })
        }
    }
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
    mc.listen("onPlayerDie", function (pl) {
        pl.sendModalForm("你趋势了", "你在" + pl.lastDeathPos + "趋势了,时间" + system.getTimeStr() + "是否返回趋势点", "确定", "取消", function (pl, id) {
            if (id == 1) {
                pl.teleport(pl.lastDeathPos)
                mc.runcmdEx('effect "' + pl.realName + '" resistance 30 10 true')
                mc.runcmdEx('effect "' + pl.realName + '" slow_falling 30 1 true')
                mc.runcmdEx('effect "' + pl.realName + '" Fire_Resistance 30 1 true')
                mc.runcmdEx('effect "' + pl.realName + '" Water_Breathing 30 1 true')
            }
        })
    })
}
mc.regPlayerCmd("back", "返回趋势点", function (pl) {
    pl.teleport(pl.lastDeathPos)
    mc.runcmdEx('effect "' + pl.realName + '" resistance 30 10 true')
    mc.runcmdEx('effect "' + pl.realName + '" slow_falling 30 1 true')
    mc.runcmdEx('effect "' + pl.realName + '" Fire_Resistance 30 1 true')
    mc.runcmdEx('effect "' + pl.realName + '" Water_Breathing 30 1 true')
})
//跨服传送------------------------------------------------------------------------------------------------------------------------------------------------------------------
let servers = new JsonConfigFile("./plugins/SCFY/SBDS/servers.json", JSON.stringify({
    server1name: "示例服务器",
    server1ip: "z1.getmc.cn",
    server1port: 15232,
    server2name: "示例服务器2",
    server2ip: "114514.xyz",
    server2port: 19133,
    server3name: "示例服务器3",
    server3ip: "594188.com",
    server3port: 19132,
}))
if (config.get("servers") == "true") {
    mc.regPlayerCmd("servers", "跨服传送菜单", function (pl) {
        let servermenu = mc.newSimpleForm()
        servermenu.setTitle("跨服传送菜单")
        servermenu.setContent("表单如下")
        servermenu.addButton(servers.get("server1name") + "\n" + servers.get("server1ip") + servers.get("server1port"))
        servermenu.addButton(servers.get("server2name") + "\n" + servers.get("server2ip") + servers.get("server2port"))
        servermenu.addButton(servers.get("server3name") + "\n" + servers.get("server3ip") + servers.get("server3port"))
        servermenu.addButton("取消")
        pl.sendForm(servermenu, function (pl, id) {
            if (id == null) {
                pl.tell("[SBDS-Servers]表单已关闭,未收到操作")
            } else {
                if (id == "0") {
                    mc.broadcast(pl.realName + "正在跨服到" + servers.get("server1name") + ",可能会有一些卡顿！")
                    pl.transServer(servers.get("server1ip"), servers.get("server1port"))
                }
                else {
                    if (id == "1") {
                        mc.broadcast(pl.realName + "正在跨服到" + servers.get("server2name") + ",可能会有一些卡顿！")
                        pl.transServer(servers.get("server2ip"), servers.get("server2port"))
                    }
                    else {
                        if (id == "2") {
                            mc.broadcast(pl.realName + "正在跨服到" + servers.get("server3name") + ",可能会有一些卡顿！")
                            pl.transServer(servers.get("server3ip"), servers.get("server3port"))
                        }
                    }
                }
            }
        })
    })
}
//玩家信息模块
let playerlist = new JsonConfigFile("./plugins/SCFY/SBDS/player.json")
mc.listen("onJoin", function (pl) {
    if (playerlist.get(pl.realName + "xuid") != pl.xuid) {
        log("玩家" + pl.realName + "的xuid参数错误/暂无,已重构")
        var xuid = pl.xuid
        var uuid = pl.uuid
        playerlist.set(pl.realName + "xuid", xuid)
    }
    if (playerlist.get(pl.realName + "uuid") != pl.uuid) {
        log("玩家" + pl.realName + "的uuid参数错误/暂无,已重构")
        var uuid = pl.uuid
        playerlist.set(pl.realName + "uuid", uuid)
    }
    if (playerlist.get(pl.realName) != "true") {
        log("玩家" + pl.realName + "的存在参数错误/暂无,已重构")
        playerlist.set(pl.realName, "true")
    }
}
)
//爆炸日志模块
var logtime = system.getTimeObj()
mc.listen("onEntityExplode", function (source, pos) {
    log("[" + logtime.Y + ":" + logtime.M + ":" + logtime.D + "]" + "[SBDS-Explode]爆炸物品:" + source.name + "位置" + pos)
})