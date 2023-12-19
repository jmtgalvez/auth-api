const router = require('express').Router();

const CTRL = require('./controller');

router.post('/register', async (req, res) => {
    try {
        const userExists = await CTRL.checkUserExists(req.body.username);

        if (userExists)
            res.status(409).json({
                status      : 409,
                message     : "Username not available.",
            })

        const credentials = {
            username    : req.body.username,
            password    : req.body.password,
        }

        const userID = await CTRL.addUser(credentials);
        res.status(201).json({
            status      : 201,
            message     : "Registration successful.",
        })
    } catch (status) {
        res.status(status).json({
            status      : status,
            message     : status === 401 ? "User already exists" : "Internal Server Error. Try again later.",
        })
    }
});

router.post('/login', async (req, res) => {
    try {
        const credentials = {
            username    : req.body.username,
            password    : req.body.password,
        }

        const tokens = await CTRL.authenticateUser(credentials);
        
        res.status(200).json({
            status      : 200,
            message     : "Login successful.",
            tokens
        })

    } catch (status) {
        res.status(status).json({
            status      : status,
            message     : status === 401 ? "Invalid credentials." : "Internal Server Error. Try again later.",
        })
    }
})

module.exports = router;