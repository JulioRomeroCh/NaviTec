const express  = require ('express');
const router = express.Router ();

const pool = require ('../database');

router.get ('/add_toy', async (req, res) => {
    const category = await pool.query("SELECT * FROM category");
    res.render('toy/add_toy', { category });
})

router.post('/add', async (req, res) => {
    const { Age_Range, Description, Photo, Cost, Name, Category_Code} = req.body;
    const newToy = {
        Age_Range,
        Description,
        Photo,
        Cost,
        Name,
        Category_Code
    };
    await pool.query("CALL insertToy ('" + newToy.Age_Range + "','" + newToy.Description +"','"+ newToy.Photo + "','"+ newToy.Cost + "','"+ newToy.Name + "')");
    await pool.query("CALL insertToyCategory ('" + newToy.Name + "','" + newToy.Category_Code + "')");
    req.flash('success', 'Toy added successfully');
    res.redirect ('/toy');
});

router.get('/', async (req, res) =>{

    const toy = await pool.query("SELECT category.category_name, toy.toy_code, toy.age_range, toy.description, toy.photo, toy.cost, toy.name FROM toy_category JOIN toy ON toy_category.toy_code = toy.toy_code JOIN category ON toy_category.category_code = category.category_code"); 
    res.render('toy/read_toy', {toy});
    
});

router.get('/delete/:Toy_Code', async (req, res) => {

    const {Toy_Code} = req.params;
    await pool.query("CALL deleteToy ('" + Toy_Code + "')");
    req.flash('success', 'Toy deleted successfully');
    res.redirect('/toy');

});

router.get('/edit_toy/:Toy_Code', async (req, res) => {
    const {Toy_Code} = req.params;
    const ids =  await pool.query ('SELECT * FROM toy WHERE Toy_Code= ?', [Toy_Code]);
    //const cat =  await pool.query ('SELECT category.category_code, category.category_name FROM category JOIN toy_category ON toy_category.category_code = category.category_code JOIN toy ON toy_category.toy_code = toy.toy_code WHERE toy_category.Toy_Code = ?', [Toy_Code]);
    const category = await pool.query ('SELECT * FROM category ');
    res.render('toy/edit_toy', {toy: ids[0], category: category});
});

router.post('/edit_toy/:Toy_Code', async (req, res) => {
    const {ids} = req.params;
    const {Toy_Code, Age_Range, Description, Photo, Cost, Name, Category_Code} = req.body;
    const newToy = {
        Toy_Code,
        Age_Range,
        Description,
        Photo,
        Cost,
        Name,
        Category_Code
    };
    console.log(newToy);
    await pool.query("CALL updateToy ('" + newToy.Toy_Code + "','" + newToy.Age_Range + "','" + newToy.Description +"','"+ newToy.Photo + "','"+ newToy.Cost + "','"+ newToy.Name + "')");
    await pool.query("CALL updateToyCategory ('" + newToy.Toy_Code + "','" + newToy.Category_Code + "')");
    req.flash('success', 'Toy updated successfully');
    res.redirect('/toy');
});

module.exports = router;

