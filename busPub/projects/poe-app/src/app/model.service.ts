import { Injectable } from '@angular/core';

export interface EconModel {
  xscale?: number | undefined,
  yscale?: number,
  xMin?: number,
  xMax?: number,
  demandIntercept?: number,
  supplyIntercept?: number,
  demandSlope?: number,
  supplySlope?: number,
  xStep?: number,
  demandName?: string, //point name
  supplyName?: string, //point name
  price1?: number,
  price2?: number,
  qdUseP1?: boolean,
  qsUseP1?: boolean,
  [key: string]: number | undefined | string | boolean
}

export interface MonopolyModel {
  xscale?: number,
  yscale?: number,
  xMin?: number,
  xMax?: number,
  xStep?: number,
  demandIntercept?: number,
  demandSlope?: number,
  fixed?: number,
  c0?: number,
  c1?: number,
  exponent?: number,
  [key: string]: number | string | undefined | boolean
}

export type points = [number, number, number]



@Injectable({
  providedIn: 'root'
})

export class ModelService {

  constructor() { }

  public demandSupply(userParams: EconModel) {

    let model: EconModel = {
      xscale: 1,
      yscale: 1,
      xMin: 0,
      xMax: 55,
      demandIntercept: 100,
      supplyIntercept: 0,
      demandSlope: 1,
      supplySlope: 1,
      xStep: 10,
      demandName: 'Quantity demanded',
      supplyName: 'Quantity supplied',
      price1: 50,
      price2: 75,
      qdUseP1: true,
      qsUseP1: true
    }
    for (const key in userParams) {
      if (key in userParams) {
        model[key] = userParams[key];
      }
    }

    const yscale = model.yscale!, xscale = model.xscale!;
    let x = model.xMin!, a = model.demandIntercept!, b = model.demandSlope!, c = model.supplyIntercept!, d = model.supplySlope!, xMax = model.xMax!, xStep = model.xStep!;

    let qdPrice = model.qdUseP1! ? model.price1! : model.price2!,
      qsPrice = model.qsUseP1! ? model.price1! : model.price2!;
    let demandSeries = [], supplySeries = [];

    let demand = (x: number): number => {
      return (a - b * x);
    }
    
    let demDescaled = (x: number): number => {
      return yscale * (a - b * x / xscale);
    }

    let supply = (x: number): number => {
      return (c + d * x);
    }

    let supDescaled = (x: number): number => {
      return yscale * (c + d * x / xscale);
    }
    let qd = (y: number) => { return xscale * ((a - y / yscale) / b); }
    let qs = (y: number) => { return xscale * ((y / yscale - c) / d); }

    do {
      let point = {
        name: model.demandName,
        x: x * xscale,
        y: yscale * demand(x)
      }
      let point2 = {
        name: model.supplyName,
        x: x * xscale,
        y: yscale * supply(x)
      }
      demandSeries.push(point);
      supplySeries.push(point2);
      x = x + xStep;

    } while (x <= xMax);

    let eqX = (a - c) / (b + d);
    let eqSeries = [
      { x: 0, y: yscale * demand(eqX), accessibility: { enabled: false } },
      { name: 'Equilibrium:', x: xscale * eqX, y: yscale * demand(eqX), marker: { enabled: true } },
      { x: xscale * eqX, y: 0, accessibility: { enabled: false } }
    ];

    let qsSeries = [
      { x: 10, y: qsPrice, accessibility: { enabled: false } },
      { name: 'q<sup>s</sup>:', x: qs(qsPrice), y: qsPrice, marker: { enabled: true } },
      { x: qs(qsPrice), y: 10, accessibility: { enabled: false } }
    ],
      qdSeries = [
        { x: 10, y: qdPrice, accessibility: { enabled: false } },
        { name: 'q<sup>d</sup>:', x: qd(qdPrice), y: qdPrice, marker: { enabled: true } },
        { x: qd(qdPrice), y: 10, accessibility: { enabled: false } }
      ];

    


    return {
      demand: demandSeries,
      supply: supplySeries,
      EQ: eqSeries,
      QD: qd,
      QS: qs,
      QSseries: qsSeries,
      QDseries: qdSeries,
      demFunct: demDescaled,
      supFunct: supDescaled

    }
  }

  public monopolyModel(userParams: MonopolyModel) {
    
    let model: MonopolyModel = {
      xscale: 1,
      yscale: 1,
      xMin: 0,
      xMax: 100,
      demandIntercept: 100,
      demandSlope: 1,
      xStep: 10,
      fixed: 100,
      c0: 1,
      c1: 10,
      exponent: 1

    }
    for (const key in userParams) {
      if (key in userParams) {
        model[key] = userParams[key];
      }
    }

    const yscale = model.yscale!, xscale = model.xscale!;
    let x = model.xMin!, a = model.demandIntercept!, b = model.demandSlope!, fc = model.fixed!, c0 = model.c0!, c1 = model.c1!, exp = model.exponent!, xMax = model.xMax!, xStep = model.xStep!;

    let demandSeries: any[] = [], mr: any[] = [], mc: any[] = [], atcSeries: any[] = [];


    let demand = (x: number): number => {
      return (a - b * x);
    }
    
    let demDescaled = (x: number): number => {
      return yscale * (a - b * x / xscale);
    }

    let atc = (x: number): number => {
      return fc / x + c0 * Math.pow(x, exp) / x + c1 * Math.pow(x, exp - 1) / x;
    }

    do {
      demandSeries.push(
        {
          x: x,
          y: demand(x)
        }
      );

      x = x + xStep;
    } while( x <= xMax )




    return {
      demand:demandSeries,
      MR: mr,
      MC: mc,
      ATC: atcSeries

    }
  }

  public createArea(points: points[]) {
    let area: any[] = [];

    points.forEach((el) => {
      area.push(
        {
          x: el[0],
          low: el[1],
          high: el[2]
        }
      )
    });


    return area;
  }
}
