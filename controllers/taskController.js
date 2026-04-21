const { Task, Category } = require('../models');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, categoryId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (req.user.role !== 'admin' && category.userId !== req.user.id) {
        return res.status(403).json({ message: 'Cannot assign task to another user\'s category' });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      dueDate: dueDate || null,
      categoryId: categoryId || null,
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { status, categoryId, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }
    if (status) {
      whereClause.status = status;
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const offset = (pageNumber - 1) * pageLimit;

    const { count, rows } = await Task.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      limit: pageLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalTasks: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageLimit),
      tasks: rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, dueDate, categoryId } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (req.user.role !== 'admin' && category.userId !== req.user.id) {
        return res.status(403).json({ message: 'Cannot assign task to another user\'s category' });
      }
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.dueDate = dueDate ?? task.dueDate;
    task.categoryId = categoryId ?? task.categoryId;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
