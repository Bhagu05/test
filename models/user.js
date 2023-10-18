// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");

module.exports = (sequelize) => {
  const User = sequelize.define('user', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Make sure to define this as the primary key
      autoIncrement: true, // If you want auto-increment behavior
    },


    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure emails are unique
      validate: {
        isEmail: true, // Validate that email addresses are in the correct format
      },
  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    primaryKey: 'id', // Specify the custom primary key
  }

    
  );


  User.associate = (models) => {
    User.hasMany(models.assignment, {
      foreignKey: 'id',
      as: 'assignment',
    });
  };

  return User;
};

