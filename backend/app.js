const express = require('express');
const si = require('systeminformation');
const app = express();
const port = 3000;

metricObject = {
    currentLoad: "currentLoad",
    //processes: "list | pid",
   mem: "total, free, used",
}

app.get('/', (req, res) => {
    Promise.all([si.get(metricObject),
        si.networkStats("Wi-Fi")
    ])
    .then(([data, networkStats]) => {
      res.json({
        ...data,
        networkStats: networkStats
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error occurred while fetching CPU information');
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});