const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('assignment3', 'root', 'Boston@2023', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
});

module.exports = sequelize;
const user = require('./models/user')(sequelize); 
const assignment = require('./models/assignment')(sequelize);


fs.createReadStream('users.csv') // Replace 'user_data.csv' with the path to your CSV file
  .pipe(csv())
  .on('data', async (row) => {
    // Create a new User record
    const hashedPassword = await bcrypt.hash(row.password, 10); // Use bcrypt to hash the password  
    await user.create({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      password: hashedPassword
    });

    // Create Assignments for the User if needed


    // Repeat the Assignment creation process for other assignments, if any
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
