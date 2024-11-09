import fs from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';


// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if  (!city) {
      throw new Error('city cannot be blank');
    }

    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((item) => item.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => {
        return newCity
      })
    }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    try {
      // Retrieve the current list of cities
      const cities = await this.getCities();
      
      // Filter out the city with the specified ID
      const updatedCities = cities.filter(city => city.id !== id);
      
      // Write the updated list back to the searchHistory.json file
      await this.write(updatedCities);
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city from history');
    }
  }
};


export default new HistoryService();