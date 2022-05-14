const db = require("../models");
const User = db.smaily;
const Op = db.Sequelize.Op;
// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Please fill all the necessary field"
        });
        return;
    }
    // Create a Tutorial
    const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };
    // Save Tutorial in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while registering user."
            });
        });
};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;
    User.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving username."
            });
        });
};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find user with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving user with id=" + id
            });
        });
};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "user was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete user with id=${id}. Maybe user was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
// Find all published Tutorials
/*
exports.findAllPublished = (req, res) => {
    Smaily.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

*/