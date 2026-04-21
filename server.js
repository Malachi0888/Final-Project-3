require('dotenv').config();
const app = require('./app');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.sync();

    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin created: admin@example.com / Admin123!');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
