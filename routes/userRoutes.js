const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllUsers, getUserById } = require('../controllers/userController');

router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
