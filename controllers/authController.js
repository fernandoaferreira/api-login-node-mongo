const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {
        //verificar se email já existe
        if (await User.findOne({ email }))
            return res.status(403).send({ error: 'Usuario já existe' });

        const user = await User.create(req.body);
        //não trazer a senha na reposta
        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id }) })

    } catch (e) {
        console.log(e);
        return res.status(400).send({ error: 'Falha no registro' });
    }

});

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;
    //verifica se a senha é correspondente a do email
    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(403).send({ error: "Usuario não existe" });

    //comparando as senhas enviada com a senha do banco
    if (!await bcrypt.compare(password, user.password))
        return res.status(403).send({ error: 'Senha Invalida' });

    //não trazer a senha na reposta
    user.password = undefined;

    

    res.send({ user, token: generateToken({ id: user.id }) });


});

module.exports = app => app.use('/auth', router);