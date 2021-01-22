const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get('/parent_view', (req, res)=>{
    res.render('parent_view/parent_view')

});

router.get('/parent_view/search_kid_letter', async (req, res)=>{

    res.render('parent_view/search_kid_letter');

});

router.post('/parent_view/search_kid_letter', async (req, res) => {
    const {First_Date, Second_Date, Kid} = req.body;

    const Search_Kid_Letter = {
        First_Date,
        Second_Date,
        Kid
    };
    console.log(Search_Kid_Letter);
    
    if(First_Date == '' && Second_Date  == ''  && Kid !=null){
        
        router.get('/parent_view/letter_kid_result_1', async (req, res) =>{            
            const kid = await pool.query("SELECT toy.name, toy.age_range, toy.description, toy.photo, toy.cost FROM letter_toy NATURAL JOIN letter NATURAL JOIN kid NATURAL JOIN toy WHERE kid.kid_id = '" + Search_Kid_Letter.Kid + "'");
            const cost = await pool.query("SELECT round(IFNULL(sum(toy.cost), 0),0) AS totalCost FROM letter_toy NATURAL JOIN letter NATURAL JOIN kid NATURAL JOIN toy WHERE kid.kid_id = '" + Kid + "'");
            console.log(cost);
            res.render('parent_view/letter_kid_result_1', {kid, letter: cost[0]});       
        });
        res.redirect ('/parent_view/letter_kid_result_1');
    }   

    else if(First_Date  != null && Second_Date  != null &&  Kid  != null){
        router.get('/parent_view/letter_kid_result_2', async (req, res) =>{
            const range_and_kid = await pool.query("SELECT toy.name, toy.age_range, toy.description, toy.photo, toy.cost FROM letter_toy NATURAL JOIN letter NATURAL JOIN kid NATURAL JOIN toy WHERE kid.kid_id = '" + Kid + "'AND  letter.creation_date BETWEEN '" + Search_Kid_Letter.First_Date + "' AND '" + Search_Kid_Letter.Second_Date + "'");
            const cost = await pool.query("SELECT round(IFNULL(sum(toy.cost), 0),0) AS totalCost  FROM letter_toy NATURAL JOIN letter NATURAL JOIN kid NATURAL JOIN toy WHERE kid.kid_id = '" + Search_Kid_Letter.Kid + "' AND  letter.creation_date BETWEEN '" + Search_Kid_Letter.First_Date + "' AND '" + Search_Kid_Letter.Second_Date + "'");
            console.log(cost);
            res.render('parent_view/letter_kid_result_2', {range_and_kid, letter: cost[0]});      
        });
        res.redirect ('parent_view/letter_kid_result_2');

    }
    
});

module.exports = router;