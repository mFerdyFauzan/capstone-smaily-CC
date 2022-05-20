const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.smaily;
const Op = db.Sequelize.Op;
const { nanoid } = require("nanoid");
const jwtSecret = 'cd7144f9d2ed622fcc1712d47c1626424a076bb915fc0f038b84a1c2fa4aaebdb51ed2'

exports.initial = async (req, res) => {
    db.smaily.create({
        id: nanoid(10),
        username: "Admin",
        password: '$2a$10$8AsfA1NtP.tKWHSxzqVppOGjPQpuDFEGysCF/0j.0wEcdp9Hl1xDm',
        email: 'admin@smaily.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    })
        .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign({
                id: user._id, role: user.role
            }, jwtSecret, {
                expiresIn: maxAge
            });
            res.cookie("jwt", token, {
                maxAge: maxAge * 1000
            });
        })
}
// Create and Save a new Tutorial
exports.register = async (req, res, next) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Please fill all the necessary field"
        });
        return;
    }
    // Create a Tutorial
    const { username, password, email } = req.body;
    const id = nanoid(10);
    // Save Tutorial in the database
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            id,
            username,
            password: hash,
            email
        })
            .then((user) => {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign({
                    id: user._id, username, email, role: user.role
                }, jwtSecret, {
                    expiresIn: maxAge
                });
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000
                });
                res.status(201).send({
                    message: "Register successful",
                    user: user._id
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while registering user."
                });
            });
    })
};

exports.logIn = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).send({
            message: "Please enter your username"
        })
    } else if (!password) {
        return res.status(400).send({
            message: "Please enter your password"
        })
    } /*else if ((!username || !email) && !password) {
        return res.status(400).send({
            message: "Please enter your login credential correctly"
        })
    }
    */
    try {
        const user = await User.findOne({ where: { username: username } })
        if (user === null) {
            res.status(400).send({
                message: "Login failed cok",
                error: "User not found"
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign({
                        id: user._id, username, role: user.role
                    }, jwtSecret, {
                        expiresIn: maxAge
                    });
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    });
                    res.status(201).send({
                        message: "Login successful",
                        user: user._id
                    });
                    //res.redirect("/profile");
                } else {
                    res.status(400).send({ message: "Login Failed " });
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "An error occured during login process",
            error: error.message
        })
    }
}
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const { page, size, username } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;
    User.findAndCountAll({
        where: condition, limit, offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
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
    const { password, role } = req.body;
    if (id) {
        if (!password && role !== "admin") {
            User.update(req.body, {
                where: { id: id }
            })
                .then(user => {
                    if (user == 1) {
                        res.status(201).send({
                            message: "Update Successful."
                        });
                    } else {
                        res.status(400).send({
                            message: `Cannot update user with id=${id}. Maybe the req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating user with id=" + id,
                        err: err.message
                    });
                });
        } else if (password && role !== "admin") {
            bcrypt.hash(password, 10).then(async (hash) => {
                User.update({
                    password: hash,
                    role: role
                }, {
                    where: { id: id }
                })
                    .then(user => {
                        if (user == 1) {
                            res.status(201).send({
                                message: "Update Successful."
                            });
                        } else {
                            res.status(400).send({
                                message: `Cannot update user with id=${id}. Maybe the req.body is empty!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating user with id=" + id,
                            err: err.message
                        });
                    });
            })
        }
    }
    else {
        res.status(400).send({
            message: "User ID was not found."
        })
    }
};
// Delete a Tutorial with the specified id in the request
exports.deleteOne = (req, res) => {
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

exports.profile = (req, res) => {
    const username = req.body.username;
    User.findOne({ where: { username: username } })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find user with username=${username}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving user with id=" + username
            });
        });
    /*if (user === null) {
res.status(400).send({
message: "Login failed cok",
error: "User not found"
})
} */
}

exports.logOut = (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" });
    res.redirect("/");
}
// Find all users by username

exports.findByRole = (req, res) => {
    const { page, size, role } = req.query;
    const { limit, offset } = getPagination(page, size);
    User.findAndCountAll({
        where: { role: { [Op.like]: `%${role}%` }, limit, offset }
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, users, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};