# Algoritmos Genéticos - Problema do Caixeiro Viajante

- A população é de 20 indivíduos (cromossomos)
- A taxa de mutação é de 1%
- A escolha dos pais de uma população para crossover se deu através do método da **roleta viciada**.
- O cálculo do fitness (aptidão) foi realizado com base na soma das distâncias do caminho do cromossomo:
    - Ex.: [4, 2, 0, 1, 3] = 91; onde
        - [4, 2, 0, 1, 3] → [E, C, A, B, D]