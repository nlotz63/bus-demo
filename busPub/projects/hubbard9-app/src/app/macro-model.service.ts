import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MacroModelService {

  c0 = 5;
  mpc = .6;
  T = .25;
  i0 = 1;
  iy = .1;
  ir = .03;

  constructor() { }

  public setParamters(userParams: any) {

    this.c0 = userParams.c0;
    this.mpc = userParams.mpc;
    this.T = userParams.T;
    this.i0 = userParams.i0;
    this.iy = userParams.iy;
    this.ir = userParams.ir;


  }

  private C(x: number) {
    return this.c0 + this.mpc * (x - this.T);
  }

  private I(x: number, r: number) {
    return this.i0 + this.iy * x - this.ir * r;
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
    do {
      let y;
      switch (components) {
        case 0:
          y = this.C(x);
          break;
        case 1:
          y = this.C(x) + this.I(x, 0)
          break;
        case 2:
        default:
          break;
      }

      aeSeries.push(
        {
          x: x,
          y: y
        }
      );

      x = x + 5;

    } while (x <= xMax)



    return {
      consumption: aeSeries
    }


  }



}
