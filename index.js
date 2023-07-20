const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post("/submit", async(req, res) => {
    const {name, phone_number} = req.body;
    console.log(req.body);
    if(!phone_number || !name){
        return res.status(400).json({
            message: "Please provide phone number and name",
        })
    }
    try{

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        
        const sheets = google.sheets({version: 'v4', auth});
    
        sheets.spreadsheets.values.append({
            auth,
            spreadsheetId: "10Wl2e0Mq0EAFbG-X1XL7ofHZkKoUp-atNeN43M3P_-I",
            range: "Db!A:B",
            valueInputOption: "RAW",
            resource: {
                values: [[name, phone_number]]
            }
        });
        return res.status(200).json({
            message: "Entry submitted"
        })
    }catch(err){
        return res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    }
})

app.listen(port, () => {
    console.log(`App started on port ${port}`)
})