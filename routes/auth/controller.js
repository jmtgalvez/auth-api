const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const db = require('../../configs/db');
const jwt = require('../../configs/jwt');

exports.checkUserExists = username => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT username FROM user WHERE username = $username`;
        const params = { $username : username };

        db.get(sql, params, function (err, row) {
            if (err) {
                console.log(err);
                return reject(500);
            }
            return resolve(row !== undefined);
        });
    });
}

exports.addUser = credentials => {
    return new Promise(async (resolve, reject) => {
        const salt = 8;
        const hashPwd = await bcrypt.hash(credentials.password, salt);

        const sql = `INSERT INTO user (id, username, password) VALUES ($id, $username, $password)`;
        const params = {
            $id         : uuidv4(),
            $username   : credentials.username,
            $password   : hashPwd,
        }

        db.run(sql, params, function (err) {
            if (err) {
                console.log(err);
                return reject(500);
            }
            return resolve(this.lastID);
        });
    });
}

exports.authenticateUser = credentials => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = $username`;
        const params = { $username : credentials.username}

        db.get(sql, params, async function (err, row) {
            if (err) {
              console.log(err);
              return reject(500);
            }

            if (row === undefined)
                return reject(401);

            if ( await bcrypt.compare(credentials.password, row.password) )
                return resolve({
                    accessToken     : jwt.generateAccessToken({ userID : row.id}),
                    refreshToken    : jwt.generateRefreshToken({ userID : row.id}),
                })
        });
    });
}