require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не настроен в .env файле');
    }

    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверные учетные данные' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверные учетные данные' 
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } 
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 86400000 
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      },
      redirect: '/exhibits'
    });

  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).json({ 
      success: false,
      error: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Внутренняя ошибка сервера'
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};