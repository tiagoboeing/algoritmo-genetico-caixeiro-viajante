import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

// tempo em minutos

@Component({
  selector: "app-test1",
  templateUrl: "./test1.component.html",
  styleUrls: ["./test1.component.scss"]
})
export class Test1Component implements OnInit {
  times: { source: string; dest: string; value: number }[] = [];
  manualTimes: { source: string; dest: string; value: number }[] = [];
  form: FormGroup;
  cities: FormArray;

  constructor(private formBuilder: FormBuilder) {
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
    } else {
      console.error("Max cities allowed is 10!");
    }
  }

  removeCity(index: number) {
    if (this.cities && this.cities.length) this.cities.removeAt(index);
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
    cities.forEach(({ name }, index) => {
      for (let i = index; i <= cities.length; i++) {
        const currentCity = cities[i];
        if (currentCity) {
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
      // if (this.cities && this.cities.length && index < this.cities.length - 1) {
      //   console.log("Next: " + this.cities[index + 1].name);
      // }
    });
  }
}
