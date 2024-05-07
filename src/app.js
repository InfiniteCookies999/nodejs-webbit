const config = require('./config/env.config');
const createApp = require('./create.app');
const db = require('./models');

(async () => {

  const app = createApp();
  
  try {
    db.initialize();
    await db.sequelize.authenticate();
    const shouldAlter = config.DATABASE_DEV_UPDATE || false;
    await db.sequelize.sync({ alter: shouldAlter });
  } catch (error) {
    console.log(error);
    return;
  }

  const port = config.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log('started express server');
  });

})();
