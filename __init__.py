import json
from random import random, randint

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
        self.probability = 0

        # Cria cromossomos (não repete cidades)
        # Ex.: [0, 2, 3, 1] --> [A, C, D, B]
        cities = []
        for i in range(len(self.cities)):
            cities.append(i)

        while len(cities) > 0:
            city = randint(0, len(cities) - 1)
            self.chromosome.append(cities.pop(city))

    # Avaliação de aptidão
    def fitness(self):
        sum_distance = 0
        current_city = self.chromosome[0]  # cidade de partida do cromossomo

        for i in range(len(self.chromosome)):
            dest_city = self.chromosome[i]  # cidade atual no grafo
            d = Distance(self.cities)
            distance = d.get_distance(current_city, dest_city)
            sum_distance += distance
            self.visited_cities.append(dest_city)  # adiciona cromossomo como cidade visitada
            current_city = dest_city

        self.travelled_distance = sum_distance

    """
    Alteração dos cromossomos para trazer diversidade nas gerações
    Sorteia um gene no cromossomo e realiza a troca, respeitando o critério de não conter genes duplicados.
    """

    def crossover(self, otherIndividual):
        genes_1 = self.chromosome
        genes_2 = otherIndividual.chromosome
        selected_gene = randint(0, len(genes_1) - 1)
        self.exchange_gene(selected_gene, genes_1, genes_2)
        exchanged_genes = []
        exchanged_genes.append(selected_gene)
        while True:
            duplicated_gene = self.get_duplicated_gene(genes_1, exchanged_genes)
            if (duplicated_gene == -1):
                break
            self.exchange_gene(duplicated_gene, genes_1, genes_2)
            exchanged_genes.append(duplicated_gene)

        childs = [
            Individuals(self.time_distances, self.cities, self.generation + 1),
            Individuals(self.time_distances, self.cities, self.generation + 1)
        ]

        childs[0].chromosome = genes_1
        childs[1].chromosome = genes_2

        return childs

    """
    Realiza combinação dos genes de um cromossomo
    """

    def exchange_gene(self, gene, genes_1, genes_2):
        tmp = genes_1[gene]
        genes_1[gene] = genes_2[gene]
        genes_2[gene] = tmp

    """
    Busca genes duplicados em um cromossomo
    """

    def get_duplicated_gene(self, genes, exchanged_genes):
        for gene in range(len(genes)):
            if gene in exchanged_genes:
                continue

            if len([g for g in genes if g == genes[gene]]) > 1:
                return gene

        return -1

    """
    Mutação
    Sorteia um intervalo de 1% a 100%, se corresponder a taxa de mutação altera os genes
    Respeita o critério de não existir genes duplicados
    """

    def mutate(self, mutationRate):
        # sorteia um intervalo de 1% a 100%
        if randint(1, 100) <= mutationRate:
            print("Realizando mutação no cromossomo %s" % self.chromosome)
            genes = self.chromosome
            gene_1 = randint(0, len(genes) - 1)
            gene_2 = randint(0, len(genes) - 1)
            tmp = genes[gene_1]
            genes[gene_1] = genes[gene_2]
            genes[gene_2] = tmp
            print("Valor após mutação: %s" % self.chromosome)
        return self


class GeneticAlgorithm():
    def __init__(self, population_size=20, cities=[]):
        self.populationSize = population_size
        self.population = []
        self.generation = 0
        self.best_solution: 0
        self.cities = cities

    # time_distances será um array 2D
    # cities será [City("A", [0, 10]), City("B", [10, 0])]
    def init_population(self, time_distances, cities):
        for i in range(self.populationSize):
            self.population.append(Individuals(time_distances, cities))

        self.best_solution = self.population[0]

    def sort_population(self):
        self.population = sorted(self.population,
                                 key=lambda population: population.travelled_distance,
                                 reverse=False)

    # caso encontre um indivíduo com menor distância o marcamos como melhor solução
    def best_individual(self, individual):
        if individual.travelled_distance < self.best_solution.travelled_distance:
            self.best_solution = individual

    """
    Soma distância percorrida por cada indivíduo da população
    """

    def sum_travelled_distance(self):
        sum = 0
        for individual in self.population:
            sum += individual.travelled_distance
        return sum

    """
    Seleciona pais com base na roleta viciada
    As cidades com menores distâncias são as que possuem maior chances de ser sorteadas
    Distância e probabilidade são inversamente proporcionais (quanto menor a distância, maior a chance)
    """

    def select_parents(self, sum_travelled_distances):
        total_coefficient = 0
        parent = -1  # nenhum indivíduo sorteado
        sum = 0
        i = 0

        # criamos um coeficiente baseado na probabilidade do indivíduo ser selecionado e somamos
        for index in range(len(self.population)):
            total_coefficient += (1 / self.population[index].travelled_distance)

        # geramos as probabilidades
        for i_ in range(len(self.population)):
            coefficient = (1 / self.population[i_].travelled_distance)
            self.population[i_].probability = (coefficient / total_coefficient)

        sortedValue = random()  # sorteamos um número da roleta (0 - 1) --> 0% a 100%

        self.sort_population()
        while i < len(self.population) and sum < sortedValue:
            sum += self.population[i].probability
            parent += 1
            i += 1
        return parent

    def view_generation(self):
        best = self.population[0]
        print("G: %s -> Value: %s Cromossomo: %s" % (
            best.generation,
            best.travelled_distance,
            best.chromosome
        ))

    def resolve(self, mutationRate, generations, time_distances, cities):
        self.init_population(time_distances, cities)
        for individual in self.population:
            individual.fitness()

        self.sort_population()
        self.view_generation()

        for generation in range(generations):
            sum_travelled_distance = self.sum_travelled_distance()
            newPopulation = []

            for i in range(0, self.populationSize, 2):
                # seleciona dois indivíduos para reprodução - cai na roleta
                parent1 = self.select_parents(sum_travelled_distance)
                parent2 = self.select_parents(sum_travelled_distance)

                # cria os filhos a partir de dois pais
                childs = self.population[parent1].crossover(self.population[parent2])

                newPopulation.append(childs[0].mutate(mutationRate))
                newPopulation.append(childs[1].mutate(mutationRate))

            # sobrescreve antiga população eliminando os pais
            self.population = list(newPopulation)

            for individual in self.population:
                individual.fitness()
                print("New population %s - Fitness %s" %
                      (individual.chromosome, individual.travelled_distance))

            # ordena população para melhor solução estar na primeira posição
            self.sort_population()
            self.view_generation()

            best = self.population[0]
            self.best_individual(best)

        print("\nMelhor solução -> G: %s - Distância percorrida: %s - Cromossomo: %s" % (
            self.best_solution.generation,
            self.best_solution.travelled_distance,
            self.best_solution.visited_cities
        ))

        return [self.best_solution.generation, self.best_solution.travelled_distance, self.best_solution.visited_cities]


def init(event, context):
    try:
        if event:
            population_size = event['pathParameters']['populationSize']
            mutation_rate = event['pathParameters']['mutationRate']
            generations = event['pathParameters']['generations']
            time_distances = []
        else:
            population_size = 20
            mutation_rate = 1  # 1% - taxa de mutação
            generations = 1000  # critério de parada
            time_distances = []

        c = Cities()
        c.test()  # carrega cidades para testes
        cities_list = c.get_cities()

        for city in cities_list:
            print("Distâncias da cidade: %s\n******" % city.name)
            time_distances.append(city.distances)
            print(city.distances)
            for index, distance in enumerate(city.distances):
                print("De %s --> %s = %s" % (city.name, cities_list[index].name, distance))

        ga = GeneticAlgorithm(population_size)
        result = ga.resolve(mutation_rate, generations, time_distances, cities_list)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'generation': result[0],
                'travelled_distance': result[1],
                'chromosome': result[2]
            })
        }

    except:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': "Erro ao executar"})
        }


if __name__ == "__main__":
    init(None, None)
