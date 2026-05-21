const express       = require('express');
const metricsRouter = require('./routes/metrics');

const app  = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/metrics', metricsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});