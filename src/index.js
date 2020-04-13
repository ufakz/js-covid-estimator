const express = require('express');
const logger = require('morgan')
const jsonxml = require('jsontoxml')
const estimator = require('./estimator')
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(logger(":method\t\t:url\t\t:status\t\t:response-time ms",{
    stream: fs.createWriteStream(`${__dirname}/../public/api.log`,{flags: 'a'})
}));

const inputData = {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 4,
        avgDailyIncomePopulation: 0.73
    },
    periodType: "days",
    timeToElapse: 38,
    reportedCases: 2747,
    population: 92931687,
    totalHospitalBeds: 678874
}

const respondJson = (req,res) => {
    const result = estimator(inputData);
    res.set('Content-Type','application/json');
    res.send(result);
}

const respondXml = (req,res) => {
    const jsonResult = estimator(inputData);
    const xmlResult = jsonxml(jsonResult);
    res.set('Content-Type','application/xml');
    res.send(xmlResult);
}

const respondLogs = (req,res) => {
    const file = fs.createReadStream(`${__dirname}/../public/api.log`,{flags:'r'});
    res.set('Content-Type','text/plain')
    file.pipe(res)
}

app.get('/api/v1/on-covid-19', respondJson)
app.get('/api/v1/on-covid-19/json',respondJson)
app.get('/api/v1/on-covid-19/xml',respondXml)
app.get('/api/v1/on-covid-19/logs',respondLogs)
app.get('*',(req,res)=>{
    res.write("Please use the api endpoints")
})

const port = process.env.PORT || 3000

app.listen(port,() => console.log(`Listening on ${port}`))