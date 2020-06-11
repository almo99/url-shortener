const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const yup = require('yup');
const nanoid = require('nanoid');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/url/:id', (req, res) => {
  // TODO: get a short url by id
});

app.get('/:id', (req, res) => {
  // TODO: redirect to url
});

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
  const { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });

    if (!slug) {
      slug = nanoid();
    }

    slug = slug.toLowerCase();

    res.json({
      slug,
      url,
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'pancake' : error.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port} ...`);
});
