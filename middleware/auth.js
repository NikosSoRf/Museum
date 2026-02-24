const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.authenticate = async (req, res, next) => {
  try {
    //токен из кук
    const token = req.cookies?.authToken || 
                 req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Токен не найден. Заголовки:', req.headers);
      return res.status(401).json({ 
        success: false,
        error: 'Требуется авторизация' 
      });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не найден' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Ошибка аутентификации:', err.message);
    res.status(401).json({ 
      success: false,
      error: 'Недействительный токен' 
    });
  }
};

exports.checkAuth = (req, res, next) => {
  const publicRoutes = ['/login', '/api-docs', '/public'];
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  
  // Для API authenticate
  if (req.path.startsWith('/api')) {
    return exports.authenticate(req, res, next);
  }
  
  // Для веб-страниц куки
  if (!req.cookies?.authToken) {
    return res.redirect('/login');
  }
  
  next();
};