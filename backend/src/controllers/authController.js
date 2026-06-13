const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { validateLoginPayload } = require('../utils/validation');

async function login(req, res, next) {
  try {
    const { errors, data } = validateLoginPayload(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
