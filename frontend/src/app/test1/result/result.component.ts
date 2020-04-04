import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  @Input() generation: number;
  @Input() travelledDistance: number;
  @Input() chromosome: string;
  @Input() cities: string;

  customColumn = "name";
  defaultColumns = ["value"];
  allColumns = [this.customColumn, ...this.defaultColumns];
  data: TreeNode<FSEntry>[] = [];

  constructor() {}

  ngOnInit(): void {
    this.data = [
      {
        data: {
          name: "Geração",
          value: this.generation,
        },
      },
      {
        data: {
          name: "Distância total",
          value: this.travelledDistance,
        },
      },
      {
        data: {
          name: "Cromosomos",
          value: this.chromosome,
        },
      },
      {
        data: {
          name: "Cidades visitadas",
          value: this.cities,
        },
      },
    ];
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  value: any;
}
