const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get('/children_view', (req, res)=>{
    res.render('children_view/children_view')
});

module.exports = router;