from cities import Cities

class Distance:
    def __init__(self, cities: Cities):
        self.cities = cities

    def getDistance(self, fromCity: int, toCity: int):
        city1 = self.cities.get_city(fromCity)
        total_distance = city1.distances[toCity]
        return total_distance