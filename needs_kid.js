const express  = require ('express');
const router = express.Router ();

//Database connection
const pool = require ('../database');

//Change the name add
router.get ('/add_needs_kid', (req, res) => {
    res.render('needs_kid/add_needs_kid');
})

//Recibe los datos del formulario
router.post('/add', async (req, res) => {
    const {Kid_ID, Needs} = req.body;
    //Save it in a new object
    //Create new object
    const newLink = {
        Kid_ID,
        Needs
    };

    console.log(newLink);

    //Insert data in database
    await pool.query('INSERT INTO needs_kid SET ?', [newLink])
    req.flash('success', 'Need added successfully');
    res.redirect ('/needs_kid');
});




router.get('/', async (req, res) =>{

    const needs_kid = await pool.query("SELECT * FROM needs_kid"); //CALL readAllSantasAssistant
    console.log(needs_kid);
    res.render('needs_kid/read_needs_kid', { needs_kid });
    
});


router.get('/delete/:Kid_ID', async (req, res) => {
    const {Kid_ID} = req.params;
    await pool.query('DELETE FROM needs_kid WHERE kid_id= ?', [Kid_ID]);
    req.flash('success', 'Need deleted successfully');
    res.redirect('/needs_kid');
});


router.get('/edit_needs_kid/:Kid_ID', async (req, res) => {
    const {Kid_ID} = req.params;
    const ids =  await pool.query ('SELECT * FROM needs_kid WHERE kid_id= ?', [Kid_ID]);
    console.log(ids[0]);

    res.render('needs_kid/edit_needs_kid', {needs_kid: ids[0]});

});

router.post('/edit_needs_kid/:Kid_ID', async (req, res) => {
    const {ids} = req.params;
    const {Kid_ID, Needs} = req.body;
    const newLink = {
        Kid_ID,
        Needs
    };
    await pool.query('UPDATE needs_kid set ? WHERE kid_id= ?', [newLink, Kid_ID]);
    req.flash('success', 'Need updated successfully');
    res.redirect('/needs_kid');
});




module.exports = router;

