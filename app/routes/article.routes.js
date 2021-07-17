const articles = require("../controllers/article.controller.js");
const authJwt = require("../middleware/authJwt");

module.exports = app => {


  var router = require("express").Router();

  router.post("/",authJwt.verifyToken, articles.create);

  router.get("/", articles.findAll);

  router.get("/:id", articles.findOne);

  router.put("/:id",authJwt.verifyToken, articles.update);

  router.delete("/:id",authJwt.verifyToken, articles.delete);

  app.use("/api/articles", router);
};
