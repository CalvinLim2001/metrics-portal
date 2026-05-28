const express           = require('express');
const router            = express.Router();
const { getAllMetrics } = require('../services/systemMetrics');

router.get('/', async (req, res) => {
    const metrics = await getAllMetrics();
    res.json({ 
        nodeId: process.env.NODE_ID || 'local',
        metrics 
    });
});

module.exports = router;