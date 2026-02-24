const express = require('express');
const router = express.Router();
const exhibitController = require('../controllers/exhibitController');

// Веб-интерфейс маршруты
router.get('/', exhibitController.showHomePage); // Главная страница с каталогом 
router.get('/add', exhibitController.showAddForm); // Форма добавления 
router.get('/:id/edit', exhibitController.showEditForm); // Форма редактирования 
router.post('/', exhibitController.createExhibit); 
router.put('/:id', exhibitController.updateExhibit); // обновление
router.delete('/:id', exhibitController.deleteExhibit);


module.exports = router;