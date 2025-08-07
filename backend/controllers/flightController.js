
export const getFlights = async (req, res) => {
  const { source, destination, date } = req.query;

  if (!source || !destination || !date) {
    return res.status(400).json({
      success: false,
      message: "Source, destination, and date are required.",
    });
  }

  // Mock flight data (replace later with real API calls)
  const mockFlights = [
    {
      airline: "IndiGo",
      flightNumber: "6E-123",
      departureTime: "09:00",
      arrivalTime: "11:00",
      price: 3200,
      source,
      destination,
      date,
    },
    {
      airline: "Air India",
      flightNumber: "AI-456",
      departureTime: "15:00",
      arrivalTime: "17:30",
      price: 4500,
      source,
      destination,
      date,
    },
  ];

  res.status(200).json({
    success: true,
    flights: mockFlights,
  });
};
