const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then((user) => {

      const token = jwt.sign(
        {id: user.id}
        ,config.secret, 
        {expiresIn: 86400 // 24 hours
        });
      if (user)
        res.cookie("token", token, {
          httpOnly: true
        }).send({ message: "User registered successfully!" });
      })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({where: { email: req.body.email}})
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret);

      if (user)
        res.cookie("token", token, { 
          httpOnly: true
        }).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
  res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    }).send();
};
