require("dotenv").config();

const express = require("express")
const nodemailer = require("nodemailer")
const app = express();

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6b155d348ff893",
        pass: "f8308eef5a6b12"
    }
});

app.get("/send-email", async (request, response) => {
    let html = "<h1>Greetings for you</h1>";
    html += "<a href=\"https://youtube.com.br\">Access Youtube</a><br/>"
    html += "<a href=\"https://linkedin.com\">Access Linkedin</a><br/>"
    html += "<a href=\"https://github.com\">Access Github</a><br/>"

    let urlTrackingClick = `${process.env.APP_URL}/tracks/link?url=`;
    let regex = /<a href="(.*?)"/g;
    html = html.replace(regex, `<a href='${urlTrackingClick}$1'`);
    
    html += `<img style='display: none' src='${process.env.APP_URL}/tracks/img' />`

    await transport.sendMail({
        subject: "How can you track click and open?",
        to: "teste@gmail.com",
        from: "tiagoteste@gmail.com",
        html: html
    })

    return response.send({ message: "Email sended success" })
})

app.get("/tracks/img", (request, response) => {
    console.log("TRACK EMAIL OPENED")
    console.log(request.headers)

    let buf = new Buffer.alloc(30);
    response.writeHead(200, { 'Content-Type': 'image/gif' });
    return response.end(buf, 'binary');
})

app.get("/tracks/link", (request, response) => {
    const url = request.query.url
    console.log("TRACK EMAIL LINK CLICKED")
    console.log(request.headers)
    return response.redirect(url)
})

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:3000`))