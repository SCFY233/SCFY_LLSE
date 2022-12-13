ll.registerPlugin("Snotice", "S公告", [1, 0, 3])
log("公告插件---加载成功，当前版本V1.0.3作者:SCFY")
let config = new JsonConfigFile("./plugins/SCFY/Notice/config.json", JSON.stringify({
    title: "公告",
    text: "公告内容",
    bt: "弹出标题"
}))
let notice = mc.newSimpleForm()
notice.setTitle(config.get("title"))
notice.setContent(config.get("text"))
notice.addButton("确定")
mc.regPlayerCmd("notice", "查看公告", function (pl) {
    pl.sendForm(notice, function (pl) {
        pl.setTitle(config.get("bt"))
    })
})
mc.listen("onJoin", function (pl) {
    pl.sendForm(notice, function (pl) {
        pl.setTitle(config.get("bt"))
    })
})
