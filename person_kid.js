const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get ('/add_person_kid', async (req, res) => {
    const user = await pool.query("SELECT user.username FROM user WHERE  user.username NOT IN (SELECT user.username FROM user JOIN person ON person.username = user.username) AND user.username NOT IN (SELECT user.username FROM user JOIN santas_assistant ON santas_assistant.username = user.username) AND user.username <> 'Santa'");
    const country = await pool.query("SELECT * from country");
    const province = await pool.query("SELECT * from province");
    const city = await pool.query("SELECT * from city");
    const district = await pool.query("SELECT * from district");
    console.log(user);
    res.render('person_kid/add_person_kid', {user: user[0], country, province, city, district});

})

router.post('/add_person_kid', async (req, res) => {

    const {Nid, Email, Birth_Date, Name, Lastname, Username, Country, Province, City, District, Address, Kid_ID, Needs, Parent_ID, Password, Role} = req.body;

    const newPerson = {
        Nid,
        Email,
        Birth_Date,
        Name,
        Lastname,
        Username,
        Country,
        Province,
        City,
        District,
        Address,
        Kid_ID,
        Needs,
        Parent_ID,    
        Password,
        Role
    };
    await pool.query("CALL insertUser ('" + newPerson.Username + "','" + newPerson.Password + "','" + newPerson.Role +"')")
    await pool.query("CALL insertPerson ('" + newPerson.Nid + "','" + newPerson.Email + "','" + newPerson.Birth_Date +  "','" + newPerson.Name + "','" + newPerson.Lastname + "','" + newPerson.Username + "')");
    await pool.query("CALL insertDistrictPerson ('" + newPerson.Nid + "','" + newPerson.District + "','" + newPerson.Address + "')");
    await pool.query("CALL insertKid ('" + newPerson.Kid_ID + "','" + newPerson.Nid +"')");
    await pool.query("CALL insertNeedsKid ('" + newPerson.Kid_ID + "','" + newPerson.Needs +"')");
    await pool.query("CALL insertParentKid ('" + newPerson.Kid_ID + "','" + newPerson.Parent_ID +"')");
    
    req.flash('success', 'Person added successfully');
    res.redirect ('/parent_view/parent_view');
});

router.get('/', async (req, res) =>{

    const person = await pool.query("SELECT person.nid, person.email, date_format(person.birth_date, '%Y-%m-%d') AS birth_date, person.name, person.lastname, person.username, address FROM person JOIN district_person ON person.nid = district_person.nid");
    res.render('person/read_person', { person });

});

/*
router.get('/delete/:Nid', async (req, res) => {

    const {Nid} = req.params;
    await pool.query("CALL deletePerson ('" + Nid + "')");
    req.flash('success', 'Person deleted successfully');
    res.redirect('/person');

});*/

router.get('/edit_person/:Nid', async (req, res) => {
    const {Nid} = req.params;
    const ids =  await pool.query ("SELECT nid, email, date_format(person.birth_date, '%Y-%m-%d') AS birth_date, name, lastname, username FROM person WHERE nid= ?", [Nid]);
    const address = await pool.query("SELECT * FROM district_person WHERE nid=?",[Nid]);
    res.render('person/edit_person', {person: ids[0], district_person:address[0]});

});

router.post('/edit_person/:Nid', async (req, res) => {
    const {ids} = req.params;
    const {Nid, Email, Birth_Date, Name, Lastname, Username, Country, Province, City, District, Address} = req.body;
    const newPerson = {
        Nid,
        Email,
        Birth_Date,
        Name,
        Lastname,
        Username,
        Country,
        Province,
        City,
        District,
        Address
    };
    await pool.query("CALL updatePerson ('" + newPerson.Nid + "','" + newPerson.Email + "','" + newPerson.Birth_Date +  "','" + newPerson.Name + "','" + newPerson.Lastname + "','" + newPerson.Username + "')");
    await pool.query("CALL UpdateDistrictPerson ('" + newPerson.Nid + "','" + newPerson.District + "','" + newPerson.Address + "')");
    req.flash('success', 'Person updated successfully');
    res.redirect('/person');
});

module.exports = router;

