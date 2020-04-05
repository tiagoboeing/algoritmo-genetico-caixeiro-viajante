import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export const REST_URL =
  "https://57ngqizuyi.execute-api.us-east-1.amazonaws.com/default";

@Injectable({
  providedIn: "root",
})
export class Test1Service {
  constructor(private http: HttpClient) {}

  getSolution(
    cities: [],
    distances: any,
    generations?,
    mutationRate?,
    populationSize?
  ): Observable<any> {
    return this.http.post<{ statusCode: number; body: string }>(`${REST_URL}`, {
      cities,
      distances,
      generations,
      mutationRate,
      populationSize,
    });
  }
}
