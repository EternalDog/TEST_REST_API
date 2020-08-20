let express = require("express");
let app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
let fs = require("fs");
let data = JSON.parse(fs.readFileSync("data.json"));
app.listen(3000, () => {console.log("Server running on port 3000");});


//
//REST API
//
let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

//GET
app.get("/list", (req, res, next) => {res.json(data);});

app.get("/listByCategory", (req, res, next) => {
    let cat = req.query.cat;
    let response = [];
    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].category == cat) {
            response.push(data.items[i]);
			//res.send('code 200 (OK)')
        }
    }
    res.json(response);
});

app.get("/listByPrice", (req, res, next) => {  
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let response = [];
    for (let i = 0; i < data.items.length; i++) {       
        if (data.items[i].price >= min && data.items[i].price <= max ) {
            response.push(data.items[i]);
			//res.send('code 200 (OK)')
        }
    }
    res.json(response);
});

app.get("/range", (req, res, next) => {
    let num = req.query.num;
    
    let response = [];
    for (let i = data.items.length - 1; i >= (data.items.length - num); --i) {
        response.push(data.items[i]);
		//res.send('code 200 (OK)')
    }
    res.json(response);
	
});


//POST
app.post("/add", (req, res, next) => {
	req.body.price = parseInt(req.body.price); 
    data.items.push(req.body);
    save();
	//res.send('code 201 (Created)')
});


//PUT
app.put("/edit", (req, res, next) => {
    let item = req.body;
    for (let i = 0; i < data.items.length; i++) {       
        if (data.items[i].name == item.name) {
            data.items[i].price = parseInt(item.price);
            data.items[i].category = item.category;
			//res.send('code 200 (OK)')
        }
    }
    save();
});

//DELETE 
app.delete("/delete", (req, res, next) => {
	let name = req.body.name;
    for (let i = 0; i < data.items.length; i++) {       
        if (data.items[i].name == name) {
            del(i);
			//res.send('code 200 (OK)')
        }
    }
    save();
	
});



//
//Functions
//
function save() {
    fs.writeFile('data.json', (JSON.stringify( data) ), (err) => {  
        if (err) throw err;
        console.log('Data saved');
    });
}

function del(i) {data.items.splice(i, 1);}
