const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get ('/add_user', (req, res) => {
    res.render('user/add_user');
});

router.post('/add', async (req, res) => {
    const {Username, Password, Role} = req.body;
    const newLink = {
        Username,
        Password,
        Role
    };

    await pool.query("CALL insertUser ('" + newLink.Username + "','" + newLink.Password + "','" + newLink.Role +"')")
    res.redirect ('/person/add_person');
});


router.get ('/new_assistant', (req, res) => {
    res.render('user/new_assistant');
});

router.post('/new_assistant', async (req, res) => {
    const {Username, Password} = req.body;
    const newLink = {
        Username,
        Password,       
    };
    await pool.query("CALL updateUserAssistant ('" + newLink.Username + "','" + newLink.Password +"')")
    res.redirect ('/signin');
});







router.get('/', async (req, res) =>{
    const user = await pool.query("SELECT * FROM user"); 
    console.log(user);
    res.render('user/read_user', { user });   
});


router.get('/delete/:Username', async (req, res) => {

    const {Username} = req.params;
    await pool.query("CALL deleteUser ('" + Username + "')");
    req.flash('success', 'Userdeleted successfully');
    res.redirect('/user');

});


router.get('/edit_user/:Username', async (req, res) => {
    const {Username} = req.params;
    const ids =  await pool.query ('SELECT * FROM user WHERE Username= ?', [Username]);
    res.render('user/edit_user', {user: ids[0]});

});

router.post('/edit_user/:Username', async (req, res) => {
    const {ids} = req.params;
    const {Username, Password, Role} = req.body;
    const newLink = {
        Username,
        Password,
        Role
    };
    console.log(newLink);
    await pool.query("CALL updateUser ('" + newLink.Username + "','" + newLink.Password + "','" + newLink.Role +"')");
    req.flash('success', 'User updated successfully');
    res.redirect('/user');
});

module.exports = router;

