const express  = require ('express');
const router = express.Router ();

const pool = require ('../database');

router.get ('/add_category', (req, res) => {
    res.render('category/add_category');
})

router.post('/add', async (req, res) => {
    const {Category_Code, Category_Name, Status, Description} = req.body;

    const newLink = {
        Category_Code,
        Category_Name,
        Status,
        Description
    };

    await pool.query("CALL insertCategory ('" + newLink.Category_Code + "','" + newLink.Category_Name + "','" + newLink.Status +"','"+ newLink.Description + "')")
    req.flash('success', 'Category added successfully');
    res.redirect ('/category');
});

router.get('/', async (req, res) =>{

    const category = await pool.query("SELECT * FROM category"); //CALL readAllSantasAssistant
    res.render('category/read_category', { category });

});

router.get('/delete/:Category_Code', async (req, res) => {

    const {Category_Code} = req.params;
    await pool.query("CALL deleteCategory ('" + Category_Code + "')");
    req.flash('success', 'Category deleted successfully');
    res.redirect('/category');

});

router.get('/edit_category/:Category_Code', async (req, res) => {
    const {Category_Code} = req.params;
    const ids =  await pool.query ('SELECT * FROM category WHERE category_code= ?', [Category_Code]);
    res.render('category/edit_category', {category: ids[0]});

});

router.post('/edit_category/:Category_Code', async (req, res) => {
    const {ids} = req.params;
    const {Category_Code, Category_Name, Status, Description} = req.body;
    const newLink = {
        Category_Code,
        Category_Name,
        Status,
        Description
    };
    await pool.query("CALL updateCategory ('" + newLink.Category_Code + "','" + newLink.Category_Name + "','" + newLink.Status +"','"+ newLink.Description + "')");
    req.flash('success', 'Category updated successfully');
    res.redirect('/category');
});

module.exports = router;

