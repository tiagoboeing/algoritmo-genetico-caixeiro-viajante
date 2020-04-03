import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Test1Service } from "./test1.service";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: "app-test1",
  templateUrl: "./test1.component.html",
  styleUrls: ["./test1.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Test1Component implements OnInit, OnDestroy {
  times: Distances[] = [];
  manualTimes: Distances[] = [];
  form: FormGroup;
  cities: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: NbToastrService,
    private service: Test1Service,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      cities: this.formBuilder.array([this.createCity()])
    });
  }

  createCity(): FormGroup {
    return this.formBuilder.group({
      name: ""
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
      .subscribe(group => this.buildCities(group));
  }

  /**
   *
   * @param param0 FormGroup
   */
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
              value: 0
            });
          } else {
            this.manualTimes.push({
              source: name,
              dest: currentCity.name,
              value: null
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
          value: null
        });
      }
      if (this.cities && this.cities.length && index < this.cities.length - 1) {
        console.log("Next: " + this.cities[index + 1].name);
      }
    });
  }

  isValidForm(): boolean {
    return !!this.manualTimes.find(el => el.value);
  }

  getSolution({ cities }: any) {
    this.cdr.detectChanges();
    if (!this.isValidForm()) {
      this.toastr.warning(
        "Necessário preencher as distâncias!",
        "Campos obrigatórios!"
      );
      throw Error("Distâncias não informadas.");
    }

    const allDistances = [];

    // A -> B and B -> A are same values
    const citiesReverse = [];
    this.manualTimes.map(({ source, dest, value }) => {
      citiesReverse.push({ source: dest, dest: source, value });
    });
    const citiesVector = this.manualTimes.concat(citiesReverse);

    const distances = citiesVector.concat(this.times);

    // walks the vector for create a matrix
    cities.forEach(city => {
      let line = [];

      cities.forEach(({ name }, index) => {
        if (city.name === name) {
          line.push(0);
        } else {
          const distance = this.searchDistance(city.name, name, distances);
          if (!distance || !distance.value)
            throw Error("Elemento não localizado no array de distâncias");
          line.push(distance.value);
        }
      });

      allDistances.push(line);
    });

    const citiesNames: [] = cities.map(({ name }) => name);
    this.service
      .getSolution(citiesNames, allDistances)
      .toPromise()
      .then(res => {
        this.toastr.success("Caminho obtido com sucesso!");
        console.log(res);
      })
      .catch(err => {
        this.toastr.danger(
          "O serviço respondeu com um erro, tente novamente!",
          "Opsss..."
        );
        console.error(err);
      });
  }

  searchDistance(from: string, to: string, distances: any[]): Distances {
    return distances.find(el => el.source === from && el.dest === to);
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }
}

export interface Distances {
  source: string;
  dest: string;
  value: number;
}
