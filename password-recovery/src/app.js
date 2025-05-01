
const express = require('express');
const dotenv = require('dotenv');
const recoveryRoutes = require('./routes/recoveryRoutes');

dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/v1/recovery', recoveryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Password Recovery Service running on port ${PORT}`);
});