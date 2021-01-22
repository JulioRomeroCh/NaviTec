const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get ('/add_person', async (req, res) => {
    const user = await pool.query("SELECT user.username FROM user WHERE  user.username NOT IN (SELECT user.username FROM user JOIN person ON person.username = user.username) AND user.username NOT IN (SELECT user.username FROM user JOIN santas_assistant ON santas_assistant.username = user.username) AND user.username <> 'Santa'");
    const country = await pool.query("SELECT * from country");
    const province = await pool.query("SELECT * from province");
    const city = await pool.query("SELECT * from city");
    const district = await pool.query("SELECT * from district");
    res.render('person/add_person', {user, country, province, city, district});

})

router.post('/add', async (req, res) => {
    const {Nid, Email, Birth_Date, Name, Lastname, Username, Country, Province, City, District, Address, Parent_ID, Telephone} = req.body;

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
        Parent_ID,
        Telephone
    };
    await pool.query("CALL insertPerson ('" + newPerson.Nid + "','" + newPerson.Email + "','" + newPerson.Birth_Date +  "','" + newPerson.Name + "','" + newPerson.Lastname + "','" + newPerson.Username + "')");
    await pool.query("CALL insertDistrictPerson ('" + newPerson.Nid + "','" + newPerson.District + "','" + newPerson.Address + "')");
    await pool.query("CALL insertParent ('" + newPerson.Parent_ID + "','" + newPerson.Nid +"')");
    await pool.query("CALL insertTelephoneParent ('" + newPerson.Parent_ID + "','" + newPerson.Telephone +"')");
    req.flash('success', 'Person added successfully');
    res.redirect ('/signin');
});

router.get('/', async (req, res) =>{

    const person = await pool.query("SELECT person.nid, person.name, person.lastname, country.name, province.province_name, city.name, district.district_id, district.district, address FROM person JOIN district_person  ON person.nid = district_person.nid JOIN district ON district_person.district_id = district.district_id JOIN district_city ON district_person.district_id = district_city.district_id JOIN city ON district_city.city_code = city.city_code JOIN city_province ON city_province.city_code = district_city.city_code JOIN province ON  city_province.province_code = province.province_code JOIN province_country ON city_province.province_code = province_country.province_code JOIN country ON province_country.country_code = country.country_code");
    res.render('person/read_person', { person: person, country: person});

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
    const residence = await pool.query("SELECT country.country_code, country.name, province.province_code, province.province_name, city.city_code, city.name, district.district_id, district.district FROM person JOIN district_person ON person.nid = district_person.nid JOIN district ON district_person.district_id = district.district_id JOIN district_city ON district_city.district_id = district.district_id JOIN city ON district_city.city_code = city.city_code JOIN city_province ON city_province.city_code = city.city_code JOIN province ON city_province.province_code = province.province_code JOIN province_country ON province_country.province_code = province.province_code JOIN country ON province_country.country_code = country.country_code WHERE person.nid = ?", [Nid]);
    console.log(residence);
    res.render('person/edit_person', {person: ids[0], district_person:address[0], residence});

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

