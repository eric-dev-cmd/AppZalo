const { check } = require('express-validator/check');
const { transErrors }= require('../../lang/vi');

const login =[
    check('phone', transErrors.login_failed)
]

module.exports = { 
    login: login
 };