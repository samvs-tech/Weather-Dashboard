
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temp: number;
  windSpeed: number;
  humidity: number;


  constructor(
    cityName: string,
    date: string,
    icon: string,
    description: string,
    temp: number,
    windSpeed: number,
    humidity: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temp = temp;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
 

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(cityName: string) {
    try{
      const query = this.buildGeocodeQuery(cityName);
      const response = await fetch(query)

      const locationData = await response.json();
      console.log(locationData);
      return locationData;
    } catch (err) {
      console.log('error fetching location', err)
      return err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    console.log({locationData});
    return {lat, lon}
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${cityName}&appid${this.apiKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    console.log({lat, lon});
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    try {
      const locationArray = await this.fetchLocationData(cityName);

      if(!locationArray || locationArray.length === 0) {
        throw new Error('Could not find location')
      }

      const locationData = locationArray[0];
      return this.destructureLocationData(locationData);  // Call destructureLocationData here
  } catch (error) {
    console.error('Error fetching and destructuring location data:', error);
    throw error;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData({lat, lon}: Coordinates) {
    const response = await fetch(`${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`);
    const weatherData = await response.json();
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const cityName = response.name;
    const date = new Date(response.dt * 1000).toISOString(); // Convert timestamp to ISO string
    const icon = response.weather[0].icon;
    const description = response.weather[0].description;
    const temp = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;

  return new Weather(cityName, date, icon, description, temp, windSpeed, humidity);
  };
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      const date = new Date(data.dt * 1000).toISOString();
      const icon = data.weather[0].icon;
      const description = data.weather[0].description;
      const temp = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
  
      return new Weather(currentWeather.cityName, date, icon, description, temp, windSpeed, humidity);
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }>  {
    try {
      const locationData = await this.fetchAndDestructureLocationData(city);
  
      if (!locationData) {
        throw new Error('Location not found.');
      }
  
      const weatherData = await this.fetchWeatherData(locationData);
  
      const currentWeather = this.parseCurrentWeather(weatherData);
      
      const forecastResponse = await fetch(this.buildWeatherQuery(locationData));
      const forecastData = await forecastResponse.json();
      const forecastArray = this.buildForecastArray(currentWeather, forecastData.list);
  
      return { current: currentWeather, forecast: forecastArray };
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }


};

export default new WeatherService();


