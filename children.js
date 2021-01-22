const express  = require ('express');
const router = express.Router ();
const pool = require ('../database');



router.get('/children/read_toys/:category', async (req, res) =>{

    const {category} = req.params;
    console.log(category);
    const toys = await pool.query("SELECT toy.toy_code, toy.name, toy.photo, toy.description FROM toy JOIN toy_category ON toy.toy_code = toy_category.toy_code JOIN category ON toy_category.category_code = category.category_code WHERE category.category_name = '" + category + "'");
    console.log(toys);
    res.render('children/read_toys', {toys});

});

router.get('/children/read_categories', async (req, res) =>{

    const category = await pool.query("SELECT * FROM category WHERE status = 'Active'"); 
    console.log(category);
    res.render('children/read_categories', { category });

});

/*
router.get('/children/my_letters', async (req, res) =>{

    const category = await pool.query("SELECT * FROM category WHERE status = 'Active'"); 
    console.log(category);
    res.render('children/my_letters', { category });

});*/

router.get('/delete/:Letter_Code/:Toy_Code', async (req, res) => {

    const {Letter_Code, Toy_Code} = req.params;

    await pool.query("CALL deleteLetterToy ('" + Toy_Code + "','" + Letter_Code + "')");
    res.redirect('/children/my_letters');

});



router.get('/delete_inexistent/:Inexistent_Toy_Code/:Letter_Code', async (req, res) => {

    const {Inexistent_Toy_Code, Letter_Code} = req.params;

    await pool.query("CALL deleteinexistent_toy_letter ('" + Inexistent_Toy_Code + "','" + Letter_Code + "')");
    res.redirect('/children/my_letters');

});

router.get('/children/my_letters/:Letter_Code', async (req, res) =>{
    const {Letter_Code} = req.params;
    const toys = await pool.query("SELECT letter.letter_code, toy.name, toy.toy_code,  ('Toy') AS tag, toy.description, toy.photo, letter_toy.status FROM toy JOIN letter_toy ON letter_toy.toy_code = toy.toy_code JOIN letter ON letter_toy.letter_code = letter.letter_code WHERE letter.letter_code = '" + Letter_Code + "'"); 
    const inexistent_toys = await pool.query("SELECT letter.letter_code, inexistent_toy.name, ('Special Order') AS tag, inexistent_toy.inexistent_toy_code, inexistent_toy.description,  inexistent_toy.photo, inexistent_toy_letter.status FROM inexistent_toy JOIN inexistent_toy_letter ON  inexistent_toy_letter.inexistent_toy_code = inexistent_toy.inexistent_toy_code JOIN letter ON inexistent_toy_letter.letter_code =  letter.letter_code WHERE letter.letter_code  = '" + Letter_Code + "'"); 
    res.render('children/my_letters_toys', {toys, inexistent_toys});

});


router.get('/children/toys_in_letter/:Letter_Code', async (req, res) =>{
    const {Letter_Code} = req.params;
    const toys = await pool.query("SELECT letter.letter_code, toy.name, toy.toy_code,  ('Toy') AS tag, toy.description, toy.photo, letter_toy.status FROM toy JOIN letter_toy ON letter_toy.toy_code = toy.toy_code JOIN letter ON letter_toy.letter_code = letter.letter_code WHERE letter.letter_code = '" + Letter_Code + "'"); 
    const inexistent_toys = await pool.query("SELECT letter.letter_code, inexistent_toy.name, ('Special Order') AS tag, inexistent_toy.inexistent_toy_code, inexistent_toy.description,  inexistent_toy.photo, inexistent_toy_letter.status FROM inexistent_toy JOIN inexistent_toy_letter ON  inexistent_toy_letter.inexistent_toy_code = inexistent_toy.inexistent_toy_code JOIN letter ON inexistent_toy_letter.letter_code =  letter.letter_code WHERE letter.letter_code  = '" + Letter_Code + "'"); 
    res.render('children/toys_in_letter', {toys, inexistent_toys});

});

router.get('/children/my_wishlists/:List_Code', async (req, res) =>{
    const {List_Code} = req.params;
    const toys = await pool.query("SELECT wish_list.list_code, toy.name, toy.toy_code,  ('Toy') AS tag, toy.description, toy.photo FROM toy JOIN toy_list ON toy_list.toy_code =  toy.toy_code JOIN wish_list ON toy_list.list_code = wish_list.list_code WHERE wish_list.list_code = '" + List_Code + "'"); 
    const inexistent_toys = await pool.query("SELECT wish_list.list_code, inexistent_toy.name, ('Special Order') AS tag, inexistent_toy.inexistent_toy_code, inexistent_toy.description,  inexistent_toy.photo FROM inexistent_toy JOIN inexistent_toy_list ON  inexistent_toy_list.inexistent_toy_code = inexistent_toy.inexistent_toy_code JOIN wish_list ON inexistent_toy_list.list_code = wish_list.list_code WHERE wish_list.list_code = '" + List_Code + "'"); 
    res.render('children/my_wishlists_toys', { toys, inexistent_toys});

});

router.get('/children/add_toy/:toy_code', async (req, res) =>{
    const {toy_code} = req.params;
    console.log(toy_code);
    const name = await pool.query("SELECT toy.toy_code, toy.name FROM toy WHERE toy.toy_code = '" + toy_code + "'");
    res.render('children/add_toy',{name});
});

router.post('/children/add_toy', async (req, res) =>{

    const {Letter_Wish_Code, Toy_Code, Letter_or_Wishlist} = req.body;
    const newOrder = {
        Letter_Wish_Code,
        Toy_Code,
        Letter_or_Wishlist
    };
    var status = 'Requested';
    console.log(newOrder);

    const code_exists = await pool.query("SELECT EXISTS (SELECT letter.letter_code FROM letter WHERE letter.letter_code = '" + Letter_Wish_Code + "') AS letterExists");
    var string=JSON.stringify(code_exists);
    var json =  JSON.parse(string);
    var results = json[0].letterExists;
    console.log(results);

    if(Letter_or_Wishlist == 'Letter' && results==1){
        try{
            await pool.query("CALL insertLetterToy ('" + newOrder.Letter_Wish_Code + "','" + newOrder.Toy_Code + "','" + status +"')");
            await pool.query("CALL updateLetter ('" + Letter_Wish_Code + "')");
            res.redirect('/children_view/children_view');

        }catch(err){
            if(err.code == 'ER_SIGNAL_EXCEPTION')
                res.redirect('/children_view/children_view');  
        }

    }
    if(Letter_or_Wishlist == 'Wishlist' && results==1){
        await pool.query("CALL insertToyList ('" + newOrder.Toy_Code + "','" + newOrder.Letter_Wish_Code + "')");
        res.redirect('/children_view/children_view');
    }
    else{
        res.redirect('/children_view/children_view');

    }

});








router.get('/children/add_toy_from_wish_to_letter/:Toy_Name/:Tag', async (req, res) =>{
    const {Toy_Name, Tag} = req.params;
    console.log(Toy_Name);
    console.log(Tag);
    if(Tag == 'Toy'){
        const info = await pool.query("SELECT toy.toy_code, toy.name FROM toy JOIN toy_list ON toy.toy_code = toy_list.toy_code JOIN wish_list ON wish_list.list_code = toy_list.list_code WHERE toy.name = '" + Toy_Name + "'");
        console.log("info");
        console.log(info);
        res.render('children/add_toy_from_wish_to_letter',{info});
    }
});

router.get('/children/add_toy_from_wish_to_letter_2/:Toy_Name/:Tag', async (req, res) =>{
    const {Toy_Name, Tag} = req.params;
    console.log(Toy_Name);
    console.log(Tag);
    if(Tag== 'Special Order'){
        const info = await pool.query("SELECT inexistent_toy.inexistent_toy_code, inexistent_toy.name FROM inexistent_toy JOIN inexistent_toy_list ON inexistent_toy.inexistent_toy_code = inexistent_toy_list.inexistent_toy_code JOIN wish_list ON wish_list.list_code = inexistent_toy_list.list_code WHERE inexistent_toy.name = '" + Toy_Name + "'");
        console.log("info");
        console.log(info);
        res.render('children/add_toy_from_wish_to_letter_2',{info});   
    }

});


router.post('/children/add_toy_from_wish_to_letter', async (req, res) =>{

    const {Letter_Wish_Code, Toy_Code, Letter_or_Wishlist} = req.body;
    const newOrder = {
        Letter_Wish_Code,
        Toy_Code,
        Letter_or_Wishlist
    };
    console.log(newOrder);
    var status = 'Requested';
    var place = 'Letter';
    const code_exists = await pool.query("SELECT EXISTS (SELECT letter.letter_code FROM letter WHERE letter.letter_code = '" + Letter_Wish_Code + "') AS letterExists");
    var string=JSON.stringify(code_exists);
    var json =  JSON.parse(string);
    var results = json[0].letterExists;
    console.log(results);

    if(Letter_or_Wishlist == 'Letter' && results==1){


        try{
            await pool.query("CALL insertLetterToy ('" + newOrder.Letter_Wish_Code + "','" + newOrder.Toy_Code + "','" + status +"')");
            await pool.query("CALL deleteexistent_toy_list ('" + Toy_Code + "','" + Letter_Wish_Code + "')");
            await pool.query("CALL updateLetter ('" + Letter_Wish_Code + "')");
            res.redirect('/children_view/children_view');
        }catch(err){
            if(err.code == 'ER_SIGNAL_EXCEPTION')
                res.redirect('/children_view/children_view');  
                alert("No way! You already have 1o toys in your letter!");
        }
    }
    else{
        res.redirect('/children_view/children_view');

    }

});


router.post('/children/add_toy_from_wish_to_letter_2', async (req, res) =>{

    const {Letter_Wish_Code, Toy_Code, Letter_or_Wishlist} = req.body;
    const newOrder = {
        Letter_Wish_Code,
        Toy_Code,
        Letter_or_Wishlist
    };
    console.log(newOrder);
    var status = 'Requested';
    var place = 'Letter';
    const code_exists = await pool.query("SELECT EXISTS (SELECT letter.letter_code FROM letter WHERE letter.letter_code = '" + Letter_Wish_Code + "') AS letterExists");
    var string=JSON.stringify(code_exists);
    var json =  JSON.parse(string);
    var results = json[0].letterExists;
    console.log(results);

    if(Letter_or_Wishlist == 'Letter' && results==1){
        try{
            await pool.query("CALL insertInexistentToyToLetter ('" + newOrder.Letter_Wish_Code + "','" + newOrder.Toy_Code + "','" + status +"')");
            await pool.query("CALL deleteinexistent_toy_list ('" + Toy_Code + "','" + Letter_Wish_Code + "')");
            await pool.query("CALL updateLetter ('" + Letter_Wish_Code + "')");
            res.redirect('/children_view/children_view');
        }catch(err){
            if(err.code == 'ER_SIGNAL_EXCEPTION')
                res.redirect('/children_view/children_view');  
        }
    }
    else{
        res.redirect('/children_view/children_view');

    }

});



















router.get('/children/add_inexistent_toy', async (req, res) =>{
    const categories = await pool.query("SELECT * FROM category WHERE status = 'Active' ");
    res.render('children/add_inexistent_toy',{categories});
});

router.post('/children/add_inexistent_toy', async (req, res) =>{

    const {Age_Range, Description, Photo, Name, Category, Letter_Wish_Code, Letter_or_Wishlist} = req.body;
    const newInexistentToy = {
        Age_Range,
        Description,
        Photo,
        Name,
        Category,
        Letter_Wish_Code,
        Letter_or_Wishlist
    };

    await pool.query("CALL insertInexistentToy ('" + newInexistentToy.Age_Range + "','" + newInexistentToy.Description + "','" + newInexistentToy.Photo +"','" + newInexistentToy.Name + "')");
    await pool.query("CALL insertInexistentToyCategory ('" + newInexistentToy.Name + "','" + newInexistentToy.Category + "')");


    var status = 'Requested';
    const code_exists = await pool.query("SELECT EXISTS (SELECT letter.letter_code FROM letter WHERE letter.letter_code = '" + Letter_Wish_Code + "') AS letterExists");
    var string=JSON.stringify(code_exists);
    var json =  JSON.parse(string);
    var results = json[0].letterExists;
    console.log(results);

    if(Letter_or_Wishlist == 'Letter' && results==1){
        await pool.query("CALL insertInexistentToyLetter ('" + newInexistentToy.Letter_Wish_Code + "','" + newInexistentToy.Name + "','" + status +"')");
        res.redirect('/children_view/children_view');
    }
    if(Letter_or_Wishlist == 'Wishlist' && results==1){
        await pool.query("CALL insertInexistentToyList ('" + newInexistentToy.Name + "','" + newInexistentToy.Letter_Wish_Code + "')")
        res.redirect('/children_view/children_view');
    }
    else{
        res.redirect('/children_view/children_view');

    }



    res.redirect('/children_view/children_view');


});



/*
router.get('/children/add_letter', async (req, res) =>{

    res.render('children/add_letter');

});*/


router.post('/children/add_letter', async (req,res) =>{

    const {Letter_Wish_Code, Wish_Code, Kid_ID} = req.body;
    const newLetter = {
        Letter_Wish_Code,
        Kid_ID
    };
    console.log(newLetter);

    const have_letter = await pool.query("SELECT EXISTS (SELECT letter.letter_code FROM letter WHERE YEAR(creation_date) = '2021' AND kid_id = '" + Kid_ID + "') AS confirmation");
    var string=JSON.stringify(have_letter);
    var json =  JSON.parse(string);
    var results = json[0].confirmation;
    console.log(results);
    if(results==1){
        res.redirect('/children/my_letters');
    }
    else{

        await pool.query("CALL insertLetter ('" + newLetter.Letter_Wish_Code + "','" + newLetter.Kid_ID + "')");
        await pool.query("CALL insertWishList ('" + newLetter.Letter_Wish_Code + "','" + newLetter.Kid_ID + "')");
        res.redirect('/children_view/children_view');
    }
});

function message() {

    alert("No way! You have more than 10 toys!");
    
}


module.exports = router;