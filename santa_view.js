const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get('/santa_view', (req, res)=>{
    res.render('santas_view/santa_view')

});

module.exports = router;