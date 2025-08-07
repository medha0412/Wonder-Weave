const airlines = ["Indigo", "AirIndia", "Vistara"];

const generateMockFlights = (fromCity, destination) => {
  const mockFlights = [];

  for (let i = 0; i < airlines.length; i++) {
    const departureHour = 6 + i * 2;
    const arrivalHour = departureHour + 3;

    mockFlights.push({
      airline: airlines[i],
      from: fromCity,
      to: destination,
      departure: `${departureHour}:00 AM`,
      arrival: `${arrivalHour}:00 AM`,
      duration: "3h",
      price: `₹${2999 + i * 500}`
    });
  }

  return mockFlights;
};

export default generateMockFlights;