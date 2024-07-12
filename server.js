const express = require('express')
const app = express()
const port = 3000
const url = 'mongodb+srv://dbAdmin:monms31lvtyyk@cluster0.q4dhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(url);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/shop/', async function (req, res) {
    var amount = isNaN(parseInt(req.query.amount)) ? 1 : parseInt(req.query.amount);
    /*var type;
    switch (req.query.shoptype) {
        case "Smithy": type = ""; break;
        case "Fletcher": type = ""; break;
        case "Magic Shop": type = ""; break;
        case "Gunsmith": type = ""; break;
        case "Alchemist": type = "Consumables"; break;
        case "Adventuring Gear": type = "Adventuring Gear"; break;
        case "Any": type = ""; break;
    }*/
    console.log(req.query);
    res.header("Access-Control-Allow-Origin", '*');
    client.connect()
    const aggResult = await client.db('pathfinder-shop')
        .collection('pathfinder-shop')
        .aggregate([
            {
                $match: {
                    level: { $lte: parseInt(req.query.maxlevel), $gte: parseInt(req.query.minlevel) },
                    source_category: "Rulebooks",
                    rarity: 'common'
                }
            }, {
                $sample: { size: amount }
            }])
    var resultArray = [];
    for await (const document of aggResult) {
        resultArray.push(document);
    }
    res.send(resultArray);
    /* await aggResult.toArray(function (err, result) {
         if (err) res.send("Error");
         console.log("Result" + result);
         res.send(result);
     });*/
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
