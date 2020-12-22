var mysql = require ('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'navitec',
    user: 'root',
    /* Add password*/
    password: ''
});

connection.connect(function (error){
if (error){
    throw error;
} else {
    console.log ("Excelent connection")
}
});

connection.query ('SELECT * FROM santas_assistant', function (error, results, fields){
if (error)
throw error;
results.forEach (result => {
    console.log (result);
});
});

connection.end();