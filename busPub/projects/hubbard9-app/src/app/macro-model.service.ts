import { Injectable } from '@angular/core';

export interface MacroModel {
  c0: number,
  cr: number,
  cy: number,
  t0: number,
  ty: number,
  i0: number,
  iy: number,
  ir: number,
  g0: number,
  gy: number,
  nx0: number,
  nxy: number,
  nxyf: number,
  nxr: number,
  nxrf: number,
  M: number,
  P: number,
  l0: number,
  lr: number,
  piE: number,
  ly: number,
  xScale?: number,
  yScale?: number

  [key: string]: number | undefined
}

@Injectable({
  providedIn: 'root'
})
export class MacroModelService {

  params: MacroModel = {
    c0: 1,
    cr: 0,
    cy: .6,
    t0: .25,
    ty: 0,
    i0: 2,
    iy: .01,
    ir: .03,
    g0: 3.1,
    gy: 0,
    nx0: 0,
    nxy: 0,
    nxyf: 0,
    nxr: 0,
    nxrf: 0,
    M: 2,
    P: 1,
    l0: 5,
    lr: .5,
    ly: .5,
    piE: 2
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
    return param.t0 + param.ty * x;
  }

  private C = (x: number) => {
    const param = this.params;
    return param.c0 + param.cy * (x - this.T(x));
  }

  private I = (x: number, r: number) => {
    const param = this.params;
    return param.i0 + param.iy * x - param.ir * r;
  }

  private G = (x: number) => {
    const param = this.params;
    return param.g0 + param.gy * x;
  }

  private IS = (x: number) => {
    return  (this.params.c0 + this.params.g0 + this.params.i0 - this.params.cy * this.params.t0 - x + this.params.cy * x - this.params.nxy * x - this.params.cy * this.params.ty * x + this.params.nx0 +
      this.params.nxrf * this.params.nxrf + this.params.nxyf * this.params.nxyf) / (this.params.cr + this.params.ir + this.params.nxr);
  }

  private LM = (x: number) => { return (-this.params.M + this.params.l0 * this.params.P - this.params.lr * this.params.P * this.params.piE + this.params.ly * this.params.P * x) / (this.params.lr * this.params.P); }

  private findEq = (xLower: number, xUpper: number, objective1: CallableFunction, objective2: CallableFunction) => {
    let epsilon = 0.00000001, diff: number, eqX: number, count = 0;

    do {
      let midx = (xLower + xUpper) / 2;
      diff = objective2(midx) - objective1(midx);

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


  public AE(components: string) {
    let aeSeries: any[] = [], x = 0, xMax = 100;
    const param = this.params;

    do {
      let y;
      switch (components) {
        case 'C':
          y = this.C(x);
          break;
        case 'I':
          y = this.IS(x);
          break;
        case 'G':
          y = param.g0;
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
    const eq = this.findEq(0, 28, (value: number) => value, this.IS)

    console.log(eq);

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
