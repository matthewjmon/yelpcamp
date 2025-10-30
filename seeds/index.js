const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb+srv://appuser:StrongPass123@cluster0.l8bz50n.mongodb.net/yelp-camp?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Database connected'))
.catch(err => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
   for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '68ef9e59f83776d4ce59829c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus unde numquam ratione? Adipisci dolore facilis tempora accusantium quasi mollitia molestias reprehenderit debitis doloremque. Distinctio soluta reiciendis reprehenderit facere eveniet dolorem!',
            price,
            images:  [
                {
                url: 'https://res.cloudinary.com/dyj8e4dsr/image/upload/v1761639284/YelpCamp/zdrha68qyeinyo3oyzhi.jpg',
                filename: 'YelpCamp/zdrha68qyeinyo3oyzhi'
                }
              ]
        });
        await camp.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close();
})