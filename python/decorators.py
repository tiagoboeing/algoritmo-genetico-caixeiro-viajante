def singleton(cls):
    instances = {}

    def instance():
        if cls not in instances:
            instances[cls] = cls()
        return instances[cls]

    return instance
