const si = require('systeminformation');

async function getAllMetrics() {
    const cpu     = await si.currentLoad();
    const memory  = await si.mem();
    const network = await si.networkStats();

    return { cpu, memory, network };
}

module.exports = { getAllMetrics };