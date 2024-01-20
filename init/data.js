const listing = require("../models/listing.js");
const mongoose = require('mongoose');
let listingData = [
  {
    "title": "Cozy Beach House",
    "description": "Escape to this charming beachfront house with breathtaking views of the ocean. The cozy interior features comfortable furnishings, a fully equipped kitchen, and direct access to the sandy shores. Perfect for a relaxing getaway with friends or family.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 150,
    "location": "Malibu",
    "country": "United States"
  },
  {
    "title": "Modern City Loft",
    "description": "Experience urban living in this sleek and stylish loft in the heart of New York City. The loft boasts floor-to-ceiling windows, modern decor, and easy access to the city's top attractions, restaurants, and nightlife. Ideal for the cosmopolitan traveler.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 200,
    "location": "New York City",
    "country": "United States"
  },
  {
    "title": "Mountain Retreat",
    "description": "Get away from it all in this cozy mountain retreat surrounded by nature's beauty. The cabin offers a tranquil escape with a fireplace, scenic views, and hiking trails nearby. Perfect for those seeking a peaceful mountain getaway.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 180,
    "location": "Aspen",
    "country": "United States"
  },
  {
    "title": "Historic Townhouse",
    "description": "Step back in time in this historic townhouse located in the heart of Charleston's historic district. The meticulously restored interior features period furnishings, elegant architecture, and a private courtyard. A unique experience for history enthusiasts.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 120,
    "location": "Charleston",
    "country": "United States"
  },
  {
    "title": "Charming Cottage",
    "description": "Experience the charm of the English countryside in this delightful cottage in the Cotswolds. Surrounded by picturesque landscapes, the cottage offers a cozy atmosphere, a beautiful garden, and easy access to quaint villages. Ideal for a romantic retreat.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 100,
    "location": "Cotswolds",
    "country": "United Kingdom"
  },
  {
    "title": "Ski Chalet",
    "description": "Hit the slopes and unwind in this luxurious ski chalet in the picturesque town of Chamonix. The chalet features alpine-inspired decor, a hot tub with mountain views, and convenient access to ski trails. Perfect for winter sports enthusiasts.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 250,
    "location": "Chamonix",
    "country": "France"
  },
  {
    "title": "Desert Oasis",
    "description": "Escape to the tranquility of the desert in this stunning oasis in Scottsdale, Arizona. The property boasts a private pool, lush gardens, and modern amenities. Ideal for those seeking a relaxing and luxurious desert retreat.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 160,
    "location": "Scottsdale",
    "country": "United States"
  },
  {
    "title": "Seaside Villa",
    "description": "Enjoy the sound of waves in this stunning seaside villa. The spacious interiors, private pool, and direct beach access make it an ideal spot for a luxurious coastal retreat.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 300,
    "location": "Amalfi Coast",
    "country": "Italy"
  },
  {
    "title": "Eco-Friendly Cabin",
    "description": "Immerse yourself in nature with a stay in this eco-friendly cabin. Surrounded by forests and wildlife, the cabin offers a peaceful getaway with hiking trails and eco-conscious amenities.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 120,
    "location": "Vancouver Island",
    "country": "Canada"
  },
  {
    "title": "Rooftop Studio",
    "description": "Experience city living with a view in this stylish rooftop studio. The modern design, rooftop terrace, and proximity to cultural attractions make it perfect for urban explorers.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 180,
    "location": "Tokyo",
    "country": "Japan"
  },
  {
    "title": "Lakeside Retreat",
    "description": "Unwind by the lake in this cozy retreat surrounded by nature. The cabin features a fireplace, a private dock, and stunning views of the lake. Ideal for a relaxing weekend getaway.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 160,
    "location": "Lake Tahoe",
    "country": "United States"
  },
  {
    "title": "Bohemian Bungalow",
    "description": "Embrace bohemian vibes in this eclectic bungalow. With vibrant decor, a lush garden, and a hammock for relaxation, it's a perfect spot for those seeking a unique and artistic stay.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 90,
    "location": "Bali",
    "country": "Indonesia"
  },
  {
    "title": "Countryside Manor",
    "description": "Experience the charm of the countryside in this elegant manor. Surrounded by rolling hills and vineyards, the manor offers a tranquil escape with wine tastings and scenic landscapes.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 220,
    "location": "Provence",
    "country": "France"
  },
  {
    "title": "Treehouse Retreat",
    "description": "Elevate your stay in this enchanting treehouse retreat. Nestled in the treetops, the cozy cabin features panoramic views and a sense of seclusion for a magical and unique experience.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 130,
    "location": "Costa Rica",
    "country": "Costa Rica"
  },
  {
    "title": "Luxury Penthouse",
    "description": "Indulge in luxury in this sophisticated penthouse. With high-end furnishings, a private terrace, and skyline views, it offers an opulent experience for those seeking the epitome of urban living.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 400,
    "location": "Paris",
    "country": "France"
  },
  {
    "title": "Mountain View Lodge",
    "description": "Breathe in the mountain air in this charming lodge. Nestled in the foothills, the lodge features a fireplace, a hot tub, and panoramic mountain views, making it an ideal retreat for nature lovers.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 190,
    "location": "Banff",
    "country": "Canada"
  },
  {
    "title": "Sunset Beach Cottage",
    "description": "Experience stunning sunsets in this beachfront cottage. With direct access to the beach, a seaside deck, and a cozy interior, it's the perfect spot for a romantic seaside escape.",
    "image": "https://boldtraveller.ca/wp-content/uploads/2022/12/Hotel-Icon-Lobby-Bold-Traveller-Magazine.jpeg",
    "price": 170,
    "location": "Maui",
    "country": "United States"
  }
];



mongoose.connect('mongodb://127.0.0.1:27017/mainDB')
  .then(() => console.log('Connected!'));

listing.insertMany(listingData).then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
})