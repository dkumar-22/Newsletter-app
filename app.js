const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const fname = req.body.fName;
    const lname = req.body.lName;
    const email = req.body.eMail;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
            }

        }]
    }

    const jsondata = JSON.stringify(data);
    //console.log(jsondata);

    const url = 'https://us7.api.mailchimp.com/3.0/lists/ca1a994fc5';
    const options = {
        method: "POST",
        auth: "dkumar:9bb77dc70965652acc8fafd917596f06-us7",
    };

    const request = https.request(url, options, (response) => {

        response.on("data", (d) => {
            const ans = JSON.parse(d);
            console.log(ans);
            if (ans.error_count == 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    request.write(jsondata); //to write to the server
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Service started at 3000.");
});

//9bb77dc70965652acc8fafd917596f06-us7