const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && Number(req.user.id) !== Number(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
