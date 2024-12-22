const express = require("express")
const app = express()

app.get('/', (req,res)=>{
    res.send('HI')
})

app.listen(3000, (req,res)=>{
    console.log('LISTENING TO PORT 3000')
})