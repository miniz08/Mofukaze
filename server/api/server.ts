import * as os from 'os';

export default defineEventHandler(async () => {
    const osType = os.type();  // 系统类型
    const netInfo = os.networkInterfaces();  // 网络信息
    let ip = '';

    // console.log('Network interfaces:', netInfo);  // 打印网络接口信息

    if (osType === 'Windows_NT') { 
        for (let dev in netInfo) {
            console.log('Interface:', dev);  // 输出每个接口的名称
            // 判断是否为无线网卡，且获取IPv4地址
            if (dev === 'WLAN'||dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }
    } else if (osType === 'Linux') {
        ip = netInfo.eth0 ? netInfo.eth0[0].address : '';  // 防止eth0未定义
    } else if (osType === 'Darwin') {
        // mac操作系统
        // ip = netInfo.en0[0].address;  // Mac的接口一般是en0
    } else {
        // 其他操作系统
    }

    console.log('IP Address:', ip);  // 输出IP地址
    return ip;
});
