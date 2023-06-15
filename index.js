const express = require('express');
const createError = require('http-errors');
require('express-async-errors');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/favicon.ico', (req, res) => res.status(204))

app.use('/api/v1', require('./src/v1'));

app.use((req, res, next) => {
  next(createError(404));
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${server.address().port}`);
});