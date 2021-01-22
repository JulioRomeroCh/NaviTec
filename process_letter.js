const { compareSync } = require('bcryptjs');
const { json } = require('express');
const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');

router.get('/inexistent_toy', async (req, res)=>{
    
    const inexistent_toys = await pool.query("SELECT letter.letter_code, inexistent_toy.inexistent_toy_code, inexistent_toy.age_range,  inexistent_toy.description, inexistent_toy.photo, inexistent_toy.name FROM inexistent_toy JOIN inexistent_toy_letter ON inexistent_toy_letter.inexistent_toy_code = inexistent_toy.inexistent_toy_code JOIN letter ON inexistent_toy_letter.letter_code = letter.letter_code WHERE status = 'Requested'");
    const {letter_code, inexistent_toy_code} = req.params;
    res.render('process_letter/inexistent_toy', {inexistent_toys});

});

router.get('/search_letter', async (req, res)=>{
    const person = await pool.query("SELECT kid.kid_id, person.name, person.lastname FROM person JOIN kid ON person.nid = kid.nid");
    const category = await pool.query("SELECT category.category_code,category.category_name FROM category");
    const country = await pool.query("SELECT * FROM country");
    res.render('process_letter/search_letter', {person, category, country});

});

router.post('/search_letter', async (req, res) => {
    const {First_Date, Second_Date, Country, Kid, Category} = req.body;

    const Search_Letter = {
        First_Date,
        Second_Date,
        Country,
        Kid,
        Category
    };
    console.log(Search_Letter);
    
    //Range
    if(First_Date != null && Second_Date !=null && Country == '' && Kid == '' && Category == ''){
        
        router.get('/process_letter/letter_results1', async (req, res) =>{
            
            const range = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code WHERE letter.creation_date between '" + Search_Letter.First_Date +"' AND '" + Search_Letter.Second_Date + "'");
            res.render('process_letter/letter_results1', {range});
        
        });
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date);
        res.redirect ('process_letter/letter_results1');
    }
    
    //Country
    else if(First_Date == '' && Second_Date == '' && Country !=null && Kid =='' && Category == ''){
        //console.log(Search_Letter.Country);
        router.get('/process_letter/letter_results2', async (req, res) =>{

            const country = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code JOIN toy ON letter_toy.toy_code = toy.toy_code WHERE country.name = '" + Search_Letter.Country+"'");
            res.render('process_letter/letter_results2', {country});
        
        });
        res.redirect ('process_letter/letter_results2');

    }

    //Kid
    else if(First_Date == '' && Second_Date == '' && Country =='' && Kid !=null && Category == ''){
        //console.log(Search_Letter.Kid);

        router.get('/process_letter/letter_results3', async (req, res) =>{

            const kid = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON  letter.letter_code = letter_toy.letter_code JOIN toy ON toy.toy_code = letter_toy.toy_code   JOIN kid ON letter.kid_id = kid.kid_id WHERE kid.kid_id = '"+ Search_Letter.Kid+"'");
            res.render('process_letter/letter_results3', {kid});
        
        });
        res.redirect ('process_letter/letter_results3');
        
    }   
    //Category
    else if(First_Date == '' && Second_Date == '' && Country =='' && Kid =='' && Category !=null){
        //console.log(Search_Letter.Category);
        router.get('/process_letter/letter_results4', async (req, res) =>{

            const category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter.letter_code = letter_toy.letter_code JOIN toy ON toy.toy_code = letter_toy.toy_code JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE category.category_name = '" + Search_Letter.Category+ "'");
            res.render('process_letter/letter_results4', {category});
        
        });
        res.redirect ('process_letter/letter_results4');


    }   
    //Range and country
    else if(First_Date != null && Second_Date != null && Country != null && Kid =='' && Category ==''){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Country);
        router.get('/process_letter/letter_results5', async (req, res) =>{

            const range_and_country = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code WHERE letter.creation_date BETWEEN '"+ Search_Letter.First_Date + "' AND '" +Search_Letter.Second_Date +"' AND country.name = '" + Search_Letter.Country + "'");
            res.render('process_letter/letter_results5', {range_and_country});
        
        });
        res.redirect ('process_letter/letter_results5');

    }    
    //Range and kid 
    else if(First_Date != null && Second_Date != null && Country =='' && Kid !=null && Category ==''){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Kid);
        router.get('/process_letter/letter_results6', async (req, res) =>{

            const range_and_kid = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id WHERE letter.creation_date BETWEEN '" + Search_Letter.First_Date + "' AND '"+ Search_Letter.Second_Date+ "' AND kid.kid_id = '" + Search_Letter.Kid+ "'");
            res.render('process_letter/letter_results6', {range_and_kid});
        
        });
        res.redirect ('process_letter/letter_results6');

    }
    //Range and category   
    else if(First_Date != null && Second_Date != null && Country =='' && Kid =='' && Category !=null){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Category);
        router.get('/process_letter/letter_results7', async (req, res) =>{

            const range_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE category.category_name = '"+ Search_Letter.Category+ "' AND letter.creation_date BETWEEN '" + Search_Letter.First_Date+ "' AND '" +Search_Letter.Second_Date + "'");
            res.render('process_letter/letter_results7', {range_and_category});
        
        });
        res.redirect ('process_letter/letter_results7');

    }
    //Country and kid  
    else if(First_Date =='' && Second_Date =='' && Country !=null && Kid !=null && Category ==''){
        //console.log(Search_Letter.Country, Search_Letter.Kid);
        router.get('/process_letter/letter_results8', async (req, res) =>{

            const country_and_kid = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code WHERE country.name = '" +Search_Letter.Country + "' AND kid.kid_id = '" +Search_Letter.Kid + "'");
            res.render('process_letter/letter_results8', {country_and_kid});
        
        });
        res.redirect ('process_letter/letter_results8');

    }    
    //Country and category   
    else if(First_Date =='' && Second_Date =='' && Country !=null && Kid =='' && Category !=null){
        //console.log(Search_Letter.Country, Search_Letter.Category);
        router.get('/process_letter/letter_results9', async (req, res) =>{

            const country_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code  JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE country.name = '"+Search_Letter.Country+"' AND category.category_name = '" +Search_Letter.Category + "'");
            res.render('process_letter/letter_results9', {country_and_category});
        
        });
        res.redirect ('process_letter/letter_results9');

    }
    //Kid and category   
    else if(First_Date =='' && Second_Date =='' && Country =='' && Kid !=null && Category !=null){
        //console.log(Search_Letter.Kid, Search_Letter.Category);
        router.get('/process_letter/letter_results10', async (req, res) =>{

            const kid_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON  letter.letter_code = letter_toy.letter_code JOIN toy ON toy.toy_code = letter_toy.toy_code   JOIN kid ON letter.kid_id = kid.kid_id JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE kid.kid_id = '"+ Search_Letter.Kid+ "' AND  category.category_name = '" +Search_Letter.Category + "'");
            res.render('process_letter/letter_results10', {kid_and_category});
        
        });
        res.redirect ('process_letter/letter_results10');

    }    
    //Range, country and kid  
    else if(First_Date !=null && Second_Date !=null && Country !=null && Kid !=null && Category ==''){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Country, Search_Letter.Kid);
        router.get('/process_letter/letter_results11', async (req, res) =>{

            const range_country_and_kid = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code WHERE letter.creation_date BETWEEN '" + Search_Letter.First_Date+ "' AND '" + Search_Letter.Second_Date + "' AND country.name = '" +Search_Letter.Country + "' AND kid.kid_id = '" +Search_Letter.Kid + "'");
            res.render('process_letter/letter_results11', {range_country_and_kid});
        
        });
        res.redirect ('process_letter/letter_results11');

    }   
    //Range, country and category  
    else if(First_Date !=null && Second_Date !=null && Country !=null && Kid =='' && Category !=null){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Country, Search_Letter.Category);
        router.get('/process_letter/letter_results12', async (req, res) =>{

            const range_country_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE letter.creation_date BETWEEN '" + Search_Letter.First_Date+ "' AND '" +Search_Letter.Second_Date + "' AND country.name = '" +Search_Letter.Country + "' AND category.category_name = '" +Search_Letter.Category + "'");
            res.render('process_letter/letter_results12', {range_country_and_category});
        
        });
        res.redirect ('process_letter/letter_results12');

    }    
    //Range, kid and category  
    else if(First_Date !=null && Second_Date !=null && Country =='' && Kid !=null && Category !=null){

        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Kid, Search_Letter.Category);
        router.get('/process_letter/letter_results13', async (req, res) =>{

            const range_kid_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON  letter.letter_code = letter_toy.letter_code JOIN toy ON toy.toy_code = letter_toy.toy_code   JOIN kid ON letter.kid_id = kid.kid_id JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE kid.kid_id = '" + Search_Letter.Kid+ "' AND  category.category_name = '" + Search_Letter.Category+ "' AND letter.creation_date BETWEEN '" + Search_Letter.First_Date+ "' AND '" + Search_Letter.Second_Date+ "'");
            res.render('process_letter/letter_results13', {range_kid_and_category});
        
        });
        res.redirect ('process_letter/letter_results13');

    }    
    //Country, kid and category  
    else if(First_Date =='' && Second_Date =='' && Country !=null && Kid !=null && Category !=null){
        //console.log(Search_Letter.Country, Search_Letter.Kid, Search_Letter.Category);
        //var {First_Date, Second_Date, Country, Kid, Category} = req.params;
        
        router.get('/process_letter/letter_results14', async (req, res) =>{
            
            const country_kid_and_category = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE kid.kid_id = '" +Search_Letter.Kid + "' AND country.name = '" +Search_Letter.Country + "' AND category.category_name = '" + Search_Letter.Category+ "'");
            console.log(country_kid_and_category);
            res.render('process_letter/letter_results14', {letter: country_kid_and_category[0]});
            
        });
        res.redirect ('process_letter/letter_results14');

    }    
    //Range, country, kid and category (all) 
    else if(First_Date !=null && Second_Date !=null && Country !=null && Kid !=null && Category !=null){
        //console.log(Search_Letter.First_Date, Search_Letter.Second_Date, Search_Letter.Country, Search_Letter.Kid, Search_Letter.Category);
        router.get('/process_letter/letter_results15', async (req, res) =>{

            const all = await pool.query("SELECT DISTINCT letter.letter_code FROM letter_toy JOIN letter ON letter_toy.letter_code = letter.letter_code JOIN toy ON letter_toy.toy_code = toy.toy_code JOIN kid ON letter.kid_id = kid.kid_id JOIN person ON kid.nid = person.nid JOIN  district_person ON district_person.nid = person.nid JOIN district_city ON district_city.district_id = district_person.district_id JOIN city_province ON district_city.city_code = city_province.city_code JOIN province_country ON province_country.province_code = city_province.province_code JOIN country ON  country.country_code = province_country.country_code JOIN toy_category ON toy_category.toy_code = toy.toy_code JOIN category ON category.category_code = toy_category.category_code WHERE kid.kid_id = '" + Search_Letter.Kid+ "' AND country.name = '" + Search_Letter.Country+ "' AND category.category_name = '" +Search_Letter.Category + "' AND  letter.creation_date BETWEEN '" +Search_Letter.First_Date + "' AND '" + Search_Letter.Second_Date+ "'");
            res.render('process_letter/letter_results15', {all});
            
        });
        res.redirect ('process_letter/letter_results15');

    } 
});



router.get('/accept_letter/:Letter_Code', async (req, res) => {
    const {Letter_Code} = req.params;
    console.log(Letter_Code);      
    const toys =  await pool.query ("SELECT toy.name, toy.toy_code FROM toy JOIN letter_toy ON toy.toy_code = letter_toy.toy_code JOIN letter ON letter_toy.letter_code = letter.letter_code WHERE letter_toy.status = 'Requested' AND letter.letter_code = ?", [Letter_Code]);
    //const assistants = await pool.query("SELECT assistant_id, name FROM santas_assistant");
    res.render('process_letter/accept_letter', {Letter_Code, toys});

    const true_false = await pool.query ("SELECT EXISTS (SELECT letter_code FROM assistant_processes_letter WHERE letter_code = '" + Letter_Code + "') AS Result ");
    var string=JSON.stringify(true_false);
    var json =  JSON.parse(string);
    var results = json[0].Result;
    console.log(results);


    //var sa = 'SA1'; 
    function SA_ID() {
        var Storage = require('node-storage');
        var store = new Storage('path/to/file');
        var sa = (store.get('SAID'));
        console.log(store.get('SAID'));
        return sa

    }
    if(results == 0){
        console.log("No está en la base");
        await pool.query("CALL insertAssistantProcessesLetter ('" + Letter_Code + "','" + SA_ID() + "')");
    }
    else if(results == 1){
        console.log("Sí está en la base");
    }


});

router.post('/accept_letter/:Letter_Code', async (req, res) => {
    //Si le quito esto no me trae los datos
    const {Letter_Code} = req.params;
    //Inicio Objeto
    const {Code, Toy} = req.body;
    const Process_Letter = {
        Code,
        Toy
    };
    //Fin objeto
    console.log(Process_Letter.Code);
    console.log(Process_Letter.Toy);
    await pool.query("CALL UpdateStatus ('" + Letter_Code + "','" + Process_Letter.Toy + "')");
    res.redirect('/process_letter/search_letter');

    
});

router.get('/accept_inexistent_toy/:Inexistent_toy_code', async (req, res) => {
    const {Inexistent_toy_code} = req.params;
    const inexistent_toy_data = await pool.query("SELECT letter.letter_code, inexistent_toy.inexistent_toy_code, inexistent_toy.age_range, inexistent_toy.description, inexistent_toy.photo, inexistent_toy.name FROM inexistent_toy JOIN inexistent_toy_letter ON inexistent_toy_letter.inexistent_toy_code = inexistent_toy.inexistent_toy_code JOIN letter ON inexistent_toy_letter.letter_code = letter.letter_code WHERE inexistent_toy.inexistent_toy_code = ?", [Inexistent_toy_code]);
    res.render('process_letter/accept_inexistent_toy', {inexistent_toy : inexistent_toy_data[0], letter : inexistent_toy_data[0]});

});

router.post('/accept_inexistent_toy/:Inexistent_toy_code', async (req, res) => {

    const {Inexistent_toy_code} = req.params;

    const {Letter_Code, Age_Range, Description, Photo, Name, Cost} = req.body;
    const InexistentToy = {
        Letter_Code,
        Age_Range,
        Description,
        Photo,
        Name,
        Cost
    };
    console.log(InexistentToy);
    if(Cost>0.0){
        var status = 'Ready to send';
        await pool.query("CALL insertToy ('" + InexistentToy.Age_Range + "','" + InexistentToy.Description + "','" + InexistentToy.Photo +  "','" + InexistentToy.Cost + "','" + InexistentToy.Name + "')");
        await pool.query("CALL UpdateStatusInexistent ('" + Letter_Code + "','" + Inexistent_toy_code + "','" + status + "')");
        res.redirect('/process_letter/inexistent_toy');
    }
    else{
        var statu = 'Rejected'
        await pool.query("CALL UpdateStatusInexistent ('" + InexistentToy.Letter_Code + "','" + Inexistent_toy_code + "','" + statu + "')");
        res.redirect('/process_letter/inexistent_toy');
    }


    
});



module.exports = router;
