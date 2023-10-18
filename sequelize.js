const Sequelize = require('sequelize');
const sequelize = new Sequelize('assignment3', 'root', 'Boston@2023', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = require('./models/user')(sequelize); 
const Assignment = require('./models/assignment')(sequelize);

module.exports = sequelize;


// Now, you can use User and Assignment models for database operations
