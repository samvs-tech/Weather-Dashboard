import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    
    // Get weather data using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    // Save the city to search history using HistoryService
    await HistoryService.addCity(cityName);

    // Respond with the weather data
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Fetch search history using HistoryService
    const history = await HistoryService.getCities();

    // Respond with the search history
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete city from history using HistoryService
    await HistoryService.removeCity(id);

    res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
