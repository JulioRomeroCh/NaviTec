const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get ('/behavior/add_behavior', (req, res) => {

    res.render('behavior/add_behavior');
})

router.post('/add_behavior', async (req, res) => {

    const {Behavior_ID, Indication, Description, Parent_ID, Kid_ID} = req.body;

    const newBehavior = {
        Behavior_ID,
        Indication,
        Description,
        Parent_ID,
        Kid_ID
    };
    console.log(newBehavior);
    
    await pool.query("CALL insertBehavior ('" + newBehavior.Behavior_ID + "','" + newBehavior.Indication +"','"+ newBehavior.Description + "')");
    await pool.query("CALL insertBehaviorKid ('" + newBehavior.Behavior_ID + "','" + newBehavior.Kid_ID +"')");
    await pool.query("CALL insertParentRecordsBehavior ('" + newBehavior.Behavior_ID + "','" + newBehavior.Parent_ID +"')");

    const behaviors_count = await pool.query("SELECT count(indication) AS indication FROM person JOIN kid ON person.nid = kid.nid JOIN behavior_kid ON behavior_kid.kid_id = kid.kid_id JOIN behavior ON behavior_kid.behavior_id = behavior.behavior_id WHERE indication = 'Bad' AND kid.kid_id = '" + newBehavior.Kid_ID + "'");
    var string=JSON.stringify(behaviors_count);
    var json =  JSON.parse(string);
    var results = json[0].indication;
    console.log(results);
    if(results == 6){
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'navitecjjk@gmail.com',
            pass: 'Navitec123'
        }
        });

        var mailOptions = {
        from: 'navitecjjk@gmail.com',
        to: 'KevRjs172@gmail.com',
        subject: 'Hey there! is Santa from NAVITEC!',
        text: "I'm sorry but due to bad behaviors, your child won't recieve presents this year"
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    }
    res.redirect ('/parent_view/parent_view');
});


router.get('/', async (req, res) =>{

    const behavior = await pool.query("SELECT * FROM behavior"); //CALL readAllSantasAssistant
    console.log(behavior);
    res.render('behavior/read_behavior', { behavior });

});


router.get('/delete/:Behavior_ID', async (req, res) => {

    const {Behavior_ID} = req.params;
    await pool.query("CALL deleteBehavior ('" + Behavior_ID + "')");
    req.flash('success', 'Behavior deleted successfully');
    res.redirect('/behavior');

});


router.get('/edit_behavior/:Behavior_ID', async (req, res) => {
    const {Behavior_ID} = req.params;
    const ids =  await pool.query ('SELECT * FROM behavior WHERE behavior_id= ?', [Behavior_ID]);
    //"CALL readSantasAssistant ('" + Assistant_ID + "')"
    //'SELECT * FROM santas_assistant WHERE Assistant_ID= ?', [Assistant_ID]
    console.log(ids[0]);

    res.render('behavior/edit_behavior', {behavior: ids[0]});

});

router.post('/edit_behavior/:Behavior_ID', async (req, res) => {
    const {ids} = req.params;
    const {Behavior_ID, Date, Indication, Description} = req.body;
    const newLink = {
        Behavior_ID,
        Date,
        Indication,
        Description
    };
    await pool.query("CALL updateBehavior ('" + newLink.Behavior_ID + "','" + newLink.Date + "','" + newLink.Indication +"','"+ newLink.Description + "')");
    req.flash('success', 'Behavior updated successfully');
    res.redirect('/behavior');
});


module.exports = router;

