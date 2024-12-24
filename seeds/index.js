const Posts = require('../models/posts') 
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/vanturePic')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});


const seedDB = async () =>{
    await Posts.deleteMany({})
    for (let i = 0; i < 20; i++) {
        const post = new Posts ({
        title:'Novaci',
        desctiption:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus modi quia consequuntur quibusdam repellendus id provident, nam consectetur perferendis sint eum.',
        username:'Violeta',
        image:'https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75'
        })
      await post.save()  
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})