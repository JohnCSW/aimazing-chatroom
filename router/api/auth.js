const router = require('express').Router();
const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
// TODO:Env var setup
const cn = 
{
    database: 'chatroom',
    user: 'john',
    password: 'well1012'
};
// TODO: create classes abstracting DB data manipulation
router.post('/signup',
async (req, res) =>
{
    try
    {
        // DB insert user into db
        // TODO: password hashing
        const db = pgp(cn);
        await db.none('insert into chat.member (account, password) values (${acc}, ${pwd});',
        req.body);
        // Setup Cookie for protecting routes
        // TODO: get and set private key from env
        const user = await db.one('select id from chat.member where account=${acc}', { acc: req.body.acc });
        const token = jwt.sign({ id: user.id , acc: req.body.acc}, 'shh_key');
        res.cookie('token', token, {httpOnly: true, maxAge: 60 * 60 * 24}).redirect("/chatroom");
    }
    catch(err)
    {
        // TODO: 
        // - Handling mechanism for other errors. For now just
        // assume that the only error is duplicate registeration.
        // - Email & Passowrd complexity validation
        res.status(400).send("This account has been registered.")
        console.log(err);
    }
    finally
    {
        await pgp.end();
    }
    
});
router.post('/login',
async (req, res) =>
{
    try
    {
        // Search for user
        const db = pgp(cn);
        const user = await db.oneOrNone('select id, password from chat.member where account=${acc}', {acc: req.body.acc});
        // Authentication
        if (!user)
            throw new Error("No such user");
        // *Important* the length of string extracted from DB is the max length of column
        if (String(user.password).trim() != req.body.pwd) 
            throw new Error("Invalid email or password");
        // Setup Cookie for protecting routes
        // TODO: get and set private key from env
        const token = jwt.sign({ id: user.id , acc: req.body.acc }, 'shh_key');
        res.cookie('token', token, {httpOnly: true, maxAge: 60 * 60 * 24 }).redirect('/chatroom');
    }catch(err)
    {
        res.status(400).send(err.message);
    }
    finally
    {
        await pgp.end()
    }
    
});
router.post('/logout',
(req, res) => 
{
    res.clearCookie('token').redirect('/');
});

function verify(req, res, next)
{
    try
    {
        if (!req.cookies.token)
        {
            res.redirect('/');
        }
        else
        {
            const user = jwt.verify(req.cookies.token, 'shh_key');
            req.body.user = user;
            next();
        }
    }catch(err)
    {
        res.status(403).send("Invalid email or password!");
        console.log(`Error: ${ err.message}`);
    }
    
}
module.exports = { router: router, verify: verify };