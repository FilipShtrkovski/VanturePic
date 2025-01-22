const Posts = require('../models/posts') 
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/vanturePic')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});



const seedDB = async () =>{
    await Posts.deleteMany({})
    for (let i = 0; i < 20; i++) {
        const post = new Posts ({
        author: '678013e7b71409af6f98a8a5',
        title:'Novaci',
        description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus modi quia consequuntur quibusdam repellendus id provident, nam consectetur perferendis sint eum.',
        images:[
            {
            url: 'https://res.cloudinary.com/daiuoiqvv/image/upload/v1737219082/VanturePic/r5jyjnt4npp6b8vyto4v.jpg',
            filename: 'VanturePic/r5jyjnt4npp6b8vyto4v',
          },
          {
            url: 'https://res.cloudinary.com/daiuoiqvv/image/upload/v1737219116/VanturePic/chwjzu2rdydvecdxf4tc.jpg',
            filename: 'VanturePic/chwjzu2rdydvecdxf4tc',
          }
        ]
    })
      await post.save()  
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})