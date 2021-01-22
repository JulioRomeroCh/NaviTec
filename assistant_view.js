const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get('/assistant_view', (req, res)=>{
    res.render('assistant_view/assistant_view')

});

module.exports = router;