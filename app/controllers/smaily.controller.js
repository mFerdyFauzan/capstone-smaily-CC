const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken, comment: Comment, history: History } = db;
const Op = db.Sequelize.Op;
const config = require("../auth/auth.config");
const { nanoid } = require("nanoid");

exports.initialize = async (req, res) => {
    Role.create({
        id: 1,
        name: "children"
    });

    Role.create({
        id: 2,
        name: "parent"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
    User.create({
        id: nanoid(10),
        username: "Admin",
        password: bcrypt.hashSync('4dm1n5m4i1y', 10),
        email: 'admin@smaily.com',
        createdAt: new Date(),
        updatedAt: new Date()
    })
        .then(user => {
            // user role = 3
            user.setRoles([3]);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

// Create and Save a new Tutorial
exports.registerChildren = (req, res) => {
    // Save User to Database
    User.create({
        id: nanoid(10),
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
        .then(user => {
            if (req.body.username && req.body.email && req.body.password) {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
            else {
                res.send({ message: "Please fill in the required fields " });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.registerParent = (req, res) => {
    // Save User to Database
    User.create({
        id: nanoid(10),
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
        .then(user => {
            if (req.body.username && req.body.email && req.body.password) {
                user.setRoles([2]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.logIn = async (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(async (user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration // 24 hours
            });
            let refreshToken = await RefreshToken.createToken(user);
            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const { page, size, username } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;
    User.findAndCountAll({
        order: [['username', 'ASC']],
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
// Change user's password
exports.changePassword = (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.password;
    if (id) {
        bcrypt.hash(newPassword, 10).then(async (hash) => {
            User.update({
                password: hash
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
    } else {
        res.status(400).send({
            message: "User ID was not found."
        })
    }
}

// Update a user by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const { email, password, role } = req.body;
    if (id) {
        bcrypt.hash(password, 10).then(async (hash) => {
            User.update({
                email: email,
                password: hash,
                role: role
            }, {
                where: { id: id }
            })
                .then(user => {
                    if (user == 1) {
                        res.status(201).send({
                            message: "Update Successful.",
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role
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
    } else {
        res.status(400).send({
            message: "User ID was not found."
        })
    }
};
// Delete a user with the specified id in the request
exports.deleteOne = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
    })
        .then(user => {
            if (user == 1) {
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

// Delete all users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(user => {
            res.send({ message: `${user} Users were deleted successfully!` });
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
                res.send({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                });
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
}

exports.logOut = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
        console.log(refreshToken)
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database! User hal aready been logged out!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });
            res.status(200).json({
                message: "You have been logged out",
            });
            return;
        }
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
        console.log(refreshToken)
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
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