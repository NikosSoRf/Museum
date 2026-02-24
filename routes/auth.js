const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация куратора
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 redirect:
 *                   type: string
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
router.get('/users/:id', authController.getUserById);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - fullName
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Автоинкрементный ID пользователя
 *           example: 1
 *         username:
 *           type: string
 *           description: Уникальное имя пользователя
 *           example: "museum_curator"
 *         password:
 *           type: string
 *           format: password
 *           description: Хешированный пароль
 *           example: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
 *         fullName:
 *           type: string
 *           description: Полное имя пользователя
 *           example: "Иванов Иван Иванович"
 *       example:
 *         id: 1
 *         username: "museum_curator"
 *         password: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
 *         fullName: "Иванов Иван Иванович"
 */