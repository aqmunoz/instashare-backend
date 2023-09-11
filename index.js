require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

app.use(cors());
app.use(express.json());

//Database
dbConnection();

/**Routes */
app.use('/api/files', require('./routes/files'));
/**End Routes */

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});