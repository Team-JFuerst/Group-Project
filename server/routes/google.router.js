const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const axios = require('axios');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

//Google Distance Matrix API call - calculates drive time from point A to point B based on time and traffic
router.get('/distance', rejectUnauthenticated, (req, res) => {
  axios({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial`,
    params: {
      origins: '44.9780806,-93.2634508', //lat and long separated by comma with no spaces
      destinations: '45.0626425,-93.20983', //lat and long separated by comma with no spaces
      departure_time: '1530826200', //convert to Epoch time in seconds
      travel_mode: 'pessimistic',
      key: process.env.GOOGLE_API_KEY || NULL,
    }
  }).then((response) => {
    console.log(response.data.rows)
    res.send(response.data.rows)
  }).catch((error) => {
    console.log('error with distance GET to API', error);
  });
});


//Google Geocoding API - converts addresses to latitude and longitude
router.get('/geocode', rejectUnauthenticated, (req, res) => {
  axios({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/geocode/json?`,
    params: {
      address: '', //street # street name, city, state - no suites, floors, or buildings
      key: process.env.GOOGLE_API_KEY || NULL,
    }
  }).then((response) => {
    console.log(response.data.results)
    res.send(response.data.results)
  }).catch((error) => {
    console.log('error with geocode GET to API', error);
  });
});

//Post lat and lng to the database
router.post('/geocode', rejectUnauthenticated, (req, res) => {
  const Appointment = req.body;
  console.log('POST: /geocode');
  Appointment.findByIdAndUpdate(req.body._id, req.body.lat, req.body.lng)
    .then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      console.log('POST \'/geocode\' error:', error);
      res.sendStatus(500);
    })
});

//Get request from database for appointments
//Loop through each appointment for locations and call geocode api for each address
//parse through returned data and save lat and lng to database

const appointmentLocations = (entireAppointment) => {
  let appointmentLocations = [];
  appointmentLocations.forEach(location => {
    return appointmentLocations.location;
  });
}

//Get request to database for appointment
router.get('/appointments', rejectUnauthenticated, (req, res) => {
  Appointment.find({})
    (async () => {
      try {
        await appointmentLocations; //appointmentLocations.location
        const appointmentLocations = await appointmentLocations(locations);
        await locationGeocodes; //geometry.location.lat and geometry.location.lng
        await saveToDatabase; //lat and lng
        res.sendStatus(201);
      } catch (error) {
        throw error;
      }
    })().catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

const locationGeocodes = (location) => {
  router.get('/geocode', (req, res) => {
    axios({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?`,
      params: {
        address: location, //street # street name, city, state - no suites, floors, or buildings
        key: process.env.GOOGLE_API_KEY || NULL,
      }
    }).then((response) => {
      console.log(response.data.results)
      res.send(response.data.results.geometry.location)
    }).catch((error) => {
      console.log('error with geocode GET to API', error);
    });
  });
}


const saveToDatabase = (lat, lng) => {
  router.post('/geocode', (req, res) => {
    const Appointment = req.body;
    console.log('POST: /geocode');
    Appointment.findByIdAndUpdate(req.body._id, req.body.lat, req.body.lng)
      .then(() => {
        res.sendStatus(200);
      }).catch((error) => {
        console.log('POST \'/geocode\' error:', error);
        res.sendStatus(500);
      })
  });
}


module.exports = router;
