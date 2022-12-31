//LiteLoaderScript Dev Helper
/// <reference path="e:\llseapi/dts/llaids/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "SBank",
    /* introduction */ "银行",
    /* version */[1, 0, 0],
    /* otherInformation */ {}
);
let config = new JsonConfigFile("./plugins/SCFY/SBank/config.json", JSON.stringify({
    Bank: "true",
    //经济系统，1为llmoney，2为计分板
    money: "1",
    //计分板名称
    scorename: "money",
}))
let Bankdata = new JsonConfigFile("./plugins/SCFY/SBank/data.json")
log("SBank ---加载成功！版本V1.0.0")
if (config.get("Bank") == "true") {
    mc.regPlayerCmd("bank", "银行主GUI", function (pl) {
        var Bankgui = mc.newSimpleForm()
        Bankgui.setTitle("银行系统")
        Bankgui.setContent("来干点什么？")
        Bankgui.addButton("存钱")
        Bankgui.addButton("取钱")
        //Bankgui.addButton("借钱")
        //Bankgui.addButton("还钱")
        Bankgui.addButton("取消")
        pl.sendForm(Bankgui, function (pl, id) {
            if (id == null) {
                pl.tell("[Bank]表单已关闭，未收到操作")
            } else if (id == 0) {
                var Bankgui1 = mc.newCustomForm()
                Bankgui1.setTitle("存钱")
                Bankgui1.addInput("存多少?")
                pl.sendForm(Bankgui1, function (pl, data) {
                    if (data == null) {
                        pl.tell("[Bank]表单已关闭，未收到操作")
                    } else {
                        if (config.get("money") == "1") {
                            var plmoneybankdata = Bankdata.get(pl.realName + "money")
                            if (plmoneybankdata == null) {
                                Bankdata.set(pl.realName + "money", 0)
                                var plmoneybankdata = Bankdata.get(pl.realName + "money")
                                var plmoney = Number(plmoneybankdata) + Number(data[0])
                                if (money.get(pl.xuid) >= data[0]) {
                                    pl.reduceMoney(Number(data[0]))
                                    Bankdata.set(pl.realName + "money", plmoney)
                                    pl.tell("[Bank]存钱成功！")
                                } else {
                                    pl.tell("丫的钱都不够！你存个屁！")
                                }
                            } else {
                                var plmoney = Number(plmoneybankdata) + Number(data[0])
                                if (money.get(pl.xuid) >= data[0]) {
                                    pl.reduceMoney(Number(data[0]))
                                    Bankdata.set(pl.realName + "money", plmoney)
                                    pl.tell("[Bank]存钱成功！")
                                } else {
                                    pl.tell("丫的钱都不够！你存个屁！")
                                }
                            }
                        } else if (config.get("money") == "2") {
                            var plmoneybankdata = Bankdata.get(pl.realName + "money")
                            if (plmoneybankdata == null) {
                                Bankdata.set(pl.realName + "money", 0)
                                var plmoneybankdata = Bankdata.get(pl.realName + "money")
                                var plmoney = Number(plmoneybankdata) + Number(data[0])
                                var plscoremoney = moneyscore.getScore(pl.realName)
                                var moneyscore = mc.getScoreObjective(config.get("scorename"))
                                if (moneyscore.getScore(pl.realName) >= data[0]) {
                                    moneyscore.reduceScore(pl.realName, data[0])
                                    Bankdata.set(pl.realName + "money", plmoney)
                                    pl.tell("[Bank]存钱成功！")
                                } else {
                                    pl.tell("丫的钱都不够！你存个屁！")
                                }
                            } else {
                                var moneyscore = mc.getScoreObjective(config.get("scorename"))
                                var plmoney = Number(plmoneybankdata) + Number(data[0])
                                var plscoremoney = moneyscore.getScore(pl.realName)
                                if (plscoremoney == null) {
                                    moneyscore.setScore(pl.realName, 0)
                                    if (moneyscore.getScore(pl.realName) >= data[0]) {
                                        moneyscore.reduceScore(pl.realName, data[0])
                                        Bankdata.set(pl.realName + "money", plmoney)
                                        pl.tell("[Bank]存钱成功！")
                                    } else {
                                        pl.tell("丫的钱都不够！你存个屁！")
                                    }
                                } else {
                                    if (moneyscore.getScore(pl.realName) >= data[0]) {
                                        moneyscore.reduceScore(pl.realName, data[0])
                                        Bankdata.set(pl.realName + "money", plmoney)
                                        pl.tell("[Bank]存钱成功！")
                                    } else {
                                        pl.tell("丫的钱都不够！你存个屁！")
                                    }
                                }
                            }
                        } else {
                            pl.tell("经济系统配置错误，请找管理员！")
                            log("经济系统配置错误！")
                        }
                    }
                })
            } else if (id == 1) {
                var Bankgui2 = mc.newCustomForm()
                Bankgui2.setTitle("取钱")
                Bankgui2.addLabel(pl.realName + "，你有" + Bankdata.get(pl.realName + "money") + "money!你取多少？")
                Bankgui2.addInput("输入钱数")
                pl.sendForm(Bankgui2, function (pl, data) {
                    if (data == null) {
                        pl.tell("[Bank]表单已关闭，未收到操作")
                    } else {
                        if (config.get("money") == "1") {
                            var plmoneydata = Bankdata.get(pl.realName + "money")
                            if (data[1] <= plmoneydata) {
                                var plmoney = Number(plmoneydata) - Number(data[1])
                                Bankdata.set(pl.realName + "money", plmoney)
                                pl.addMoney(Number(data[1]))
                                pl.tell("[Bank]取钱成功！")
                            } else {
                                pl.tell("丫的钱都不够！你取个屁！")
                            }
                        } else if (config.get("money") == "2") {
                            var plmoneydata = Bankdata.get(pl.realName + "money")
                            var moneyscore = mc.getScoreObjective(config.get("scorename"))
                            var plmoney = Number(plmoneydata) - Number(data[1])
                            if (data[1] <= moneyscore.getScore(pl.realName)) {
                                moneyscore.addScore(pl.realName, Number(data[1]))
                                Bankdata.set(pl.realName + "money", plmoney)
                                pl.tell("[Bank]取钱成功！")
                            } else {
                                pl.tell("丫的钱都不够！你取个屁！")
                            }
                        } else {
                            pl.tell("经济系统配置错误，请找管理员！")
                            log("经济系统配置错误！")
                        }
                    }
                })
            } else if (id == 2) {
                pl.tell("[Bank]表单已关闭，未收到操作")
            }/* else if (id == 3) {

            } else if (id == 4) {
                pl.tell("[Bank]表单已关闭，未收到操作")
            }*/
        })
    })
}