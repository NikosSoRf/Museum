const { Exhibit } = require('../models');
const { Op } = require('sequelize');


const translateCollectionType = (type) => {
  const types = {
    'painting': 'Картина',
    'sculpture': 'Скульптура',
    'artifact': 'Артефакт',
    'document': 'Документ',
    'other': 'Другое'
  };
  return types[type] || type;
};

// Валидация данных экспоната
const validateExhibitData = (data) => {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Название должно содержать минимум 2 символа');
  }
  if (!data.creationDate || isNaN(new Date(data.creationDate).getTime())) {
    errors.push('Укажите корректную дату создания');
  }
  return errors;
};

// Получить все экспонаты
exports.getAllExhibits = async (req, res) => {
  try {
    const { collectionType, isOnDisplay, author, search, sortBy } = req.query;
    const where = {};
    const order = [];
    
    // Фильтрация
    if (collectionType) where.collectionType = collectionType;
    if (isOnDisplay) where.isOnDisplay = isOnDisplay === 'true';
    
    if (author) {
      where.author = { 
        [Op.iLike]: `%${author}%` 
      };
    }
    
    // Поиск по нескольким полям
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Сортировка
    if (sortBy) {
      sortBy.split(',').forEach(sortField => {
        const [field, direction] = sortField.startsWith('-') 
          ? [sortField.substring(1), 'DESC'] 
          : [sortField, 'ASC'];
        order.push([field, direction]);
      });
    } else {
      order.push(['name', 'ASC']);
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: exhibits } = await Exhibit.findAndCountAll({ 
      where, 
      order,
      limit,
      offset
    });
    
    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: exhibits
    });
    
  } catch (err) {
    console.error('Ошибка при получении экспонатов:', err);
    res.status(500).json({ 
      error: 'Произошла ошибка при загрузке экспонатов',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};



// Получить один экспонат по ID
exports.getExhibitById = async (req, res) => {
  try {
    const exhibit = await Exhibit.findByPk(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ error: 'Экспонат не найден' });
    }
    res.json(exhibit);
  } catch (err) {
    console.error('Ошибка при получении экспоната:', err);
    res.status(500).json({ 
      error: 'Произошла ошибка при загрузке экспоната',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

//функция для определения API запроса
function isApiRequest(req) {
  return (
    req.path.startsWith('/api') ||
    req.get('Accept') === 'application/json' || 
    req.get('Content-Type') === 'application/json' || 
    req.xhr 
  );
}
// Создать новый экспонат
exports.createExhibit = async (req, res) => {
  try {
    const errors = validateExhibitData(req.body);
    if (errors.length > 0) {
      if (isApiRequest(req)) {
        return res.status(400).json({ errors });
      }
      return res.render('add-exhibit', {
        title: 'Добавить экспонат',
        activePage: 'add',
        exhibit: req.body,
        errors
      });
    }
    
    const exhibitData = {
      ...req.body,
      isOnDisplay: req.body.isOnDisplay === 'on' ? 1 : 0,
      addedAt: new Date()
    };
    
    const newExhibit = await Exhibit.create(exhibitData);

    if (isApiRequest(req)) {
      return res.status(201).json(newExhibit);
    }
    return res.redirect('/exhibits');

  } catch (err) {
    console.error('Ошибка при создании экспоната:', err);
    
    if (isApiRequest(req)) {
      return res.status(500).json({ 
        error: 'Не удалось создать экспонат',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    return res.render('add-exhibit', {
      title: 'Добавить экспонат',
      activePage: 'add',
      exhibit: req.body,
      errors: [err.message]
    });
  }
};

// Обновить экспонат
exports.updateExhibit = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      if (isApiRequest(req)) {
        return res.status(400).json({ error: 'Некорректный ID экспоната' });
      }
      return res.redirect('/exhibits');
    }

    const errors = validateExhibitData(req.body);
    if (errors.length > 0) {
      if (isApiRequest(req)) {
        return res.status(400).json({ errors });
      }
      return res.render('edit-exhibit', {
        title: 'Редактировать экспонат',
        activePage: 'edit',
        exhibit: req.body,
        errors
      });
    }

    const exhibit = await Exhibit.findByPk(id);
    if (!exhibit) {
      if (isApiRequest(req)) {
        return res.status(404).json({ error: 'Экспонат не найден' });
      }
      return res.redirect('/exhibits');
    }

    const [updated] = await Exhibit.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      if (isApiRequest(req)) {
        return res.status(500).json({ error: 'Обновление не выполнено' });
      }
      return res.redirect('/exhibits');
    }
    
    if (isApiRequest(req)) {
      const updatedExhibit = await Exhibit.findByPk(id);
      return res.json(updatedExhibit);
    }
    return res.redirect('/exhibits');

  } catch (err) {
    console.error('Ошибка обновления:', err);
    
    if (isApiRequest(req)) {
      return res.status(500).json({ 
        error: 'Не удалось обновить экспонат',
        details: err.message
      });
    }
    return res.redirect(`/exhibits/${req.params.id}/edit?error=server_error`);
  }
};
// Удалить экспонат
exports.deleteExhibit = async (req, res) => {
  try {
    const deleted = await Exhibit.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Экспонат не найден' });
    }
    
    res.json({ success: true }); 
    
  } catch (err) {
    console.error('Ошибка при удалении:', err);
    res.status(500).json({ 
      error: 'Не удалось удалить экспонат',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Отобразить главную страницу
exports.showHomePage = async (req, res) => {
  try {
    const { search, collectionType } = req.query;
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (collectionType) {
      where.collectionType = collectionType;
    }
    
    const exhibits = await Exhibit.findAll({ 
      where,
      order: [['name', 'ASC']],
      limit: 100
    });
    
    // Список доступных категорий для фильтра
    const collectionTypes = [
      { value: 'painting', label: 'Картины' },
      { value: 'sculpture', label: 'Скульптуры' },
      { value: 'artifact', label: 'Артефакты' },
      { value: 'document', label: 'Документы' },
      { value: 'other', label: 'Другое' }
    ];
    
    res.render('index', { 
      title: 'Каталог экспонатов',
      activePage: 'home',
      exhibits,
      searchQuery: search,
      selectedCollectionType: collectionType, 
      collectionTypes,
      translateCollectionType
    });
  } catch (err) {
    console.error('Ошибка при загрузке главной страницы:', err);
    res.status(500).render('error', { 
      error: 'Произошла ошибка при загрузке данных',
      message: 'Пожалуйста, попробуйте позже'
    });
  }
};

// Получить экспонаты по категории
exports.getExhibitsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const validCategories = ['painting', 'sculpture', 'artifact', 'document', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Недопустимая категория',
        validCategories
      });
    }

    const { count, rows: exhibits } = await Exhibit.findAndCountAll({
      where: { collectionType: category },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      category,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: exhibits
    });

  } catch (err) {
    console.error('Ошибка при получении экспонатов по категории:', err);
    res.status(500).json({ 
      error: 'Произошла ошибка при загрузке экспонатов',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
// Показать форму добавления
exports.showAddForm = (req, res) => {
  res.render('add-exhibit', { 
    title: 'Добавить экспонат',
    activePage: 'add',
    exhibit: null,
    errors: null
  });
};

// Показать форму редактирования
exports.showEditForm = async (req, res) => {
  try {
    const exhibit = await Exhibit.findByPk(req.params.id);
    if (!exhibit) {
      return res.status(404).render('error', { 
        error: 'Экспонат не найден',
        message: 'Запрошенный экспонат не существует'
      });
    }
    
    res.render('edit-exhibit', { 
      title: 'Редактировать экспонат',
      activePage: 'edit',
      exhibit,
      errors: null
    });
  } catch (err) {
    console.error('Ошибка при загрузке формы редактирования:', err);
    res.status(500).render('error', { 
      error: 'Произошла ошибка',
      message: 'Не удалось загрузить данные для редактирования'
    });
  }
};