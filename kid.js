const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');


router.get('/kid/read_kid', async (req, res) =>{
    
    res.render('kid/read_kid');
    
});


router.get('/delete/:Kid_ID', async (req, res) => {

    const {Kid_ID} = req.params;
    console.log(Kid_ID);
    await pool.query("CALL deleteKid ('" + Kid_ID + "')");
    res.redirect('/kid/read_kid');

});


router.get('/edit_kid/:Kid_ID', async (req, res) => {
    const {Kid_ID} = req.params;
    const kids = await pool.query("SELECT parent.parent_id, person.nid, kid.kid_id, person.name, person.lastname, person.email, date_format(person.birth_date, '%Y-%m-%d') AS birth_date, district_person.address, needs_kid.needs, user.username, user.password, user.role FROM person  JOIN kid ON person.nid = kid.nid JOIN parent_kid ON kid.kid_id = parent_kid.kid_id JOIN parent ON  parent.parent_id = parent_kid.parent_id JOIN district_person ON person.nid = district_person.nid  JOIN needs_kid ON needs_kid.kid_id = kid.kid_id JOIN user ON user.username = person.username WHERE kid.kid_id = '" + Kid_ID + "'");
    const residence = await pool.query("", [Kid_ID]);
    console.log(kids);
    res.render('kid/edit_kid', {person: kids[0], kid: kids[0] ,district_person: kids[0], needs_kid: kids[0], user: kids[0], parent: kids[0]});

});

router.post('/edit_kid/:Kid_ID', async (req, res) => {
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

    await pool.query("CALL updateUser ('" + newPerson.Username + "','" + newPerson.Password + "','" + newPerson.Role +"')")
    await pool.query("CALL updatePerson ('" + newPerson.Nid + "','" + newPerson.Email + "','" + newPerson.Birth_Date +  "','" + newPerson.Name + "','" + newPerson.Lastname + "','" + newPerson.Username + "')");
    await pool.query("CALL UpdateDistrictPerson ('" + newPerson.Nid + "','" + newPerson.District + "','" + newPerson.Address + "')");
    await pool.query("CALL updateKid ('" + newPerson.Kid_ID + "','" + newPerson.Nid +"')");
    await pool.query("CALL updateNeedsKid ('" + newPerson.Kid_ID + "','" + newPerson.Needs +"')");
    await pool.query("CALL UpdateParentKid ('" + newPerson.Kid_ID + "','" + newPerson.Parent_ID +"')");

    res.redirect ('/kid/read_kid');
});



module.exports = router;