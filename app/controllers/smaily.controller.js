const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const {
    parent: Parent, children: Children, refreshToken: RefreshToken,
    connectToken: ConnectToken, lock: Lock, lock_app: Lock_App,
    lock_url: Lock_URL
} = db;
const Op = db.Sequelize.Op;
const config = require("../auth/auth.config");
const { nanoid } = require("nanoid");

exports.initialize = () => {
    // Admin user
    Parent.create({
        id: nanoid(10),
        name: "Yanuar",
        password: bcrypt.hashSync('$4dm1n5m4i1yP4reNt%', 10),
        email: 'admin@smaily.com',
        role: "admin",
    });
    // parent 1
    Parent.create({
        id: nanoid(10),
        name: "Budi Santoso",
        password: bcrypt.hashSync('BudiMhanx49', 10),
        email: 'budis49@smaily.com',
    }).then(parent => {
        Children.create({
            id: nanoid(10),
            parentId: parent.id
        })
            .then(async (user) => {
                let connectToken = await ConnectToken.createToken(user);
                Lock.create({
                    parentId: user.parentId,
                    childrenId: user.id
                }).then(data => {
                    Lock_App.create(
                        { name: 'Facebook', lockId: data.id }
                    );
                    Lock_URL.create(
                        { url: 'http://www.facebook.com', lockId: data.id }
                    );
                });
                console.log(`Parent ${parent.id} has registered and connected to their Child ${user.id}`);
            })
            .catch(err => { console.log(err); });
    })
        .catch(err => { console.log(err); });
    // parent 2
    Parent.create({
        id: nanoid(10),
        name: "Entis Sutisna",
        password: bcrypt.hashSync('.SeulK4n9!', 10),
        email: 'suleeee@smaily.com',
    }).then(parent => {
        Children.create({
            id: nanoid(10),
            parentId: parent.id
        })
            .then(async (user) => {
                let connectToken = await ConnectToken.createToken(user);
                let lock = await Lock.create({
                    parentId: user.parentId,
                    childrenId: user.id
                }).then(data => {
                    Lock_App.create(
                        { name: 'Instagram', lockId: data.id }
                    );
                    Lock_URL.create(
                        { url: 'http://www.instagram.com', lockId: data.id }
                    );
                });
                console.log(`Parent ${parent.id} has registered and connected to their Child ${user.id}`);
            })
            .catch(err => { console.log(err); });
    })
        .catch(err => { console.log(err); });
}

// To register / add children by parent
exports.registerChildren = (req, res) => {
    const id = req.params.id;
    Children.findOne({
        where: { parentId: id }
    }).then(data => {
        if (!data) {
            Children.create({
                id: nanoid(10),
                parentId: id
            })
                .then(async (user) => {
                    let connectToken = await ConnectToken.createToken(user);
                    res.status(201).send({
                        connectToken: connectToken
                    });
                })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else if (data) {
            Lock.findOne({
                where: { childrenId: data.id }
            }).then(found => {
                if (found) {
                    res.status(400).send({ message: "You cannot register more than one child!" });
                }
                else if (!found) {
                    ConnectToken.findOne({
                        where: { parentId: id }
                    }).then(token => {
                        if (token.expiryDate.getTime() > new Date().getTime()) {
                            res.status(400).send({
                                connectToken: token.token,
                                message: `Please try again in ${((token.expiryDate.getTime() - new Date().getTime()) / 1000).toFixed()} seconds`
                            });
                        } else if (token.expiryDate.getTime() < new Date().getTime()) {
                            Children.destroy({
                                where: { id: token.childrenId }
                            })
                            ConnectToken.destroy({
                                where: { id: token.id }
                            }).then(() => {
                                Children.create({
                                    id: nanoid(10),
                                    parentId: id
                                })
                                    .then(async (user) => {
                                        let connectToken = await ConnectToken.createToken(user);
                                        res.status(201).send({
                                            connectToken: connectToken
                                        });
                                    })
                                    .catch(err => { res.status(500).send({ message: err.message }) });
                            })
                                .catch(err => { res.status(500).send({ message: err.message }) });
                        }
                    })
                }
                else {
                    res.status(500).send({ message: 'Internal server error. Failed to register children' })
                }
            })
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// for Children to login to the app
exports.logInChildren = async (req, res) => {
    const connectToken = req.params.token;
    ConnectToken.findOne({ where: { token: connectToken } })
        .then(data => {
            Children.findOne({
                where: { id: data.childrenId }
            })
                .then(child => {
                    Lock.create({
                        parentId: child.parentId,
                        childrenId: child.id
                    }).then(locks => {
                        Lock_App.create({
                            lockId: locks.id
                        });
                        Lock_URL.create({
                            lockId: locks.id
                        })
                    })
                        .catch(err => { res.status(500).send({ message: err.message }) });
                    const token = jwt.sign({ id: child.id }, config.secret, {
                        expiresIn: config.jwtExpiration
                    });
                    if (child) {
                        res.send({
                            message: 'Children has been registered and connected to parent',
                            childrenId: child.id,
                            parentId: child.parentId,
                            accessToken: token
                        });
                    }
                    else {
                        res.send({ message: "Register failed" });
                    }
                })
                .catch(err => { res.status(500).send({ message: err.message }) });
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
};

// Register account for parents
exports.registerParent = (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        Parent.create({
            id: nanoid(10),
            name: name,
            email: email,
            password: bcrypt.hashSync(password, 10),
        }).then(user => {
            if (user) {
                res.status(201).send({
                    message: "Parent was registered successfully!",
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
            } else {
                res.send({ message: "Register failed." });
            }
        })
            .catch(err => { res.status(500).send({ message: err.message }) });
    } else {
        res.status(400).send({ message: "Register failed. Please fill in all the fields to register your account" })
    }
}

// For parents to log in to the app
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
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// When children open the app, they will be showed with these informations
exports.childrenMainPage = (req, res) => {
    const id = req.params.id;
    Children.findOne({
        where: { id: id }
    }).then(child => {
        ConnectToken.findOne({
            where: { childrenId: child.id }
        }).then(data => {
            if (data) {
                res.status(200).send({
                    id: id,
                    message: `Perangkat ini terhubung dengan perangkat orang tua dengan ID: ${child.parentId} melalui token ${data.token}. TERIMA KASIH`,
                })
            } else {
                res.status(404).send({
                    message: "Perangkat ini tidak terhubung ke mana pun. Mungkin token yang dimasukkan salah"
                })
            }
        })
            .catch(err => { res.status(500).send({ message: err.message }) });
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// Retrieve all parents from database.
exports.findAll = (req, res) => {
    const { page, size, email } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
    Parent.findAndCountAll({
        order: [['email', 'ASC']],
        where: condition, limit, offset,
        include: [{
            model: Children
        }]
    }).then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
};
// Find a single parent with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Parent.findOne({
        where: { id: id },
        include: [{
            model: Children,
            where: { parentId: id }
        }]
    })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
};

// Change user's password
exports.changePassword = (req, res) => {
    const id = req.params.id;
    const { password, newPassword } = req.body;
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
                        .catch(err => { res.status(500).send({ message: err.message }) });
                })
            } else {
                res.status(400).send({
                    message: "User ID was not found."
                })
            }
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
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
                .catch(err => { res.status(500).send({ message: err.message }) });
        })
    } else {
        res.status(404).send({
            message: "User ID was not found."
        })
    }
};

// Delete a user with the specified id in the request
exports.deleteOne = (req, res) => {
    const id = req.params.id;
    Parent.destroy({
        where: { id: id },
        include: [{
            model: Children,
            where: { parentId: id },
        }]
    })
        .then(data => {
            Children.destroy({
                where: { parentId: null }
            })
            res.status(200).send({
                message: `Parent User ${id} has been deleted along with the associated children account`
            });
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
    Parent.destroy({
        where: {},
        truncate: false
    })
        .then(parent => {
            Children.destroy({
                where: {},
                truncate: false
            })
            res.send({ message: `${parent} Parent and Child accounts were deleted successfully!` });
        })
        .catch(err => { res.status(500).send({ message: err.message }) });
};

// These informations will be shown to the account
exports.profile = (req, res) => {
    const id = req.params.id;
    Parent.findOne({
        where: { id: id }
    }).then(parent => {
        Children.findOne({
            where: { parentId: parent.id }
        }).then(child => {
            if (child) {
                res.status(200).send({
                    id: id,
                    name: parent.name,
                    email: parent.email,
                    children: child.id
                })
            } else {
                res.status(200).send({
                    id: id,
                    name: parent.name,
                    email: parent.email
                })
            }
        })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

// To retrieve new access token to access the app
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

// To retrieve lock statuses of children's applications
exports.getLockApp = (req, res) => {
    Lock.findOne({
        where: { childrenId: req.params.id }
    }).then(lock => {
        if (lock) {
            Lock_App.findAll({
                where: { lockId: lock.id },
                attributes: ['name', 'isLocked']
            }).then(data => {
                res.status(200).send(data)
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({ message: 'Lock not found' });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To retrieve URL lock statuses of children's browser
exports.getLockUrl = (req, res) => {
    Lock.findOne({
        where: { childrenId: req.params.id }
    }).then(lock => {
        if (lock) {
            Lock_URL.findAll({
                where: { lockId: lock.id },
                attributes: ['url', 'isLocked']
            }).then(data => {
                res.status(200).send(data)
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({ message: 'Lock not found' });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To set the lock for applications in children's device
exports.setLockApp = (req, res) => {
    Lock.findOne({
        where: { parentId: req.params.id }
    }).then(async (lock) => {
        if (lock) {
            Lock_App.findOne({
                where: { name: req.body.app, lockId: lock.id }
            }).then(found => {
                if (found && req.body.lock === found.isLocked) {
                    res.status(400).send({
                        message: `Application ${found.name} lock status remains the same`
                    });
                } else if (found && (req.body.lock == !found.isLocked)) {
                    Lock_App.update({
                        isLocked: req.body.lock
                    }, {
                        where: { id: found.id }
                    });
                    res.status(200).send({
                        message: `Application ${found.name} lock status has been updated`
                    });
                } else {
                    Lock_App.create({
                        name: req.body.app,
                        isLocked: req.body.lock,
                        lockId: lock.id
                    }).then(result => {
                        res.status(201).send({
                            message: `Application ${result.name} lock status has been updated`
                        });
                    })
                        .catch(err => { res.status(500).send({ message: err.message }) });
                }
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({
                message: `Lock not found`
            });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To set the lock for URLs in children's device
exports.setLockUrl = (req, res) => {
    Lock.findOne({
        where: { parentId: req.params.id }
    }).then(async (lock) => {
        if (lock) {
            Lock_URL.findOne({
                where: { url: req.body.url, lockId: lock.id }
            }).then(found => {
                if (found && req.body.lock === found.isLocked) {
                    res.status(400).send({
                        message: `URL ${found.url} lock status remains the same`
                    });
                } else if (found && (req.body.lock == !found.isLocked)) {
                    Lock_URL.update({
                        isLocked: req.body.lock
                    }, {
                        where: { id: found.id }
                    });
                    res.status(200).send({
                        message: `URL ${found.url} lock status has been updated`
                    });
                } else {
                    Lock_URL.create({
                        url: req.body.url,
                        isLocked: req.body.lock,
                        lockId: lock.id
                    }).then(result => {
                        res.status(201).send({
                            message: `URL ${result.url} lock status has been updated`
                        });
                    })
                        .catch(err => { res.status(500).send({ message: err.message }) });
                }
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({
                message: `Lock not found`
            });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To delete the lock for an application on children's device
exports.deleteLockApp = (req, res) => {
    Lock.findOne({
        where: { parentId: req.params.id }
    }).then(lock => {
        if (lock) {
            Lock_App.findOne({
                where: { name: req.body.app, lockId: lock.id }
            }).then(found => {
                if (found) {
                    Lock_App.destroy({
                        where: { id: found.id }
                    })
                    res.status(200).send({ message: `Lock for application ${req.body.app} has been deleted` });
                } else {
                    res.status(404).send({ message: `Cannot found lock for application ${req.body.app}, cannot delete` });
                }
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({ message: 'Lock not found' });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To delete the lock for a URL on children's device
exports.deleteLockUrl = (req, res) => {
    Lock.findOne({
        where: { parentId: req.params.id }
    }).then(lock => {
        if (lock) {
            Lock_URL.findOne({
                where: { url: req.body.url, lockId: lock.id }
            }).then(found => {
                if (found) {
                    Lock_URL.destroy({
                        where: { id: found.id }
                    })
                    res.status(200).send({ message: `Lock for URL ${req.body.url} has been deleted` });
                } else {
                    res.status(404).send({ message: `Cannot found lock for URL ${req.body.url}, cannot delete` });
                }
            })
                .catch(err => { res.status(500).send({ message: err.message }) });
        } else {
            res.status(404).send({ message: 'Lock not found' });
        }
    })
        .catch(err => { res.status(500).send({ message: err.message }) });
}

// To show the data in pages
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, users, totalPages, currentPage };
};

// For pagination
const getPagination = (page, size) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
