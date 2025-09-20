import axios from 'axios'

export const getLocation = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.GEOAPIFY_KEY;
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: `getLocation error ${error.message}` });
  }
};
