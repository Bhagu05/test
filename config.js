module.exports = {
  development: {
      username: 'root',
      password: 'Boston@2023',
      database: 'assignment3',
      host: 'localhost',
      dialect: 'mysql2'
    },
    production: {
      use_env_variable: 'jdbc:mysql://localhost'
    }
  };
  