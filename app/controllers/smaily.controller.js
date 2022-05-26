const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { parent: Parent, children: Children, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;
const config = require("../auth/auth.config");
const { nanoid } = require("nanoid");
const req = require("express/lib/request");
const res = require("express/lib/response");

exports.initialize = () => {
    /*
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
    */
    /*
    const token1 = nanoid(5);
    const token2 = nanoid(5);
    const token3 = nanoid(5); */
    Parent.create({
        id: nanoid(10),
        name: "Admin",
        password: bcrypt.hashSync('$4dm1n5m4i1yP4reNt%', 10),
        email: 'admin@smaily.com',
        role: "admin",
        //token: token1
    });
    Parent.create({
        id: nanoid(10),
        name: "Budi Santoso",
        password: bcrypt.hashSync('BudiMhanx49', 10),
        email: 'budis49@smaily.com',
    }).then(user => {
        Children.create({
            id: nanoid(10),
            /*
            username: "Admin",
            password: bcrypt.hashSync('4dm1n5m4i1yChi1DreN', 10),
            email: 'admin@smaily.com',
            role: "admin",
            */
            parentId: user.id
        }).then(child => {
            console.log(`Parent ${user.id} is connected to Child ${child.id}`);
        })
    }).catch(err => {
        console.log(err);
    });
    Parent.create({
        id: nanoid(10),
        name: "Entis Sutisna",
        password: bcrypt.hashSync('.SeulK4n9!', 10),
        email: 'suleeee@smaily.com',
    }).then(user => {
        Children.create({
            id: nanoid(10),
            /*
            username: "Admin",
            password: bcrypt.hashSync('4dm1n5m4i1yChi1DreN', 10),
            email: 'admin@smaily.com',
            role: "admin",
            */
            parentId: user.id
        }).then(child => {
            console.log(`Parent ${user.id} is connected to Child ${child.id}`);
        })
    }).catch(err => {
        console.log(err);
    });
    /*
        .then(user => {
            // user role = 3
            user.setRoles([3]);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
        */
}

// Create and Save a new Tutorial
exports.registerChildren = (req, res) => {
    Parent.findOne({ where: { id: req.params.id } })
        .then(parent => {
            Children.create({
                id: nanoid(10),
                parentId: parent.id
                /*
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10) */
            }).then(children => {
                if (children) {
                    res.send({ message: `Children ${children.id} is registered and connected to parent ${parent.id}` });
                }
                else {
                    res.send({ message: "Register failed" });
                }
            })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    /*
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
        */
};

exports.registerParent = (req, res) => {
    // Save User to Database
    const { name, email, password } = req.body;
    if (name && email && password) {
        Parent.create({
            id: nanoid(10),
            name: name,
            email: email,
            password: bcrypt.hashSync(password, 10),
        }).then(user => {
            if (user) {
                //user.setRoles([2]).then(() => {
                res.status(201).send({
                    message: "Parent was registered successfully!",
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
                //});
            } else {
                res.send({ message: "Register failed." });
            }
        })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Register failed. Please fill in all the fields to register your account" })
    }
}

exports.logIn = async (req, res, next) => {
    Parent.findOne({
        where: {
            email: req.body.email
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
            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: token,
                refreshToken: refreshToken
            });
            /*
            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                
            });
            */
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

// Retrieve all Tutorials from the database.
/*
exports.findAll = (req, res) => {
    const { page, size, email } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
    Parent.findAndCountAll({
        order: [['email', 'ASC']],
        where: condition, limit, offset
    })
        .then(user => {
            const userList = [];
            const { id } = user;
            userList = id
            Children.findAndCountAll({
                order: [['id', 'ASC']],
                where: id, limit, offset
            }).then(data => {
                const response = getPagingData(data, page, limit);
                res.send(response);
            })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving email."
            });
        });
};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Parent.findByPk(id)
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
*/
// Change user's password
exports.changePassword = (req, res) => {
    const id = req.params.id;
    const password = req.body.password
    const newPassword = req.body.newpassword;
    Parent.findOne({ where: { id: id } })
        .then(user => {
            if (id) {
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        message: "Invalid Password! Cannot change your password"
                    });
                }
                bcrypt.hash(newPassword, 10).then(async (hash) => {
                    Parent.update({
                        password: hash
                    }, {
                        where: { id: id }
                    })
                        .then(success => {
                            if (success == 1) {
                                res.status(201).send({
                                    message: "Your password has been changed."
                                });
                            } else {
                                res.status(400).send({
                                    message: "Password change failed! Please try again"
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error changing password of user with id=" + id,
                                err: err.message
                            });
                        });
                })
            } else {
                res.status(400).send({
                    message: "User ID was not found."
                })
            }
        })

}

// Update a user by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const { name, email, password, role } = req.body;
    if (id) {
        bcrypt.hash(password, 10).then(async (hash) => {
            Parent.update({
                name: name,
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
                            name: user.name,
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
    Parent.destroy({
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
    Parent.destroy({
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
    const id = req.params.id;
    Parent.findOne({ where: { id: id } })
        .then(parent => {
            if (parent) {
                Children.findOne({ where: { parentId: parent.id } })
                    .then(children => {
                        if (children) {
                            res.status(200).send({
                                id: parent.id,
                                name: parent.name,
                                email: parent.email,
                                childrenId: children.id
                            })
                        }
                        else {
                            res.status(200).send({
                                id: parent.id,
                                name: parent.name,
                                email: parent.email
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(404).send({ message: "Parent id not found" });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
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
        if (!refreshToken) {
            res.status(404).json({ message: "Refresh token is not in database!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        const user = await refreshToken.getParent();
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
/*
exports.createHistory = (req, res) => {
    const username = req.body.username;
    User.findOne({ where: { username: username } })
        .then(user => {
            if (user) {
                const history = History.create({
                    url: req.body.url,
                    userId: user.id
                })
                res.status(201).send({
                    message: `New history has been added for user ${req.body.username}`,
                    url: history.url,
                    userId: history.userId
                });
            } else {
                res.status(404).send({
                    message: `Cannot find user with username=${username}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

exports.createComment = (req, res) => {
    const username = req.body.username;
    User.findOne({ where: { username: username } })
        .then(user => {
            if (user) {
                History.findOne({
                    where: { userId: user.id }
                }).then(histories => {
                    if (histories) {
                        const comment = Comment.create({
                            text: req.body.text,
                            userId: user.id,
                            historyId: histories.id
                        })
                        res.status(201).send({
                            message: `User ${username} has commented on ${histories.url}`,
                            comment
                        })
                    }
                    else {
                        res.status(404).send({
                            message: "History does not exist. Cannot make comment."
                        })
                    }
                })
            } else {
                res.status(404).send({
                    message: `Cannot find user with username=${username}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

exports.findHistoryById = (req, res) => {
    const username = req.body.username;
    User.findOne({ where: { username: username } })
        .then(user => {
            if (user) {
                History.findOne({
                    where: { userId: user.id }
                }).then(histories => {
                    res.status(200).send(histories);
                })
            } else {
                res.status(404).send({
                    message: `Cannot find user with username=${username}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

exports.findCommentById = (id) => {
    return Comment.findByPk(id, { include: ["history"] })
        .then((comment) => {
            return comment;
        })
        .catch((err) => {
            console.log("Error while finding comment: ", err);
        })
}

exports.findAllHistoryWithComments = () => {
    return History.findAll({ include: ["comment"] })
        .then((history) => {
            return history;
        });
};
*/
