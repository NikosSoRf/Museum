const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
const { sequelize } = require('./models');
const { authenticate, checkAuth } = require('./middleware/auth');

if (!process.env.JWT_SECRET) {
  console.error('ОШИБКА: JWT_SECRET не задан в .env файле');
  process.exit(1);
}

const app = express();


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(checkAuth);
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const apiExhibitsRouter = require('./routes/apiexhibits');
app.use('/api/exhibits', apiExhibitsRouter);


const exhibitsRouter = require('./routes/exhibits');
app.use('/exhibits', exhibitsRouter);


app.get('/', (req, res) => {
  res.redirect(req.cookies.authToken ? '/exhibits' : '/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Вход для кураторов', error: req.query.error });
});

app.get('/logout', (req, res) => {
  res.clearCookie('authToken').redirect('/login');
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


sequelize.sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`Документация API: http://localhost:${PORT}/api-docs`);
      console.log(`Страница входа: http://localhost:${PORT}/login`);
    });
  })
  .catch(err => console.error('Ошибка базы данных:', err));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    error: 'Ошибка сервера',
    message: 'Попробуйте позже'
  });
});