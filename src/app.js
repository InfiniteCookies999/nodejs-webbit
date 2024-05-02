const config = require('./config/env.config');
const createApp = require('./create.app');
const { sequelize } = require('./models');

(async () => {

  const app = createApp();
  
  try {
    await sequelize.authenticate();
    const shouldAlter = config.DATABASE_DEV_UPDATE || false;
    await sequelize.sync({ alter: shouldAlter });
  } catch (error) {
    console.log(error);
    return;
  }

  const port = config.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log('started express server');
  });

})();
