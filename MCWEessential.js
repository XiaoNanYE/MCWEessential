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






        


//------------基础代码-----------------------




