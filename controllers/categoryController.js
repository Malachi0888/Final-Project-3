const { Category } = require('../models');

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      name,
      userId: req.user.id
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const whereClause = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const categories = await Category.findAll({ where: whereClause });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role !== 'admin' && category.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    category.name = req.body.name || category.name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role !== 'admin' && category.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
