const si = require('systeminformation');

const THRESHOLDS = {
    cpu:     { warning: 50, critical: 80 },
    memory:  { warning: 50, critical: 80 },
    download: { warning: 2,  critical: 4  },
    upload:   { warning: 1,  critical: 2  }
};

async function getAllMetrics() {
    let cpu     = await si.currentLoad();
    let memory  = await si.mem();
    network = await getNetwork();
    
    memory = memoryTransform(memory.total, memory.free, memory.used);
    memory.severity = getSeverity('memory', memory.usedGB / memory.totalGB * 100);
    network.downloadSeverity = getSeverity('download', network.downloadMBps);
    network.uploadSeverity = getSeverity('upload', network.uploadMBps);


    return { cpu: { currentLoad: Number(cpu.currentLoad.toFixed(2)), severity: getSeverity('cpu', cpu.currentLoad) }
    , memory, network };
}

async function getNetwork(){
    const network = await si.networkStats("*");
    for(let i = 0; i < network.length; i++){
        if(network[i].operstate == "up" || network[i].rx_sec !== null)
            return networkTransform(network[i].rx_sec, network[i].tx_sec);
    }

}

function networkTransform(rx_sec, tx_sec) {
    return {
        downloadMBps: Number(((rx_sec || 0) / (1000 * 1000)).toFixed(2)),
        uploadMBps: Number(((tx_sec || 0) / (1000 * 1000)).toFixed(2))
    };
}

function memoryTransform(total, free, used) {
    return {
        totalGB: Number((total / (1000 * 1000 * 1000)).toFixed(2)),
        freeGB: Number((free / (1000 * 1000 * 1000)).toFixed(2)),
        usedGB: Number((used / (1000 * 1000 * 1000)).toFixed(2))
    };
}

function getSeverity(type, value) {
    const threshold = THRESHOLDS[type];
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning)  return 'warning';
    return 'info';
}

module.exports = { getAllMetrics };