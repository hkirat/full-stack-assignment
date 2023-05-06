const jwt = require('jsonwebtoken');
const express = require('express');

const auth = (req, res, next) => {
    // fetches the token from request header
    const token = req.headers.authorization
    const id = jwt.decode(token).id;
    //storing id of user in req
    req.userid = id;
    next();
}

module.exports = auth
