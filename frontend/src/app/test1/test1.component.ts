import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { NbToastrService, NbWindowService } from "@nebular/theme";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ResultComponent } from "./result/result.component";
import { Test1Service } from "./test1.service";

@Component({
  selector: "app-test1",
  templateUrl: "./test1.component.html",
  styleUrls: ["./test1.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test1Component implements OnInit, OnDestroy {
  public algorithmConfigs = {
    populationSize: 20,
    mutationRate: 1,
    generations: 1000,
  };
  times: Distances[] = [];
  manualTimes: Distances[] = [];
  form: FormGroup;
  cities: FormArray;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: NbToastrService,
    private service: Test1Service,
    private cdr: ChangeDetectorRef,
    private windowService: NbWindowService
  ) {
    this.form = this.formBuilder.group({
      cities: this.formBuilder.array([this.createCity()]),
    });
  }

  createCity(): FormGroup {
    return this.formBuilder.group({
      name: "",
    });
  }

  addCity(): void {
    if (!this.cities || (this.cities && this.cities.length <= 9)) {
      this.cities = this.form.get("cities") as FormArray;
      this.cities.push(this.createCity());

      this.cdr.detectChanges();
    } else {
      console.error("Max cities allowed is 10!");
    }
  }

  removeCity(index: number) {
    if (this.cities && this.cities.length) this.cities.removeAt(index);
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(400))
      .subscribe((group) => this.buildCities(group));
  }

  buildCities({ cities }: any) {
    this.times = [];
    this.manualTimes = [];

    // TODO: create a exclusive method
    cities.forEach(({ name }, index) => {
      for (let i = index; i <= cities.length; i++) {
        const currentCity = cities[i];
        if (currentCity) {
          // A --> A = 0
          if (currentCity.name === name) {
            this.times.push({
              source: currentCity.name,
              dest: name,
              value: 0,
            });
          } else {
            this.manualTimes.push({
              source: name,
              dest: currentCity.name,
              value: null,
            });
          }
        }
      }
    });
    this.cdr.detectChanges();
  }

  parseForMatrix({ cities }: any) {
    this.times = [];
    cities.forEach((_, index) => {
      const currentCity = cities[index].name;
      if (index > 0 && currentCity) {
        const lastCity = cities[index - 1].name;

        this.times.push({
          source: lastCity,
          dest: currentCity,
          value: null,
        });
      }
      if (this.cities && this.cities.length && index < this.cities.length - 1) {
        console.log("Next: " + this.cities[index + 1].name);
      }
    });
  }

  isValidForm(): boolean {
    return !!this.manualTimes.find((el) => el.value);
  }

  getSolution({ cities }: any) {
    this.loading = true;
    this.cdr.detectChanges();

    if (!this.isValidForm()) {
      this.loading = false;
      this.toastr.warning(
        "Necessário preencher as distâncias!",
        "Campos obrigatórios!"
      );
      this.cdr.detectChanges();
      throw Error("Distâncias não informadas.");
    }

    const allDistances = [];

    // A -> B and B -> A are same values
    const citiesReverse = [];
    this.manualTimes.map(({ source, dest, value }) => {
      citiesReverse.push({
        source: dest,
        dest: source,
        value: parseFloat(value),
      });
    });
    const citiesVector = this.manualTimes.concat(citiesReverse);

    const distances = citiesVector.concat(this.times);

    // walks the vector for create a matrix
    cities.forEach((city) => {
      let line = [];

      cities.forEach(({ name }) => {
        if (city.name === name) {
          line.push(0);
        } else {
          const distance = this.searchDistance(city.name, name, distances);
          if (!distance || !distance.value)
            throw Error("Elemento não localizado no array de distâncias");
          line.push(parseFloat(distance.value));
        }
      });

      allDistances.push(line);
    });

    const citiesNames: [] = cities.map(({ name }) => name);
    const { populationSize, mutationRate, generations } = this.algorithmConfigs;
    this.service
      .getSolution(
        citiesNames,
        allDistances,
        generations,
        mutationRate,
        populationSize
      )
      .toPromise()
      .then(({ generation, travelled_distance, chromosome, cities }) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastr.success("Melhor solução obtida!", "Sucesso!");

        this.windowService.open(ResultComponent, {
          title: "Resultado obtido",
          context: {
            generation,
            travelledDistance: travelled_distance,
            chromosome,
            cities,
          },
          closeOnEsc: true,
          closeOnBackdropClick: true,
        });
      })
      .catch((err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastr.danger(
          "O serviço respondeu com um erro, tente novamente!",
          "Opsss..."
        );
        console.error(err);
      });
  }

  searchDistance(from: string, to: string, distances: any[]): Distances {
    return distances.find((el) => el.source === from && el.dest === to);
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }
}

export interface Distances {
  source: string;
  dest: string;
  value: any;
}
