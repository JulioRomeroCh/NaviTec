const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get ('/add_parent', async (req, res) => {
    const user_not_used = await pool.query("SELECT user.username FROM user WHERE user.username NOT IN (SELECT user.username FROM user JOIN person ON person.username = user.username) AND user.username NOT IN (SELECT user.username FROM user JOIN santas_assistant ON santas_assistant.username = user.username) AND user.username <> 'Santa'"); 
    res.render('parent/add_parent', { user: user_not_used });
    console.log(user_not_used);
})

router.post('/add', async (req, res) => {
    const {Parent_ID, NID, Telephone} = req.body;
    const newParent = {
        Parent_ID,
        NID,
        Telephone
    };

    //await pool.query("CALL insertParent ('" + newParent.Parent_ID + "','" + newParent.NID +"')");
    //await pool.query("CALL insertTelephoneParent ('" + newParent.Parent_ID + "','" + newParent.Telephone +"')");
    req.flash('success', 'Parent added successfully');
    res.redirect ('/signin');
});

router.get('/', async (req, res) =>{
    const {Parent_ID} = req.params;
    const parent = await pool.query("SELECT * FROM parent");
    res.render('parent/read_parent', { parent });   
});

router.get('/delete/:Parent_ID', async (req, res) => {
    const {Parent_ID} = req.params;
    await pool.query("CALL deleteParent ('" + Parent_ID + "')");
    req.flash('success', 'Parent deleted successfully');
    res.redirect('/parent');
});


router.get('/edit_parent/:Parent_ID', async (req, res) => {
    const {Parent_ID} = req.params;
    const ids =  await pool.query ('SELECT * FROM parent WHERE Parent_ID= ?', [Parent_ID]);
    const phone =  await pool.query ('SELECT * FROM telephone_parent WHERE Parent_ID= ?', [Parent_ID])
    const parent = await pool.query("SELECT person.nid, person.email, date_format(person.birth_date, '%Y-%m-%d') AS birth_date, person.name, person.lastname, person.username,  district_person.district_id,  district_person.address, district.district, parent.parent_id, telephone_parent.telephone FROM person JOIN parent ON person.nid = parent.nid JOIN district_person ON person.nid = district_person.nid JOIN telephone_parent ON parent.parent_id = telephone_parent.parent_id JOIN user ON person.username = user.username JOIN district ON district_person.district_id = district.district_id WHERE parent.parent_id = '" + Parent_ID + "'");
    const residence = await pool.query("", [Parent_ID]);
    res.render('parent/edit_parent', {parent: ids[0], telephone_parent: phone[0], person: parent[0], district_person: parent[0]});

});

router.post('/edit_parent/:Parent_ID', async (req, res) => {
    const {ids} = req.params;

    const {Nid, Email, Birth_Date, Name, Lastname, Username, Country, Province, City, District, Address, Parent_ID, Telephone} = req.body;

    const newParent = {
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
        Parent_ID,     
        Telephone
    };
    await pool.query("CALL updatePerson ('" + newParent.Nid + "','" + newParent.Email + "','" + newParent.Birth_Date +  "','" + newParent.Name + "','" + newParent.Lastname + "','" + newParent.Username + "')");
    await pool.query("CALL UpdateDistrictPerson ('" + newParent.Nid + "','" + newParent.District + "','" + newParent.Address + "')");
    await pool.query("CALL updateParent ('" + newParent.Parent_ID + "','" + newParent.Nid +"')");
    await pool.query("CALL updateTelephoneParent ('" + newParent.Parent_ID + "','" + newParent.Telephone +"')");
    res.redirect('/parent/read_parent');
});

module.exports = router;

