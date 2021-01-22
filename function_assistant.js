const express  = require ('express');
const router = express.Router ();

//Database connection
const pool = require ('../database');

//Change the name add
/*
router.get ('/add_function_assistant', (req, res) => {
    res.render('function_assistant/add_function_assistant');
})*/

router.get('/add_function_assistant', async (req, res) =>{
    const santas_assistant = await pool.query("SELECT * FROM santas_assistant"); 
    console.log(santas_assistant);
    res.render("function_assistant/add_function_assistant", { santas_assistant });
});

//Recibe los datos del formulario
router.post('/add', async (req, res) => {
    const {Assistant_ID, Function_Name} = req.body;
    //Save it in a new object
    //Create new object
    const newLink = {
        Assistant_ID,
        Function_Name
    };
    console.log(newLink);
    //Insert data in database
    await pool.query('INSERT INTO function_assistant SET ?', [newLink]);
    req.flash('success', 'Function added successfully');

    res.redirect ('/function_assistant');
});




router.get('/', async (req, res) =>{   
    const function_assistant = await pool.query("SELECT * FROM function_assistant"); 
    console.log(function_assistant);
    res.render('function_assistant/read_function_assistant', { function_assistant });
});




router.get('/delete/:Assistant_ID', async (req, res) => {

    const {Assistant_ID} = req.params;
    await pool.query('DELETE FROM function_assistant WHERE assistant_id= ?', [Assistant_ID]);
    req.flash('success', 'Function deleted successfully');
    res.redirect('/function_assistant');

});


router.get('/edit_function_assistant/:Assistant_ID', async (req, res) => {
    const {Assistant_ID} = req.params;
    const ids =  await pool.query ('SELECT * FROM function_assistant WHERE assistant_id= ?', [Assistant_ID]);
    console.log(ids[0]);

    res.render('function_assistant/edit_function_assistant', {function_assistant: ids[0]});

});

router.post('/edit_function_assistant/:Assistant_ID', async (req, res) => {
    const {ids} = req.params;
    const {Assistant_ID, Function_Name} = req.body;
    const newLink = {
        Assistant_ID,
        Function_Name
    };
    await pool.query('UPDATE function_assistant set ? WHERE assistant_id= ?', [newLink, Assistant_ID]);
    req.flash('success', 'Function updated successfully');
    res.redirect('/function_assistant');
});


module.exports = router;

