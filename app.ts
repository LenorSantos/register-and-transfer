import express from "express";
import { Sequelize, DataTypes, Op} from "sequelize";
const app = express();
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

app.use(cors());
app.use(express.json());
const port: number = 3001;
const secretkey: string = "12345";

// Sequelize('DB name', 'user', 'pass')
const sequelize = new Sequelize('', '', '', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    accountId: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false
});

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false
});

const Transactions = sequelize.define('Transactions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    debitedAccountId: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creditedAccountId: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: false
});

function checktoken(req: express.Request, res: express.Response, next: express.NextFunction) {
    interface datatoken {
        decodedtoken: any
    }
    const token = req.headers.token;
    jwt.verify(`${token}`, secretkey, (err, decoded) => {
        const datatoken: datatoken = {
            decodedtoken: decoded
        }
        if (!decoded) {
            res.status(401).end();
        } else {
            Users.findAll({
                raw: true,
                where: { id: datatoken.decodedtoken.id },
                attributes: ["username"]
            }).then((out: any[]) => {
                res.locals.decodedtoken = out[0].username;
                next();
            }).catch(err => {
                res.status(500).end("internal error");
            });
        }
    });
}

app.post("/cadastro", (req, res) => {
    interface insert {
        user: string;
        pass: string;
    }
    const insert: insert = {
        user: req.body.user, 
        pass: req.body.pass
    };
    const regexstg: boolean = /[A-Z]/.test(insert.pass);
    const regexnum: boolean = /[0-9]/.test(insert.pass);
    function char() {
        var val: boolean = false;
        if (insert.user.length >= 3 && insert.pass.length >= 8 && regexstg === true && regexnum === true) {
            val = true;
        }
        return val;
    }
    if (char() === true) {
        const passhash: string = bcrypt.hashSync(insert.pass, 10);
        Users.findAll({
            raw: true,
            where: { username: insert.user }
        }).then((out: Array<any>) => {
            if (out.length != 0) {
                res.status(400).end("user exists");
            } else {
                Users.create({
                    username: insert.user,
                    password: passhash
                }).then(() => {
                    Users.findAll({
                        raw: true,
                        where: { username: insert.user }
                    }).then((check: Array<any>) => {
                        const compare: boolean = bcrypt.compareSync(insert.pass, check[0].password);
                        if (check === null) {
                            res.status(500).end("internal error: check pass user");
                        } else if (compare === true) {
                            Account.create({
                                id: check[0].username,
                                balance: 100.00
                            }).then(() => {
                                Users.update({
                                    accountId: check[0].username
                                }, {
                                    where: { id: check[0].id }
                                });
                                res.status(201).end();
                            }).catch((err) => {
                                Account.destroy({ where: { id: check[0].id } });
                                res.status(500).end("internal error");
                            });
                        } else {
                            res.status(500).end("internal error: create balance");
                        }
                    });
                }).catch(err => {
                    res.status(500).end("internal error: create user");
                });
            }
        });
    } else if (insert.user.length < 3) {
        res.status(400).end("minimun character to user is 3");
    } else if (insert.pass.length < 8) {
        res.status(400).end("minimun character to pass is 8");
    } else if (regexstg === false || regexnum === false) {
        res.status(400).end("upper case and number to pass");
    }
});

app.post("/login", (req, res) => {
    interface table {
        user: string;
        pass: string;
    }
    const login: table = {
        user: req.body.user,
        pass: req.body.pass
    }
    const regexstg: boolean = /[A-Z]/.test(login.pass);
    const regexnum: boolean = /[0-9]/.test(login.pass);
    function char() {
        var val: boolean = false;
        if (login.user.length >= 3 && login.pass.length >= 8 && regexstg === true && regexnum === true) {
            val = true;
        }
        return val;
    }
    if (char() === true) {
        Users.findAll({
            raw: true,
            where: { username: login.user }
        }).then((out: Array<any>) => {
            if (out === null) {
                res.status(400).end("user not found");
            } else if (out.length === 0) {
                res.status(400).end("user not found");
            } else {
                const compare: boolean = bcrypt.compareSync(login.pass, out[0].password);
                if (compare === true) {
                    const token: string = jwt.sign({id: out[0].id}, secretkey, {expiresIn: "15m"});
                    res.status(200).send({token: token });
                } else {
                    res.status(400).end("pass error");
                }
            }
        }).catch((err) => {
            res.status(500).end("internal error");
        });
    } else if (login.user.length < 3) {
        res.status(400).end("minimun character to user is 3");
    } else if (login.pass.length < 8) {
        res.status(400).end("minimun character to pass is 8");
    } else if (regexstg === false || regexnum === false) {
        res.status(400).end("upper case and number to pass");
    }
});

app.get('/areauser', checktoken, async (req, res) => {
    const decodedtoken: number = res.locals.decodedtoken;
    const account: Promise<Array<any>> = Account.findAll({
        raw: true,
        where: {id: decodedtoken},
        attributes: ["balance"]
    });
    const users: Promise<Array<any>> = Users.findAll({
        raw: true,
        where: {username: decodedtoken},
        attributes: ["username"]
    });
    const data: object = {
        users: await users,
        account: await account,
    }
    res.status(200).send(data);
});

app.get('/transactions', checktoken, async (req, res) => {
    const decodedtoken: number = res.locals.decodedtoken;
    var transactions: Array<any> = [];
    transactions.push({
        transactions: await Transactions.findAll({
            raw: true,
            where: { [Op.or]: [{ debitedAccountId: decodedtoken }, { creditedAccountId: decodedtoken }] },
            attributes: ["debitedAccountId", "creditedAccountId", "value", "createdAt"],
        })
    });
    res.status(200).send(await transactions[0].transactions);
});

app.post('/newtransctions', checktoken, (req, res) => {
    const myuser: number = res.locals.decodedtoken;
    const date: Date = new Date;
    interface usersaldo {
        user: string;
        saldo: number
    }
    const usersaldo: usersaldo ={
        user: req.body.user,
        saldo: parseFloat(req.body.value)
    }
    Users.findAll({
        raw: true,
        where: { username: usersaldo.user}
    }).then((out: any[]) => {
        if (out.length === 0) {
            res.status(400).end("user not exists");
        } else {
            Account.findAll({
                raw: true,
                where: {id: myuser},
                attributes: ["balance"]
            }).then((myresult: any[]) => {
                if (myresult[0].balance < usersaldo.saldo) {
                    res.status(401).end("insufficient balance");
                } else {
                    const mycurrent: number = myresult[0].balance - usersaldo.saldo;
                    Account.update({balance: mycurrent}, {
                        where: {id: myuser}
                    });
                    Account.findAll({
                        raw: true,
                        where: {id: usersaldo.user},
                        attributes: ["balance"]
                    }).then((userresult: any[]) => {
                        const usercurrent: number= userresult[0].balance + usersaldo.saldo;
                        const currentdate: string = (date.toLocaleString());
                        Account.update({ balance: usercurrent }, {
                            where: { id: usersaldo.user }
                        }).then(() => {
                            Transactions.create({
                                debitedAccountId: myuser,
                                creditedAccountId: usersaldo.user,
                                value: usersaldo.saldo,
                                createdAt: currentdate
                            }).then(() => {
                                res.status(200).end();
                            });
                        }).catch(err => {
                            res.status(500).end("internal error");
                        });
                    }).catch(err => {
                        res.status(500).end("internal error");
                    });
                }
            }).catch(err => {
                res.status(500).end("internal error");
            });
        }
    }).catch(err => {
        res.status(500).end("internal error");
    });
});

app.listen(port, () => {
    console.log("The port is running on " + port);
});