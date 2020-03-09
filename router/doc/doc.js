const router = require('express').Router();
const verify = require('../api/auth').verify;

router.get('/', 
(req, res) =>
{
    if (!req.cookies.token)
        res.render('index');
    else
        res.redirect('/chatroom');
});
router.get('/chatroom', verify,
(req, res) =>
{
    res.render('chatroom', { user: req.body.user });
});

module.exports = router;