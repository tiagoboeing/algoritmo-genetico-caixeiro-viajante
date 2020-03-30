from random import random

from cities import Cities
from distance import Distance

__author__ = 'tiagoboeing'


class Individuals():
    def __init__(self, time_distances, cities, generation=0):
        self.time_distances = time_distances  # 2D array [[], []]
        self.cities = cities  # City list [City(), City()]
        self.generation = generation
        self.note_review = 0
        self.chromosome = []
        self.visited_cities = []
        self.travelled_distance = 0

        # sorteamos uma cidade para criar o cromossomo e verificamos se já foi visitada
        # um cromossomo será o índice das cidades com length = qtde de cidades
        # Ex.: [0, 2, 3, 1] --> [A, C, D, B]
        while len(self.chromosome) < len(cities):
            shuffle_number = round(random() * len(self.cities))
            if shuffle_number not in self.chromosome:
                self.chromosome.append(shuffle_number)

    # Avaliação de aptidão
    def fitness(self):
        note = 0
        sum_distance = 0
        first_city = self.chromosome[0]  # cidade de partida do cromossomo

        for i in range(len(self.chromosome)):
            current_chromosome = self.chromosome[i]
            if current_chromosome not in self.visited_cities:
                d = Distance(self.cities)
                sum_distance += d.getDistance(first_city, current_chromosome)  # somamos o caminho percorrido
                self.visited_cities.append(current_chromosome)  # adiciona cromossomo como cidade visitada
            else:
                # se existir cidade repetida no cromossomo --> descarta
                note = -1
        self.travelled_distance = sum_distance
        self.note_review = note

    # Alteração dos cromossomos para trazer diversidade nas gerações
    def crossover(self, otherIndividual):
        cut = round(random() * len(self.chromosome))

        # primeira parte do cromossomo do outro individuo, com o restante da parte do cromosso atual
        child1 = otherIndividual.chromosome[0:cut] + self.chromosome[cut::]
        child2 = otherIndividual.chromosome[0:cut] + otherIndividual.chromosome[cut::]

        childs = [
            Individuals(self.time_distances, self.cities, self.generation + 1),
            Individuals(self.time_distances, self.cities, self.generation + 1)
        ]

        childs[0].chromosome = child1
        childs[1].chromosome = child2

        return childs

    # Mutação
    def mutate(self, mutationRate):
        for i in range(len(self.chromosome)):
            if random() < mutationRate:
                print("Realizando mutação no cromossomo %s" % self.chromosome[i])
                self.chromosome[i] = round(random() * len(self.chromosome))
                print("Valor após mutação: %s" % self.chromosome[i])
            return self


class GeneticAlgorithm():
    def __init__(self, population_size=20):
        self.populationSize = population_size
        self.population = []
        self.generation = 0
        self.best_solution = 0
        self.cities = cities

    def initPopulation(self, time_distances, cities):
        # timeDistances será um array 2D
        # cities será [City("A", [0, 10]), City("B", [10, 0])]
        for i in range(self.populationSize):
            self.population.append(Individuals(time_distances, cities))

        self.best_solution = self.population[0]

    def sortPopulation(self):
        self.population = sorted(self.population,
                                 key=lambda population: population.note_review,
                                 reverse=True)

    def bestIndividual(self, individual):
        if individual.note_review > self.best_solution.note_review:
            self.best_solution = individual

    # Soma avaliação dos indivíduos
    def sumReviews(self):
        sum = 0
        for individual in self.population:
            sum += individual.note_review
        return sum

    # Seleciona pais (ROLETA)
    def selectParents(self, sumReview):
        parent = -1
        sortedValue = random() * sumReview
        sum = 0
        i = 0
        while i < len(self.population) and sum < sortedValue:
            sum += self.population[i].note_review
            parent += 1
            i += 1
        return parent

    def viewGeneration(self):
        best = self.population[0]
        print("G: %s -> Value: %s Espaço: %s Cromossomo: %s" % (
            best.generation,
            best.note_review,
            best.timeDistances,
            best.chromosome
        ))

    def resolve(self, mutationRate, generations, timeDistances, cities):
        self.initPopulation(timeDistances, cities)
        for individual in self.population:
            individual.fitness()

        self.sortPopulation()
        self.viewGeneration()

        for generation in range(generations):
            sumReviews = self.sumReviews()
            newPopulation = []

            for newIndividuals in range(0, self.populationSize, 2):
                # seleciona dois indivíduos para combinar
                parent1 = self.selectParents(sumReviews)
                parent2 = self.selectParents(sumReviews)

                # cria os filhos a partir de dois pais
                childs = self.population[parent1].crossover(self.population[parent2])

                newPopulation.append(childs[0].mutate(mutationRate))
                newPopulation.append(childs[1].mutate(mutationRate))

            # sobrescreve antiga população eliminando os pais
            self.population = list(newPopulation)

            for individual in self.population:
                individual.fitness()

            # ordena população para melhor solução estar na primeira posição
            self.sortPopulation()
            self.viewGeneration()

            best = self.population[0]
            self.bestIndividual(best)

        print("\nMelhor solução -> G: %s Valor: %s - Cromossomo: %s" % (
            self.best_solution.generation,
            self.best_solution.note_review,
            self.best_solution.chromosome
        ))

        return self.best_solution.chromosome


if __name__ == '__main__':
    populationSize = 20
    mutationRate = 0.01
    generations = 100
    timeDistances = []

    c = Cities()
    c.test()  # carrega cidades para testes
    cities = c.get_cities()

    for city in cities:
        print("\nDistâncias da cidade: %s\n******" % city.name)
        timeDistances.append(city.distances)
        print(city.distances)
        for index, distance in enumerate(city.distances):
            print("De %s --> %s = %s" % (city.name, cities[index].name, distance))

    ga = GeneticAlgorithm(populationSize)
    result = ga.resolve(mutationRate, generations, timeDistances, cities)
