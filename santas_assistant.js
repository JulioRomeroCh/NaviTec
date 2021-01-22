const express  = require ('express');
const router = express.Router ();

//Database connection
const pool = require ('../database');

router.get ('/add_santas_assistant', async (req, res) => {

    res.render('santas_assistant/add_santas_assistant');
})

router.post('/add', async (req, res) => {
    const {Assistant_ID, Name, Start_Date, Username, Work_Station, Function} = req.body;
    const newAssistant = {
        Assistant_ID,
        Name,
        Start_Date,
        Username,
        Work_Station,
        Function
    };

    await pool.query("CALL insertSantasAssistantUser('" + Username + "')");
    await pool.query("CALL insertSantasAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Name + "','" + newAssistant.Start_Date +"','"+ newAssistant.Username + "')");   
    await pool.query("CALL insertFunctionAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Function + "')");
    await pool.query("CALL insertWorkstationAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Work_Station + "')");
    
    req.flash('success', 'Santas Assistant added successfully');
    res.redirect ('/santas_assistant');
});

router.get('/', async (req, res) =>{

    const santas_assistant = await pool.query("SELECT assistant_id, name, date_format(start_date, '%Y-%m-%d') AS start_date, username FROM santas_assistant"); //CALL readAllSantasAssistant
    res.render('santas_assistant/read_santas_assistant', { santas_assistant});
    
});

router.get('/delete/:Assistant_ID', async (req, res) => {

    const {Assistant_ID} = req.params;
    await pool.query("CALL deleteSantasAssistant ('" + Assistant_ID + "')");
    req.flash('success', 'Santas Assistant deleted successfully');
    res.redirect('/santas_assistant');

});


router.get('/edit_santas_assistant/:Assistant_ID', async (req, res) => {
    const {Assistant_ID} = req.params;
    const ids =  await pool.query ("SELECT assistant_id, name, date_format(start_date, '%Y-%m-%d') AS start_date, username FROM santas_assistant WHERE Assistant_ID= ?", [Assistant_ID]);
    const funct =  await pool.query ('SELECT * FROM function_assistant WHERE Assistant_ID= ?', [Assistant_ID]);
    const workstation =  await pool.query ('SELECT * FROM workstation_assistant WHERE Assistant_ID= ?', [Assistant_ID]);

    res.render('santas_assistant/edit_santas_assistant', {santas_assistant: ids[0], function_assistant: funct[0], workstation_assistant: workstation[0]});

});

router.post('/edit_santas_assistant/:Assistant_ID', async (req, res) => {
    const {ids} = req.params;
    const {Assistant_ID, Name, Start_Date, Username, Work_Station, Function} = req.body;
    const newAssistant = {
        Assistant_ID,
        Name,
        Start_Date,
        Username,
        Work_Station,
        Function
    };
    await pool.query("CALL updateSantasAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Name + "','" + newAssistant.Start_Date +"','"+ newAssistant.Username + "')");
    await pool.query("CALL updateFunctionAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Function + "')");
    await pool.query("CALL updateWorkstationAssistant ('" + newAssistant.Assistant_ID + "','" + newAssistant.Work_Station + "')");
    req.flash('success', 'Santas Assistant updated successfully');
    res.redirect('/santas_assistant');
});




module.exports = router;

