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
  c2?: number,
  exponent?: number,
  [key: string]: number | string | undefined | boolean
}

export interface ppfModel {
  tech1: number,
  tech2: number,
  labor: number,
  exponent: number,
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
      xStep: 1,
      fixed: 100,
      c0: .25,
      c1: 10,
      c2: 10,
      exponent: 2

    }
    for (const key in userParams) {
      if (key in userParams) {
        model[key] = userParams[key];
      }
    }

    const yscale = model.yscale!, xscale = model.xscale!;
    let x = model.xMin!, a = model.demandIntercept!, b = model.demandSlope!, fc = model.fixed!, c0 = model.c0!, c1 = model.c1!, c2 = model.c2!, exp = model.exponent!, xMax = model.xMax!, xStep = model.xStep!;

    let demandSeries: any[] = [], mrSeries: any[] = [], mcSeries: any[] = [], atcSeries: any[] = [];


    let demand = (x: number): number => {
      return (a - b * x);
    }

    let demDescaled = (x: number): number => {
      return yscale * (a - b * x / xscale);
    }

    let qd = (y: number) => { return xscale * ((a - y / yscale) / b); }

    let cost = (x: number): number => {
      return fc + c0 * Math.pow(x, exp) - c1 * Math.pow(x, exp - 1) - c2 * Math.pow(x, exp - 2);
    }

    let atc = (x: number): number => {
      return cost(x) / x;
    }

    let atcExt = (x: number): number => {
      let q = x / xscale;
      return yscale * cost(q) / q;
    }

    let mc = (x: number): number => {
      let term3 = exp >= 3 ? c2 * Math.pow(x, exp - 3) : 0;
      return exp * c0 * Math.pow(x, exp - 1) - (exp - 1) * c1 * Math.pow(x, exp - 2) - term3;
    }

    let revenue = (x: number) => {
      return demDescaled(x) * x;
    }

    let mr = (x: number) => {
      return (a - 2 * b * x);
    }

    let findEqX = (): number => {
      let epsilon = 0.00000001, xLower = model.xMin!, xUpper = xMax, diff: number, eqX: number, count = 0;
      do {
        let midx = (xLower + xUpper) / 2;
        diff = mr(midx) - mc(midx);

        if (diff > 0) {
          xLower = midx;
        } else if (diff < 0) {
          xUpper = midx;
        }
        count++;
        eqX = midx;
      } while (Math.abs(diff) > epsilon && count < 100);
      return eqX;
    }

    do {
      demandSeries.push(
        {
          x: xscale * x,
          y: yscale * demand(x)
        }
      );
      mrSeries.push({
        x: xscale * x,
        y: yscale * mr(x)
      });
      mcSeries.push({
        x: xscale * x,
        y: yscale * mc(x)
      });

      x = x + xStep;
    } while (x <= xMax);

    // non-linear curve
    x = model.xMin! + 2.5;
    do {
      atcSeries.push({
        x: xscale * x,
        y: yscale * atc(x)
      });
      x = x < .3 * xMax ? x + xStep / 10 : x + xStep;
    } while (x <= xMax + xStep*.5);

    // let eqX = xscale*(a - c1) / (2 * (b + c0));
    let eqX = xscale * findEqX();

    let eqSeries = [
      { x: 0, y: demDescaled(eqX) },
      {
        x: eqX, y: demDescaled(eqX), marker: { enabled: true }
      },
      { x: eqX, y: 0 }
    ]




    return {
      demand: demandSeries,
      MR: mrSeries,
      MC: mcSeries,
      ATC: atcSeries,
      EQ: eqSeries,
      revenueFun: revenue,
      atcFun: atcExt,
      demFun: demDescaled,
      QD: qd

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

  public createPPF(userParams: ppfModel) {
    let model: ppfModel = {
      exponent: .5,
      labor: 100,
      tech1: 1,
      tech2: 1,
    }
    for (const key in userParams) {
      if (key in userParams) {
        model[key] = userParams[key];
      }
    }

    let x = 0, labor = model.labor, tech1 = model.tech1, tech2 = model.tech2, exponent = model.exponent;
    let qMax: number, count = 0;
    let ppfSeries = [];
    
    let labor1 = (x: number) => Math.pow(x / tech1, 1 / exponent);
    let q2 = (x: number) => tech2 * Math.pow(labor - labor1(x), exponent);
    let dq2 = (x: number): number => -exponent * tech2 * Math.pow(labor - Math.pow((x / tech1), 1 / exponent), exponent - 1) * (1 / exponent) / Math.pow(tech1, 1 / exponent) * Math.pow(x, 1 / exponent - 1);

    do {
      let y = q2(x) > 0 ? q2(x) : 0;
      ppfSeries.push({
        x: x,
        y: y,
        oppCost: !isFinite(dq2(x)) ? 'infinity' : -dq2(x)
      });
      qMax = y;
      x = x + 1;
      count++;

    } while (qMax > 0 && count <= 999);

    return {
      PPF: ppfSeries
    }





  }
}
