const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/test-db', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.send(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error connecting to database');
    }
  });

  const secret = 'your_jwt_secret';

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('Received registration request for username:', username);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        console.log('User created:', result.rows[0]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('User already exists or other error');
    }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
          console.log('User not found');
          return res.status(400).send('User not found');
      }
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          console.log('Invalid password');
          return res.status(400).send('Invalid password');
      }
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
      console.log('Token generated:', token);
      res.json({ token });
  } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Error logging in');
  }
});