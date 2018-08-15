const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');


module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: 'Token não informado '});

    // Bearer + hash 6468465164876sdsdfsssbsfb
    
    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token com erro'});

    const [ schema, token ] = parts;

    if(!/^Bearer$/i.test(schema))
        return  res.status(401).send({ error: 'Token mau formado'});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({ error: 'Token invalido'});

        req.userID = decoded.id;
        return next();
    });

};