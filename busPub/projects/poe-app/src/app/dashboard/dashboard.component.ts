import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() toggle?: string;
  enable: boolean = true;


  ngOnInit() {

    if (this.toggle === undefined) {
      this.enable = true;
    } else {
      this.enable = this.toggle === 'false' ? false : true;
    }


  }
  

}
