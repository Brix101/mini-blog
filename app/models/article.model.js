module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("article", {
      userId: {
        type: Sequelize.INTEGER
      },
      cover_photo: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    });
  
    return Article;
  };
  