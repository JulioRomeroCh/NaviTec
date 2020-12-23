
var mysql = require ('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'navitec',
    user: 'root',
    /* Add password*/
    password: '260301'
});

connection.connect(function (error){
if (error){
    throw error;
} else {
    console.log ("Excelent connection")
}

});

function SAselect () {
    var SATable = "";
    var query = 'SELECT * FROM santas_assistant';
    connection.query(query, function (err,results){
        if (err) throw err;
            console.log (results);
            for (count =0; count < results.length; count++){
                SATable += '<tr>';
                SATable += '  <td>' + results[count].assistant_id + '</td>';
                SATable += '  <td>' + results[count].name + '</td>';
                SATable += '  <td>' + results[count].start_date + '</td>';
                SATable += '  <td>' + results[count].username + '</td>';
                SATable += '</tr>';
            }
            document.getElementById ('SATable').innerHTML = SATable;
    });
    connection.end(() => { });
};
SAselect();



/*
connection.query ('SELECT * FROM santas_assistant', function (error, results, fields){
if (error)
throw error;
results.forEach (result => {
    console.log (result); 
});
*/
/*connection.end();*/