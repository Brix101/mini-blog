const db = require("../models");
const Article = db.article;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");


exports.create = (req, res) => {
  // Validate request
  if (!req.body.cover_photo||!req.body.title||!req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.secret);  
  var _userId = decoded.id  


  const article = {
    userId:_userId,
    cover_photo: req.body.cover_photo,
    title: req.body.title,
    description: req.body.description
  };


  Article.create(article)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message});
    });
};


exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Article.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message});
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Article.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message});
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Article.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Article was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Article with id=${id}. Maybe Article was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Article with id=" + id 
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Article.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Article was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Article with id=" + id
      });
    });
};


exports.deleteAll = (req, res) => {
  Article.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Article were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Article."
      });
    });
};


