
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Search for flights
// @route   GET /api/transport/flights/search
// @access  Private
exports.searchFlights = async (req, res, next) => {
  try {
    const { origin, destination, departureDate, returnDate, adults } = req.query;
    
    if (!origin || !destination || !departureDate) {
      return next(new ErrorResponse('Please provide origin, destination, and departure date', 400));
    }
    
    // Using Skyscanner API (via RapidAPI) for real-time flight data
    const response = await axios.get(
      'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/' + 
      `${origin}/${destination}/${departureDate}`,
      {
        params: {
          inboundpartialdate: returnDate || ''
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
      }
    );
    
    // Process and format the flight data
    const quotes = response.data.Quotes;
    const carriers = response.data.Carriers;
    const places = response.data.Places;
    
    

const flights = quotes.map(quote => {
    const outboundCarrier = carriers.find(carrier => carrier.CarrierId === quote.OutboundLeg.CarrierIds[0]);
    const originPlace = places.find(place => place.PlaceId === quote.OutboundLeg.OriginId);
    const destinationPlace = places.find(place => place.PlaceId === quote.OutboundLeg.DestinationId);
    
    return {
      flightId: quote.QuoteId,
      price: quote.MinPrice,
      direct: quote.Direct,
      airline: outboundCarrier ? outboundCarrier.Name : 'Multiple Airlines',
      departureDate: quote.OutboundLeg.DepartureDate,
      originCity: originPlace ? originPlace.CityName : origin,
      originCode: originPlace ? originPlace.IataCode : origin,
      destinationCity: destinationPlace ? destinationPlace.CityName : destination,
      destinationCode: destinationPlace ? destinationPlace.IataCode : destination
    };
  });
  
  res.status(200).json({
    success: true,
    count: flights.length,
    data: flights
  });
} catch (err) {
  next(err);
}
};

// @desc    Get flight details
// @route   GET /api/transport/flights/:flightId
// @access  Private
exports.getFlightDetails = async (req, res, next) => {
try {
  const { flightId } = req.params;
  const { origin, destination, departureDate } = req.query;
  
  if (!origin || !destination || !departureDate) {
    return next(new ErrorResponse('Please provide origin, destination, and departure date', 400));
  }
  
  // Using Skyscanner API for flight details
  const response = await axios.get(
    'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/' + 
    `${origin}/${destination}/${departureDate}`,
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
      }
    }
  );
  
  const quote = response.data.Quotes.find(q => q.QuoteId.toString() === flightId);
  
  if (!quote) {
    return next(new ErrorResponse(`Flight not found with id of ${flightId}`, 404));
  }
  
  const carriers = response.data.Carriers;
  const places = response.data.Places;
  
  const outboundCarrier = carriers.find(carrier => carrier.CarrierId === quote.OutboundLeg.CarrierIds[0]);
  const originPlace = places.find(place => place.PlaceId === quote.OutboundLeg.OriginId);
  const destinationPlace = places.find(place => place.PlaceId === quote.OutboundLeg.DestinationId);
  
  const flightDetails = {
    flightId: quote.QuoteId,
    price: quote.MinPrice,
    direct: quote.Direct,
    airline: outboundCarrier ? outboundCarrier.Name : 'Multiple Airlines',
    departureDate: quote.OutboundLeg.DepartureDate,
    originCity: originPlace ? originPlace.CityName : origin,
    originCode: originPlace ? originPlace.IataCode : origin,
    destinationCity: destinationPlace ? destinationPlace.CityName : destination,
    destinationCode: destinationPlace ? destinationPlace.IataCode : destination
  };
  
  res.status(200).json({
    success: true,
    data: flightDetails
  });
} catch (err) {
  next(err);
}
};

// @desc    Search for trains
// @route   GET /api/transport/trains/search
// @access  Private
exports.searchTrains = async (req, res, next) => {
try {
  const { origin, destination, date } = req.query;
  
  if (!origin || !destination || !date) {
    return next(new ErrorResponse('Please provide origin, destination, and date', 400));
  }
  
  // Using IRCTC API (via RapidAPI) for real-time train data
  // Note: This might need to be replaced with a different API based on region
  const response = await axios.get(
    'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
    {
      params: {
        fromStationCode: origin,
        toStationCode: destination,
        dateOfJourney: date
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    }
  );
  
  if (!response.data.data || response.data.data.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }
  
  const trains = response.data.data.map(train => ({
    trainId: train.train_number,
    trainName: train.train_name,
    departureTime: train.depart_time,
    arrivalTime: train.arrival_time,
    duration: train.travel_time,
    departureStation: train.from_station_name,
    arrivalStation: train.to_station_name,
    classes: train.class_type || [],
    days: train.run_days || []
  }));
  
  res.status(200).json({
    success: true,
    count: trains.length,
    data: trains
  });
} catch (err) {
  next(err);
}
};

// @desc    Get train details
// @route   GET /api/transport/trains/:trainId
// @access  Private
exports.getTrainDetails = async (req, res, next) => {
try {
  const { trainId } = req.params;
  
  // Using IRCTC API for train details
  const response = await axios.get(
    'https://irctc1.p.rapidapi.com/api/v1/trainSchedule',
    {
      params: {
        trainNo: trainId
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    }
  );
  
  if (!response.data.data) {
    return next(new ErrorResponse(`Train not found with id of ${trainId}`, 404));
  }
  
  const trainDetails = {
    trainId: trainId,
    trainName: response.data.data.train_name,
    trainNumber: trainId,
    schedule: response.data.data.route_data.map(stop => ({
      stationName: stop.station_name,
      stationCode: stop.station_code,
      arrivalTime: stop.arrival_time,
      departureTime: stop.departure_time,
      distance: stop.distance_travelled,
      day: stop.day
    })),
    classes: response.data.data.class_type || [],
    runDays: response.data.data.run_days || []
  };
  
  res.status(200).json({
    success: true,
    data: trainDetails
  });
} catch (err) {
  next(err);
}
};
