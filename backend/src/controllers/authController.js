const pool = require('../service/Pool.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  console.log(123);
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    res.status(201).json({
      id: result.insertId,
      email
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.loginUser = async (req, res) => {
  console.log('login')
  const { email, password } = req.body;

  try {
    const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = result[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {id: user.id, email: user.email},
        'mine',
        {expiresIn: '1h'}
      );
      console.log('login===', token);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};