//---------------------------------------------------------------
// __  __  ______        _______                         _   _       _ 
//|  \/  |/ ___\ \      / / ____|___  ___ ___  ___ _ __ | |_(_) __ _| |
//| |\/| | |    \ \ /\ / /|  _| / _ \/ __/ __|/ _ \ '_ \| __| |/ _` | |
//| |  | | |___  \ V  V / | |__|  __/\__ \__ \  __/ | | | |_| | (_| | |
//|_|  |_|\____|  \_/\_/  |_____\___||___/___/\___|_| |_|\__|_|\__,_|_|
//                                                      
//    该插件仅在MCWBBS和MBBS发布！         
//    未经原创作者允许禁止二次发布和整合！                                                                             
//                                                                                        
//---------------------------------------------------------------
//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Desktop\VSCexploitation/Library/JS/Api.js" /> 
//---------------------------------------------------------------

//【插件注册】向加载器提供一些插件相关的信息
let PLUGIN_NAME = "MCWEessential";      //插件名称
let PLUGIN_DESCRIPTION = "MCWEessential 基础性全能插件 [输入 ll plugins MCWEessential.js 查看具体信息]";     //插件描述
let VERSION = [1,0,0];      //插件版本号
let Publishing_website = "https://www.mcwebbs.com/";   //插件发布地址
let AUTHOR = "叶小楠";       //插件作者

//检查 LiteLoader 加载器版本,如果检测发现当前安装的 LLSE 版本低于传入的数值，将返回 false。
//你可以选择根据结果判断并报错，提醒用户升级自己的 LiteLoader (LLSE) 版本
if(!ll.requireVersion(2, 1, 4)){
    throw new Error("\n"+`【⚠警告】${PLUGIN_NAME} 加载失败!`+"\n"+"【⚠警告】LiteLoader加载器 版本过低，请升级至 LL2.1.4 或更高版本!");
}
else{
    logger.info(`${PLUGIN_NAME} 加载成功, 版本号:${VERSION.join(".")}, 发布网站:${Publishing_website},插件作者: ${AUTHOR}`);  //显示插件版本号，作者等信息

    ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION, {
        "Publishing website":Publishing_website,
        "发布地址":Publishing_website,
        "Author":AUTHOR,
        "作者":AUTHOR
     
    });
};

//【配置文件】创建或读取配置文件
let config=new JsonConfigFile(".\\plugins\\MCWEessential\\config.json");
config.init("EnUse",true);       
config.init("EnUse",true);   
config.init("EnUse",true);   
config.init("EnUse",true);   





        


//------------基础代码-----------------------

















































//------------WoodAxe----------------
var pos1 = {};
var pos2 = {};
var dim = {};
var undopos = {};
var copyinfo = {};
var loutput = false;
var lian = {};
var dlian = {};

function ST(pl, text) {
    pl.tell('§l§d[Wooden_axe] ' + text + '');
}

mc.regPlayerCmd('pos1', '记录pos1坐标', function (pl, cmd) { changedim(pl); return setpos1(pl, JSON.parse(pl.pos.x.toFixed(0)), JSON.parse(pl.pos.y.toFixed(0)), JSON.parse(pl.pos.z.toFixed(0)), pl.pos.dimid) }, 1);
mc.regPlayerCmd('pos2', '记录pos2坐标', function (pl, cmd) { changedim(pl); return setpos2(pl, JSON.parse(pl.pos.x.toFixed(0)), JSON.parse(pl.pos.y.toFixed(0)), JSON.parse(pl.pos.z.toFixed(0)), pl.pos.dimid) }, 1);
mc.regPlayerCmd('copy', '复制选择点', function (pl, cmd) { changedim(pl); return poscopy(pl); }, 1);
mc.regPlayerCmd('paste', '粘贴选择点', function (pl, cmd) { changedim(pl); return pospaste(pl); }, 1);
mc.regPlayerCmd('set', '/set <blockname> [specialValue]设置区域方块', function (pl, cmd) { changedim(pl); return setposblock(pl, cmd) }, 1);
mc.regPlayerCmd('giveup', '放弃选点', function (pl, cmd) { changedim(pl); removepos(pl.realName); ST(pl, '§b放弃所有选点成功'); }, 1);
mc.regPlayerCmd('undo', '恢复上一次操作', function (pl, cmd) { changedim(pl); return undoblock(pl); }, 1);

mc.listen("onUseItemOn", use);
mc.listen("onDestroyBlock", dest);
mc.listen("onLeft", left);
mc.listen("onChangeDim", changedim);
mc.listen("onConsoleOutput", output);

function output(out) {
    if (loutput)
        if (out.search('blocks filled') != -1)
            return false;
}

function use(pl, it, bl) {
    if (pl.isOP() && it.type == 'minecraft:wooden_axe') {
        changedim(pl);
        if (lian[pl.realName] == null) {
            lian[pl.realName] = true;
            setTimeout(function () {
                delete lian[pl.realName];
            }, 200);
            if (pl.isOP())
                setpos1(pl, bl.pos.x, bl.pos.y, bl.pos.z, bl.pos.dimid);
        }
        return false;
    } else { return true; }
}

function dest(pl, bl) {
    if (pl.isOP()) {
        changedim(pl);
        var it = pl.getHand();
        if (pl.isOP() && it.type == 'minecraft:wooden_axe') {
            if (dlian[pl.realName] == null) {
                setpos2(pl, bl.pos.x, bl.pos.y, bl.pos.z, bl.pos.dimid);
                dlian[pl.realName] = true;
                setTimeout(function () {
                    delete dlian[pl.realName];
                }, 200);
            }
            return false;
        }
    } else { return true; }
}

function left(pl) {
    removepos(pl.realName);
    try {
        delete undopos[pl.realName];
    } catch (_) { }
    try {
        delete dim[pl.realName];
    } catch (_) { }
}

function changedim(pl) {
    if (dim[pl.realName] == null)
        dim[pl.realName] = pl.pos.dimid;
    else if (dim[pl.realName] != pl.pos.dimid) {
        if (pos1[pl.realName] != null || pos2[pl.realName] != null || undopos[pl.realName] != null) {
            removepos(pl.realName);
            try {
                delete undopos[pl.realName];
            } catch (_) { }
            ST(pl, '§b检测到切换维度，已清除pos1和pos2和undo数据');
        }
    }
    dim[pl.realName] = pl.pos.dimid;
}

function removepos(nm) {
    if (pos1[nm] != null || pos2[nm] != null) {
        if (pos1[nm] != null) {
            delete pos1[nm];
        }
        if (pos2[nm] != null) {
            delete pos2[nm];
        }
    }
}

function setpos1(pl, x, y, z, id) {
    pos1[pl.realName] = { "x": x, "y": y, "z": z, "dimid": id };
    ST(pl, '§apos1选择成功(' + x + ',' + y + ',' + z + ',' + id + ')');
}

function setpos2(pl, x, y, z, id) {
    pos2[pl.realName] = { "x": x, "y": y, "z": z, "dimid": id };
    ST(pl, '§apos2选择成功(' + x + ',' + y + ',' + z + ',' + id + ')');
}

function setposblock(pl, cmd) {
    if (cmd.length >= 1 && cmd.length <= 2) {
        if (cmd[0] == '#hand') {
            var it = pl.getHand();
            if (it.isNull())
                cmd[0] = 'air';
            else
                cmd[0] = it.type;
        }
        if (cmd[1] == undefined)
            cmd[1] = '';
        else if (cmd[1] == '#hand') {
            var it = pl.getHand();
            cmd[1] = it.aux;
        }
        if (pos1[pl.realName] != null && pos2[pl.realName] != null) {
            var oldblockspos = {};
            if (pos1[pl.realName].x >= pos2[pl.realName].x)
                oldblockspos["x"] = pos2[pl.realName].x;
            else
                oldblockspos["x"] = pos1[pl.realName].x;
            if (pos1[pl.realName].y >= pos2[pl.realName].y)
                oldblockspos["y"] = pos2[pl.realName].y;
            else
                oldblockspos["y"] = pos1[pl.realName].y;
            if (pos1[pl.realName].z >= pos2[pl.realName].z)
                oldblockspos["z"] = pos2[pl.realName].z;
            else
                oldblockspos["z"] = pos1[pl.realName].z;
            undopos[pl.realName] = oldblockspos;
            var jie1 = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ structure save "' + pl.realName + ' undo" ' + pos1[pl.realName].x + ' ' + pos1[pl.realName].y + ' ' + pos1[pl.realName].z + ' ' + pos2[pl.realName].x + ' ' + pos2[pl.realName].y + ' ' + pos2[pl.realName].z + ' memory');
            if (jie1.success) {
                var blockshu = Math.abs(pos1[pl.realName].x - pos2[pl.realName].x) * Math.abs(pos1[pl.realName].y - pos2[pl.realName].y) * Math.abs(pos1[pl.realName].z - pos2[pl.realName].z) + 4480;
                if (blockshu < 32767) {
                    var jie = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ fill ' + pos1[pl.realName].x + ' ' + pos1[pl.realName].y + ' ' + pos1[pl.realName].z + ' ' + pos2[pl.realName].x + ' ' + pos2[pl.realName].y + ' ' + pos2[pl.realName].z + ' ' + cmd[0] + ' ' + cmd[1] + '');
                    if (jie.success == true)
                        ST(pl, '§a操作完成,使用/undo可撤销');
                    else
                        ST(pl, '§c操作失败,反馈:' + jie.output + '')
                } else {
                    betterfill(pl, cmd[0], cmd[1]);
                    ST(pl, '§a操作完成,使用/undo可撤销');
                }
            } else {
                pl.sendModalForm('§l§d[Wooden_axe]§4[Warning]', '§l§cundo数据保存失败!§a详情:\n§e' + jie1.output + '\n§c继续操作将无法undo!\n请谨慎选择!', '继续操作', '放弃操作', function (pl1, selected) {
                    if (selected != null) {
                        if (selected == true) {
                            var blockshu = Math.abs(pos1[pl1.realName].x - pos2[pl1.realName].x) * Math.abs(pos1[pl1.realName].y - pos2[pl1.realName].y) * Math.abs(pos1[pl1.realName].z - pos2[pl1.realName].z) + 4480;
                            if (blockshu < 32767) {
                                var jie = mc.runcmdEx('/execute "' + pl1.realName + '" ~~~ fill ' + pos1[pl1.realName].x + ' ' + pos1[pl1.realName].y + ' ' + pos1[pl1.realName].z + ' ' + pos2[pl1.realName].x + ' ' + pos2[pl1.realName].y + ' ' + pos2[pl1.realName].z + ' ' + cmd[0] + ' ' + cmd[1] + '');
                                if (jie.success == true)
                                    ST(pl1, '§a操作完成,此操作不可撤销');
                                else
                                    ST(pl1, '§c操作失败,反馈:' + jie.output + '')
                            } else {
                                betterfill(pl1, cmd[0], cmd[1]);
                                ST(pl1, '§a操作完成,此操作不可撤销');
                            }
                        } else if (selected == false)
                            ST(pl1, '§b操作已放弃');
                    } else
                        ST(pl1, '§b表单已放弃');
                })
            }
        } else
            ST(pl, '§c无法进行设置!请检查pos1和pos2是否选择');
    } else
        ST(pl, '§c请至少输入一类方块名');
}

function undoblock(pl) {
    if (undopos[pl.realName] != null) {
        var jie = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ structure load "' + pl.realName + ' undo" ' + undopos[pl.realName].x + ' ' + undopos[pl.realName].y + ' ' + undopos[pl.realName].z);
        if (jie.success)
            ST(pl, '§a恢复上一次操作成功');
        else
            ST(pl, '§c恢复上一次操作失败,原因:' + jie.output + '');
    } else
        ST(pl, '§c你没有上一次操作记录');
}

function poscopy(pl) {
    if (pos1[pl.realName] != null && pos2[pl.realName] != null) {
        var oldblockspos = {};
        if (pos1[pl.realName].x <= pos2[pl.realName].x)
            oldblockspos["x"] = pos2[pl.realName].x - pos1[pl.realName].x;
        else
            oldblockspos["x"] = pos1[pl.realName].x - pos2[pl.realName].x;
        if (pos1[pl.realName].y <= pos2[pl.realName].y)
            oldblockspos["y"] = pos2[pl.realName].y - pos1[pl.realName].y;
        else
            oldblockspos["y"] = pos1[pl.realName].y - pos2[pl.realName].y;
        if (pos1[pl.realName].z <= pos2[pl.realName].z)
            oldblockspos["z"] = pos2[pl.realName].z - pos1[pl.realName].z;
        else
            oldblockspos["z"] = pos1[pl.realName].z - pos2[pl.realName].z;
        var jie = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ structure save "' + pl.realName + ' copy" ' + pos1[pl.realName].x + ' ' + pos1[pl.realName].y + ' ' + pos1[pl.realName].z + ' ' + pos2[pl.realName].x + ' ' + pos2[pl.realName].y + ' ' + pos2[pl.realName].z + ' memory');
        if (jie.success) {
            copyinfo[pl.realName] = oldblockspos;
            ST(pl, '§b复制成功，使用/paste可粘贴建筑');
        } else
            ST(pl, '复制失败,原因:' + jie.output + '');
    } else
        ST(pl, '§c复制失败，请检查pos1和pos2是否选择');
}

function pospaste(pl) {
    if (copyinfo[pl.realName] != null) {
        var pos = { "x": Math.floor(pl.pos.x.toFixed(0)), "y": Math.floor(pl.pos.y.toFixed(0)), "z": Math.floor(pl.pos.z.toFixed(0)) };
        var jie = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ structure save "' + pl.realName + ' undo" ' + pos.x + ' ' + pos.y + ' ' + pos.z + ' ' + (pos.x + copyinfo[pl.realName].x) + ' ' + (pos.y + copyinfo[pl.realName].y) + ' ' + (pos.z + copyinfo[pl.realName].z) + ' memory');
        if (jie.success) {
            var jie1 = mc.runcmdEx('/execute "' + pl.realName + '" ~~~ structure load "' + pl.realName + ' copy" ' + pos.x + ' ' + pos.y + ' ' + pos.z + '');
            if (jie1.success) {
                undopos[pl.realName] = pos;
                ST(pl, '§a粘贴完成, 使用/undo可以撤销粘贴');
            } else
                ST(pl, '§c粘贴失败,详情:' + jie1.output + '');
        } else
            ST(pl, '§cundo数据保存失败,无法进行粘贴,详情:' + jie.output + '');
    } else
        ST(pl, '§c粘贴失败,因为您还没有复制建筑,使用/copy即可复制建筑');
}

function betterfill(pl, blname, id) {
    var y;
    loutput = true;
    if (pos1[pl.realName].y >= pos2[pl.realName].y)
        y = pos2[pl.realName].y;
    else
        y = pos1[pl.realName].y;
    var h = Math.abs(pos1[pl.realName].y - pos2[pl.realName].y) + 1;
    for (var i = 0; i < h; i++) {
        block = Math.abs(pos1[pl.realName].x - pos2[pl.realName].x) * Math.abs(pos1[pl.realName].z * pos2[pl.realName].z) + 4480;
        if (block > 32767) {
            mc.runcmd('/execute "' + pl.realName + '" ~~~ fill  ' + pos1[pl.realName].x + ' ' +
                (y + i) + ' ' + pos1[pl.realName].z + ' ' + pos2[pl.realName].x + ' ' + (y + i) + ' ' + pos2[pl.realName].z + ' ' + blname + ' ' + id + '');
        } else {
            var x;
            if (pos1[pl.realName].x >= pos2[pl.realName].x)
                x = pos2[pl.realName].x;
            else
                x = pos1[pl.realName].x;
            var x1 = pos1[pl.realName].x;
            var x2 = pos2[pl.realName].x;
            var x1x2 = Math.abs(x1 - x2) + 1;
            for (var ii = 0; ii < x1x2; ii++) {
                mc.runcmd('/execute "' + pl.realName + '" ~~~ fill  ' + (x + ii) + ' ' + (y + i) + ' ' +
                    pos1[pl.realName].z + ' ' + (x + ii) + ' ' + (y + i) + ' ' + pos2[pl.realName].z + ' ' + blname + ' ' + id + '');
            }
        }
    }
    loutput = false;
}

//-----------MENU------------
let tmp = {};

function ST(pl, text) {
	pl.tell(`§l§d[CMENU] ${text}`, 0);
}

function beforeOnUseItem(pl, it) {
	let xuid = pl.xuid;
	if (!tmp[xuid]) {
		tmp[xuid] = true;
		if (it.type == 'minecraft:clock') {
			forms(pl, 'main');
		}
		setTimeout(function () {
			delete tmp[xuid];
		}, 300)
	}
}

function menu(pl, cmd) {
	forms(pl, 'main');
}

function forms(pl, name) {
	pl.tell('开始读取文件' + name + '.json', 5);
	let e = new File('.\\plugins\\MCWEessential\\MENU\\' + name + '.json', file.ReadMode);
	(function (pl, name, fi) {
		fi.readAll(function (e) {
			if (e == null) {
				pl.tell('文件: "' + name + '.json" 不存在！', 5);
				logger.error('文件："' + name + '.json" 不存在！');
			} else {
				pl.tell('读取文件 50%', 5);
				let dataa = null;
				try {
					dataa = JSON.parse(e);
				} catch {
					logger.error('文件: "' + name + '.json" 进行JSON解析失败！');
					pl.tell('文件: "' + name + '.json" 进行JSON解析失败！', 5);
				}
				if (dataa != null) {
					pl.tell('读取文件 100%', 5);
					pl.tell('读取文件成功', 5);
					let form = [];
					let image = [];
					for (let i = 0; i < dataa.length; i++) {
						form.push(dataa[i].name);
						if (dataa[i].image != null) {
							image.push(dataa[i].image);
						} else {
							image.push("");
						}
					}
					pl.sendSimpleForm('§l§dMENU', '菜单如下：', form, image, function (pl, selected) {
						if (selected != null) {
							if (dataa[selected].type == 'form')
								forms(pl, dataa[selected].open);
							else if (dataa[selected].type == 'opform')
								if (plIsOP(pl.xuid)) {
									forms(pl, dataa[selected].open);
								} else {
									ST(pl, '§c你没有权限使用这个模块');
								} else if (dataa[selected].type == 'comm') {
									pl.runcmd(dataa[selected].open);
								} else if (dataa[selected].type == 'opcomm')
								if (plIsOP(pl.xuid)) {
									pl.runcmd(dataa[selected].open);
								} else {
									ST(pl, '§c你没有权限使用这个命令');
								} else {
								pl.tell('type参数错误！', 5);
								logger.error('文件："' + name + '.json" name: "' + dataa[selected].name + '" type参数错误!');
							}
						} else {
							ST(pl, "§b表单已放弃");
						}
					})
				}
			}
			fi.close();
		})
	})(pl, name, e)
}

function start() {
	let json = file.readFrom('.\\plugins\\MCWEessential\\MENU\\main.json');
	if (json == null) {
		file.createDir('.\\plugins\\MCWEessential\\MENU')
		let xie = [{ "name": "nooptest", "image": "https://z3.ax1x.com/2021/07/18/W31CBd.jpg", "open": "/me test", "type": "comm" }, { "name": "optest", "image": "https://z3.ax1x.com/2021/07/18/W31CBd.jpg", "open": "/me hello world", "type": "opcomm" }, { "name": "nooptestform", "image": "https://z3.ax1x.com/2021/07/18/W31CBd.jpg", "open": "hhh", "type": "form" }, { "name": "optestform", "open": "ooo", "type": "opform" }];
		let Json = JSON.stringify(xie, null, "\t");
		file.writeTo('.\\plugins\\MCWEessential\\MENU\\main.json', Json);
		let xi = [{ "name": "optest", "image": "https://z3.ax1x.com/2021/07/18/W31CBd.jpg", "open": "/me hello", "type": "opcomm" }];
		let Jso = JSON.stringify(xi, null, "\t");
		file.writeTo('.\\plugins\\MCWEessential\\MENU\\hhh.json', Jso);
		let x = [{ "name": "test", "image": "https://z3.ax1x.com/2021/07/18/W31CBd.jpg", "open": "/me hello world", "type": "comm" }];
		let Js = JSON.stringify(x, null, "\t");
		file.writeTo('.\\plugins\\MCWEessential\\MENU\\ooo.json', Js);
		logger.info('第一次加载CMENU,文件已自动创建!');
	}
}

function plIsOP(xuid) {
	let fi = JSON.parse(file.readFrom(".\\permissions.json")), i = 0;
	while (i < fi.length) {
		if (fi[i].xuid == xuid) {
			if (fi[i].permission == "operator") {
				return true;
			} else {
				return false;
			}
		}
		i++;
	}
	return false;
}

function load() {
	logger.setTitle("CMENU");
	logger.setConsole(true, 4);
	mc.listen("onUseItemOn", beforeOnUseItem);
	mc.regPlayerCmd('menu', '打开菜单', menu, 0);
	mc.regPlayerCmd('cd', '打开菜单', menu, 0);
	start();
	logger.info("MENU已加载。版本MCWe特供版")
};
load();


