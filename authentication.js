

const alert = require('alert');
const express  = require ('express');
const { Store } = require('express-session');
const router = express.Router ();
const pool = require ('../database');

router.get('/signin', (req, res)=>{
    res.render('sign/signin')

});

router.post('/signin', async (req, res) => {
    const {Username, Password, Role} = req.body;
    const Login = {
        Username,
        Password,
        Role
    };
    var objeto = new Object();
    objeto.code = Username;
    const authentication =  await pool.query ("SELECT EXISTS (SELECT user.username, password, role FROM user, santas_assistant WHERE (user.username = '" + Username + "' OR assistant_id = '" + Username + "') AND password = '" + Password + "' AND role = '" + Role + "') AS userValidator");
    var string=JSON.stringify(authentication);
    var json =  JSON.parse(string);
    var results = json[0].userValidator;
    
    if(results==1 && Role=='Santa'){
        res.redirect('/santa_view');
    }

    if(results==1 && Role=='Assistant'){
        res.redirect('/assistant_view');
        function SA_ID() {
            var Storage = require('node-storage');
            var store = new Storage('path/to/file');
            store.put('SAID', Username);
            console.log(store.get('SAID'));
            
            
            //localStorage.setItem('SAID', Username);
            //store.put('SAID', Username);
        } 
        SA_ID();
        
    }

    if(results==1 && Role=='Kid'){
          
        router.get('/children/my_letters', async (req, res) =>{

            const letters_id = await pool.query("SELECT letter.letter_code, 'Letter' AS letter FROM person JOIN kid ON person.nid = kid.nid JOIN user ON person.username = user.username JOIN letter ON kid.kid_id = letter.kid_id WHERE user.username = '" +  Username + "'"); 
            console.log(letters_id);
            res.render('children/my_letters', {letters_id});

        });

        router.get('/children/my_wishlists', async (req, res) =>{

            const wish_id = await pool.query("SELECT wish_list.list_code, 'Wish List' AS wish FROM person JOIN kid ON person.nid = kid.nid JOIN user ON person.username = user.username JOIN wish_list ON kid.kid_id = wish_list.kid_id WHERE user.username = '" + Username + "'");
            res.render('children/my_wishlists', {wish_id});

        });

        router.get('/children/add_letter', async (req, res) =>{
            const kid_idd = await pool.query("SELECT person.name, person.lastname, kid.kid_id FROM person JOIN kid ON person.nid = kid.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'");
            console.log(kid_idd);
            res.render('children/add_letter',{kid_idd});
            
        
        });
        res.redirect('/children_view/children_view');
    }

    if(results==1 && Role=='Parent'){

        router.get('/person_kid/add_person_kid', async (req, res) =>{
            const id = await pool.query("SELECT parent.parent_id FROM parent JOIN person ON person.nid = parent.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'"); 
            res.render('person_kid/add_person_kid',{parent: id[0]});
        });

        router.get('/kid/read_kid', async (req, res) =>{

            const parent_id = await pool.query("SELECT parent.parent_id AS ID FROM parent JOIN person ON person.nid = parent.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'");
            var string=JSON.stringify(parent_id);
            var json =  JSON.parse(string);
            var results = json[0].ID;
            console.log(results);
            const kids = await pool.query("SELECT kid.kid_id, person.name, person.lastname FROM person JOIN kid ON person.nid = kid.nid JOIN parent_kid ON kid.kid_id = parent_kid.kid_id JOIN parent ON parent.parent_id = parent_kid.parent_id WHERE parent.parent_id = '" + results + "'");
            console.log(kids);
            console.log(parent_id);
            res.render('kid/read_kid', {kids});
            //Manda los niños aquí y con las cartitas obtiene el ID
            //En otro lado le mando el Parent_ID
            
        });

        router.get('/parent_view/search_kid_letter', async (req, res)=>{
            const parent_id = await pool.query("SELECT parent.parent_id AS ID FROM parent JOIN person ON person.nid = parent.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'");
            var string=JSON.stringify(parent_id);
            var json =  JSON.parse(string);
            var results = json[0].ID;
            const kids = await pool.query("SELECT kid.kid_id, person.name, person.lastname FROM person JOIN kid ON person.nid = kid.nid JOIN parent_kid ON kid.kid_id = parent_kid.kid_id JOIN parent ON parent.parent_id = parent_kid.parent_id WHERE parent.parent_id = '" + results + "'");
            res.render('parent_view/search_kid_letter', {kids});
        
        });

        router.get('/behavior/add_behavior', async (req, res) =>{

            const parent_id = await pool.query("SELECT parent.parent_id AS ID FROM parent JOIN person ON person.nid = parent.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'");
            var string=JSON.stringify(parent_id);
            var json =  JSON.parse(string);
            var results = json[0].ID;
            const kids = await pool.query("SELECT kid.kid_id, person.name, person.lastname FROM person JOIN kid ON person.nid = kid.nid JOIN parent_kid ON kid.kid_id = parent_kid.kid_id JOIN parent ON parent.parent_id = parent_kid.parent_id WHERE parent.parent_id = '" + results + "'");
            const id = await pool.query("SELECT parent.parent_id FROM parent JOIN person ON person.nid = parent.nid JOIN user ON person.username = user.username WHERE user.username = '" + Username + "'");
            res.render('behavior/add_behavior', {kid: kids, parent: id[0]});   


        });

        router.get('/parent/read_parent', async (req, res) =>{

            const parent = await pool.query("SELECT person.nid, person.email, person.birth_date, person.name, person.lastname, person.username,  district_person.district_id,  district_person.address, district.district, parent.parent_id, telephone_parent.telephone FROM person JOIN parent ON person.nid = parent.nid JOIN district_person ON person.nid = district_person.nid JOIN telephone_parent ON parent.parent_id = telephone_parent.parent_id JOIN user ON person.username = user.username JOIN district ON district_person.district_id = district.district_id WHERE user.username = '" + Username + "'");
            console.log(parent);
            res.render('parent/read_parent', { parent: parent});   

        });
        res.redirect('/parent_view/parent_view')


 
    }

    else{
       // alert("Texto a mostrar");
        //window.alert("Please, check your username, password or role");
        
        res.redirect('/signin');  
    }

    

});

module.exports = router;