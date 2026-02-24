const express = require('express');
const router = express.Router();
const exhibitController = require('../controllers/exhibitController');

/**
 * @swagger
 * tags:
 *   name: Exhibits
 *   description: REST API for museum exhibits
 */

/**
 * @swagger
 *  /exhibits/:
 *   get:
 *     summary: Вывод списка всех экспонатов
 *     tags: [Exhibits API]
 *     
 *     responses:
 *       200:
 *         description: The list of exhibits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exhibit'
 */
router.get('/', exhibitController.getAllExhibits);

/**
 * @swagger
 *  /exhibits/{id}:
 *   get:
 *     summary: Вывод экспоната по его id
 *     tags: [Exhibits API]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exhibit id
 *     responses:
 *       200:
 *         description: The exhibit description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exhibit'
 *       404:
 *         description: The exhibit was not found
 */
router.get('/:id', exhibitController.getExhibitById); 

/**
 * @swagger
 *  /exhibits/:
 *   post:
 *     summary: Создание нового экспоната
 *     tags: [Exhibits API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exhibit'
 *     responses:
 *       201:
 *         description: The exhibit was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exhibit'
 *       400:
 *         description: Bad request (validation error)
 */
router.post('/', exhibitController.createExhibit); 

/**
 * @swagger
 *  /exhibits/{id}:
 *   put:
 *     summary: Обновление экспоната по id
 *     tags: [Exhibits API]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exhibit id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exhibit'
 *     responses:
 *       200:
 *         description: The exhibit was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exhibit'
 *       404:
 *         description: The exhibit was not found
 *       400:
 *         description: Bad request (validation error)
 */
router.put('/:id', exhibitController.updateExhibit); 

/**
 * @swagger
 *  /exhibits/{id}:
 *   delete:
 *     summary: Удаление экспоната по id
 *     tags: [Exhibits API]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exhibit id
 *     responses:
 *       200:
 *         description: The exhibit was deleted
 *       404:
 *         description: The exhibit was not found
 */
router.delete('/:id', exhibitController.deleteExhibit); 
/**
 * @swagger
 *  /exhibits/category/{category}:
 *   get:
 *     summary: Вывод экспонатов по фильтру категорий
 *     tags: [Exhibits API]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *           enum: [painting, sculpture, artifact, document, other]
 *         required: true
 *         description: Category name or ID to filter by 
 *       - in: query
 *         name: isOnDisplay
 *         schema:
 *           type: boolean
 *         description: Filter by display status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g., "name,-creationDate")
 *     responses:
 *       200:
 *         description: List of exhibits in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exhibit'
 *       404:
 *         description: No exhibits found in this category
 */
router.get('/category/:category', exhibitController.getExhibitsByCategory);

module.exports = router;