const jwt = require('jsonwebtoken');

exports.generateAccessToken = payload => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hrs' });
}

exports.generateRefreshToken = payload => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
}

exports.verifyToken = (req, res, next) => {
    // get token
    if ( !req.headers.cookie ) 
        return res.sendStatus(403);

    const cookies = [];
    req.headers.cookie.split(';').map( cookie => {
        const [key, value] = cookie.split('=');
        cookies[key.trim()] = value;
    });
    const access_token = cookies['access_token'];

    // verify correct user
    jwt.verify(access_token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        // return user
        req.userId = parseInt(user.userId);
        next();
    });
}

exports.verifyRefreshToken = ( req, res, next ) => {
    if ( !req.headers.cookie ) 
        return res.sendStatus(403);

    const cookies = [];
    req.headers.cookie.split(';').map( cookie => {
        const [key, value] = cookie.split('=');
        cookies[key.trim()] = value;
    });
    const refresh_token = cookies['refresh_token']; 
    
    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}