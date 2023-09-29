import { Injectable } from '@angular/core';

export interface MacroModel {
  c0: number,
  mpc: number,
  t0: number,
  t1: number,
  i0: number,
  iy: number,
  ir: number,
  g0: number,
  nx0: number,
  nxy: number,
  nxyf: number,


  [key: string]: number 
}

@Injectable({
  providedIn: 'root'
})
export class MacroModelService {

  params: MacroModel = {
    c0: 5,
    mpc: .6,
    t0: .25,
    t1: .002,
    i0: 3.4,
    iy: .1,
    ir: .03,
    g0: 3.1,
    nx0: .9,
    nxy: 0,
    nxyf: 0
  }

  constructor() { }

  public setParamters(userParams: any) {

    for (const key in userParams) {
      if (key in userParams) {
        this.params[key] = userParams[key];
      }
    }

  }

  private T(x: number) {
    const param = this.params;
    return param.t0 + param.t1 * x;
  }

  private C(x: number) {
    const param = this.params;
    return param.c0 + param.mpc * (x - this.T(x));
  }

  private I(x: number, r: number) {
    const param = this.params;
    return param.i0 + param.iy * x - param.ir * r;
  }

  public consumptionSeries() {
    let cSeries: any[] = [], x = 0, xMax = 700;

    do {
      cSeries.push(
        {
          x: x,
          y: this.C(x)
        }
      );

      x = x + 5;

    } while (x <= xMax)



    return {
      consumption: cSeries
    }
  }

  public InestmentSeries() {
    let iSeries: any[] = [], x = 0, xMax = 700;

    do {
      iSeries.push({
        x: x,
        y: this.I(x, .02)
      })
      x = x + 5
    } while (x <= xMax);

    return {
      investment: iSeries
    }

  }

  public AE(components: number) {
    let aeSeries: any[] = [], x = 0, xMax = 100;
    const param = this.params;

    do {
      let y;
      switch (components) {
        case 0:
          y = this.C(x);
          break;
        case 1:
          y = this.C(x) + this.I(x, 0);
          break;
        case 2:
          y = this.C(x) + this.I(x, 0) + param.g0;
          break;
        default:
          y = this.C(x) + this.I(x, 0) + param.g0 + param.nx0;
          break;
      }

      aeSeries.push(
        {
          x: x,
          y: y
        }
      );

      x = x + .25;

    } while (x <= xMax)



    return {
      consumption: aeSeries
    }


  }

  public seriesMaker(xMin: number, xMax: number, step: number, myMethod: CallableFunction) {
    let series: any[] = [], x = xMin;

    do {
      series.push({
        x: x,
        y: myMethod(x)

      });

      x = x + step;

    } while (x <= xMax);

    return series

  }



}
