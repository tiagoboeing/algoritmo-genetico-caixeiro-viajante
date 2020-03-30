from cities import Cities


class Distance:
    def __init__(self, cities: Cities):
        self.cities = cities

    def get_distance(self, fromCity: int, toCity: int):
        city1 = self.cities[fromCity]
        total_distance = city1.distances[toCity]
        return total_distance
