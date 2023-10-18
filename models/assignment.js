// models/assignment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Assignment = sequelize.define('assignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Make sure to define this as the primary key
      autoIncrement: true, // If you want auto-increment behavior
    },

    ass_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: false, // Make sure to define this as the primary key
      autoIncrement: false, // If you want auto-increment behavior
    },
  }
  );

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.user, {
      foreignKey: 'id',
      as: 'user',
    });
  };

  return Assignment;
};
