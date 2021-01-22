//Database connection
const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');




//Country Methods
router.get ('/add_residence_country', async (req, res) => {
    res.render('residence/add_residence_country');
});

router.post('/add_residence_country', async (req, res) => {
    const {Country_Code, Country_Name, Telephone_Prefix} = req.body;
    const newResidence = {
        Country_Code,
        Country_Name,
        Telephone_Prefix,

    };
    await pool.query("CALL insertCountry ('" + Country_Code + "','" + Country_Name + "','" + Telephone_Prefix+"')");
    res.redirect ('/residence/read_residence_country');
});

router.get('/residence/read_residence_country', async (req, res) =>{
    const countries = await pool.query("SELECT * FROM country"); 
    res.render('residence/read_residence_country', {countries});    
});

router.get('/delete_country/:Country_Code', async (req, res) => {
    const {Country_Code} = req.params;
    await pool.query("CALL deleteCountry ('" + Country_Code + "')");
    res.redirect('/residence/read_residence_country');
});

router.get('/edit_residence_country/:Country_Code', async (req, res) => {
    const {Country_Code} = req.params;
    const country_info =  await pool.query ('SELECT * FROM country WHERE Country_Code= ?', [Country_Code]);
    res.render('residence/edit_residence_country', {country: country_info[0]});

});

router.post('/edit_residence_country/:Country_Code', async (req, res) => {
    const {Country_Code, Country_Name, Telephone_Prefix} = req.body;
    const newResidence = {
        Country_Code,
        Country_Name,
        Telephone_Prefix,
    };
    await pool.query("CALL updateCountry ('" + Country_Code + "','" + Country_Name + "','" + Telephone_Prefix + "')");
    res.redirect('/residence/read_residence_country');
});



//Province Methods
router.get ('/add_residence_province', async (req, res) => {
    const country_info = await pool.query("SELECT * FROM country");
    res.render('residence/add_residence_province',{country_info});
});

router.post('/add_residence_province', async (req, res) => {
    const {Country_Code, Province_Code, Province_Name} = req.body;
    const newProvince = {
        Country_Code,
        Province_Code,
        Province_Name,

    };
    await pool.query("CALL insertProvince ('" + Province_Code + "','" + Province_Name +"')");
    await pool.query("CALL insertProvinceCountry ('" + Province_Code + "','" + Country_Code + "')");
    res.redirect ('/residence/read_residence_province');
});

router.get('/residence/read_residence_province', async (req, res) =>{
    const province = await pool.query("SELECT province.province_code, province.province_name FROM province JOIN province_country ON province.province_code = province_country.province_code"); 
    res.render('residence/read_residence_province', {province});    
});

router.get('/delete_province/:Province_Code', async (req, res) => {
    const {Province_Code} = req.params;
    await pool.query("CALL deleteProvince ('" + Province_Code + "')");
    res.redirect('/residence/read_residence_province');
});

router.get('/edit_residence_province/:Province_Code', async (req, res) => {
    const {Province_Code} = req.params;
    const province_info =  await pool.query ('SELECT province_country.country_code, province.province_code, province.province_name FROM province JOIN province_country ON province.province_code = province_country.province_code WHERE province.province_code = ?', [Province_Code]);
    res.render('residence/edit_residence_province', {province: province_info[0], province_country: province_info[0]});

});

router.post('/edit_residence_province/:Province_Code', async (req, res) => {
    const {Country_Code, Province_Code, Province_Name} = req.body;
    const newProvince = {
        Country_Code,
        Province_Code,
        Province_Name,

    };
    await pool.query("CALL updateProvince ('" + Province_Code + "','" + Province_Name + "')");
    res.redirect('/residence/read_residence_province');
});












//City Methods
router.get ('/add_residence_city', async (req, res) => {
    const province_info = await pool.query("SELECT * FROM province");
    res.render('residence/add_residence_city',{province_info});
});

router.post('/add_residence_city', async (req, res) => {
    const {Province_Code, City_Code, City_Name} = req.body;
    const newCity = {
        Province_Code,
        City_Code,
        City_Name,

    };
    await pool.query("CALL insertCity ('" + City_Code + "','" + City_Name +"')");
    await pool.query("CALL insertCityProvince ('" + City_Code + "','" + Province_Code + "')");
    res.redirect ('/residence/read_residence_city');
});

router.get('/residence/read_residence_city', async (req, res) =>{
    const cities = await pool.query("SELECT DISTINCT country.country_code, country.name, province.province_code, province.province_name, city.city_code, city.name, district.district_id, district.district FROM person JOIN district_person ON person.nid = district_person.nid JOIN district ON district_person.district_id = district.district_id JOIN district_city ON district_city.district_id = district.district_id JOIN city ON district_city.city_code = city.city_code JOIN city_province ON city_province.city_code = city.city_code JOIN province ON city_province.province_code = province.province_code JOIN province_country ON province_country.province_code = province.province_code JOIN country ON province_country.country_code = country.country_code"); 
    res.render('residence/read_residence_city', {cities});    
});

router.get('/delete_city/:City_Code', async (req, res) => {
    const {City_Code} = req.params;
    await pool.query("CALL deleteCity ('" + City_Code + "')");
    res.redirect('/residence/read_residence_city');
});

router.get('/edit_residence_city/:City_Code', async (req, res) => {
    const {City_Code} = req.params;
    const city_info =  await pool.query ('SELECT city_province.province_code, city.city_code, city.name FROM city JOIN city_province ON city.city_code = city_province.city_code WHERE city.city_code = ?', [City_Code]);
    res.render('residence/edit_residence_city', {city: city_info[0], city_province: city_info[0]});

});

router.post('/edit_residence_city/:City_Code', async (req, res) => {
    const {Province_Code, City_Code, City_Name} = req.body;
    const newCity = {
        Province_Code,
        City_Code,
        City_Name,

    };
    await pool.query("CALL updateCity ('" + City_Code + "','" + City_Name + "')");
    res.redirect('/residence/read_residence_city');
});









//District Methods
router.get ('/add_residence_district', async (req, res) => {
    const city_info = await pool.query("SELECT * FROM city");
    res.render('residence/add_residence_district',{city_info});
});

router.post('/add_residence_district', async (req, res) => {
    const {City_Code, District_ID, District} = req.body;
    const newDistrict = {
        City_Code,
        District_ID,
        District,

    };
    await pool.query("CALL insertDistrict ('" + District_ID + "','" + District + "')");
    await pool.query("CALL insertDistrictCity ('" + City_Code + "','" + District_ID + "')");
    res.redirect ('/residence/read_residence_district');
});

router.get('/residence/read_residence_district', async (req, res) =>{
    const district = await pool.query("SELECT DISTINCT country.country_code, country.name, province.province_code, province.province_name, city.city_code, city.name, district.district_id, district.district FROM person JOIN district_person ON person.nid = district_person.nid JOIN district ON district_person.district_id = district.district_id JOIN district_city ON district_city.district_id = district.district_id JOIN city ON district_city.city_code = city.city_code JOIN city_province ON city_province.city_code = city.city_code JOIN province ON city_province.province_code = province.province_code JOIN province_country ON province_country.province_code = province.province_code JOIN country ON province_country.country_code = country.country_code"); 
    res.render('residence/read_residence_district', {district});    
});

router.get('/delete_district/:District_ID', async (req, res) => {
    const {District_ID} = req.params;
    await pool.query("CALL deleteDistrict ('" + District_ID + "')");
    res.redirect('/residence/read_residence_district');
});

router.get('/edit_residence_district/:District_ID', async (req, res) => {
    const {District_ID} = req.params;
    const district_info =  await pool.query ('SELECT district_city.city_code, district.district_id, district.district FROM district JOIN district_city ON district.district_id = district_city.district_id WHERE district.district_id = ?', [District_ID]);
    res.render('residence/edit_residence_district', {district: district_info[0], district_city: district_info[0]});

});

router.post('/edit_residence_district/:District_ID', async (req, res) => {
    const {City_Code, District_ID, District} = req.body;
    const newDistrict = {
        City_Code,
        District_ID,
        District,

    };
    await pool.query("CALL updateDistrict ('" + District_ID + "','" + District + "')");
    res.redirect('/residence/read_residence_district');
});


module.exports = router;

