const express  = require ('express');
const router = express.Router ();

//Database connection
const pool = require ('../database');

//Change the name add
router.get ('/add_letter', (req, res) => {
    res.render('letter/add_letter');
})

//Recibe los datos del formulario
router.post('/add', async (req, res) => {
    const {Letter_Code, Date, Kid_ID} = req.body;
    //Save it in a new object
    //Create new object
    const newLink = {
        Letter_Code,
        Date,
        Kid_ID
    };



    //Insert data in database
    await pool.query("CALL insertLetter ('" + newLink.Letter_Code + "','" + newLink.Date + "','" + newLink.Kid_ID + "')")
    req.flash('success', 'Letter added successfully');
    res.redirect ('/letter');
});




router.get('/', async (req, res) =>{

    const letter = await pool.query("SELECT * FROM letter"); //CALL readAllSantasAssistant
    console.log(letter);
    res.render('letter/read_letter', { letter });

});


router.get('/delete/:Letter_Code', async (req, res) => {

    const {Letter_Code} = req.params;
    await pool.query("CALL deleteLetter ('" + Letter_Code + "')");
    req.flash('success', 'Letter deleted successfully');
    res.redirect('/letter');

});


router.get('/edit_letter/:Letter_Code', async (req, res) => {
    const {Letter_Code} = req.params;
    const ids =  await pool.query ('SELECT * FROM letter WHERE letter_code= ?', [Letter_Code]);
    //"CALL readSantasAssistant ('" + Assistant_ID + "')"
    //'SELECT * FROM santas_assistant WHERE Assistant_ID= ?', [Assistant_ID]
    console.log(ids[0]);

    res.render('letter/edit_letter', {letter: ids[0]});

});

router.post('/edit_letter/:Letter_Code', async (req, res) => {
    const {ids} = req.params;
    const {Letter_Code, Date, Kid_ID} = req.body;
    const newLink = {
        Letter_Code,
        Date,
        Kid_ID
    };
    await pool.query("CALL updateLetter ('" + newLink.Letter_Code + "','" + newLink.Date + "','" + newLink.Kid_ID + "')");
    req.flash('success', 'Letter updated successfully');
    res.redirect('/letter');
});


module.exports = router;

