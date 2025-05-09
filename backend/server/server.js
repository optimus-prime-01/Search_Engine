const express = require('express');
const cors = require('cors');
require('dotenv').config();

const downloadRouter = require('./routes/download');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/download', downloadRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});