const db = require("../models");
const Parent = db.parent;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Name
  if (req.body.name == 'admin') {
    res.status(400).send({
      message: "Register failed. Name must not contain admin word!"
    })
  }
  // Email
  Parent.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;