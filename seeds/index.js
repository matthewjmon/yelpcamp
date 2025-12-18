// index.js
// Minimal, production-ready seeder: guarantees unique images, descriptions and titles.

require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const {
  places,
  descriptors,
  descriptions,
  cloudinaryImages,
  reviewBodies
} = require('./seedHelpers');

const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Connection error:', err));

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

mongoose.connection.once('open', async () => {
  try {
    // clear existing data
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared Campground, Review and User collections.');

    // create a small pool of realistic test users
    const usernamePool = [
      'Hiker', 'Trailblazer', 'NatureLover', 'CampKing', 'StarGazer',
      'Wanderer', 'ForestFan', 'PeakSeeker', 'TentTrekker', 'RiverRunner'
    ];
    const fakeUsers = [];
    for (let i = 0; i < 5; i++) {
      const base = usernamePool[i % usernamePool.length];
      const username = `${base}${Math.floor(Math.random() * 100)}`; // e.g., Hiker42
      const email = `${username.toLowerCase()}@example.com`;
      const user = new User({ username, email });
      // registers with passport-local-mongoose (hashes password)
      await User.register(user, 'password');
      fakeUsers.push(user);
    }
    console.log(`Created ${fakeUsers.length} fake users.`);

    // shuffle pools once to guarantee uniqueness without collisions
    const imagesShuffled = shuffle(cloudinaryImages);
    const descriptionsShuffled = shuffle(descriptions);
    const descriptorsShuffled = shuffle(descriptors);
    const placesShuffled = shuffle(places);
    const citiesShuffled = shuffle(shuffle(cities)); // shuffle cities too

    // determine how many unique campgrounds we can create
    const totalCampgrounds = Math.min(
      imagesShuffled.length,
      descriptionsShuffled.length,
      descriptorsShuffled.length,
      placesShuffled.length
    );

    for (let i = 0; i < totalCampgrounds; i++) {
      const selectedCity = citiesShuffled[i % citiesShuffled.length];

      const camp = new Campground({
        author: fakeUsers[Math.floor(Math.random() * fakeUsers.length)]._id,
        location: `${selectedCity.city}, ${selectedCity.province}`,
        geometry: {
          type: 'Point',
          coordinates: [selectedCity.longitude, selectedCity.latitude]
        },
        title: `${descriptorsShuffled[i]} ${placesShuffled[i]}`, // unique title
        description: descriptionsShuffled[i],                    // unique description
        price: Math.floor(Math.random() * 20) + 10,
        images: [
          { url: imagesShuffled[i], filename: `seed-${i}` }     // unique image
        ]
      });

      await camp.save();

      // attach realistic 1–5 reviews (review bodies may repeat)
      const numReviews = Math.floor(Math.random() * 5) + 1;
      for (let r = 0; r < numReviews; r++) {
        const review = new Review({
          body: sample(reviewBodies),
          rating: Math.floor(Math.random() * 3) + 3, // 3–5
          author: fakeUsers[Math.floor(Math.random() * fakeUsers.length)]._id
        });
        await review.save();
        camp.reviews.push(review);
      }

      await camp.save();
      console.log(`Created campground ${i + 1}/${totalCampgrounds}`);
    }

    console.log('Seeding complete.');
    mongoose.connection.close();

  } catch (err) {
    console.error('Error while seeding:', err);
    mongoose.connection.close();
  }
});








