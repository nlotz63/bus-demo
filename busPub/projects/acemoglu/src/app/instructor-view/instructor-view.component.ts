import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-instructor-view',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './instructor-view.component.html',
  styleUrls: ['./instructor-view.component.scss']
})
export class InstructorViewComponent implements AfterViewInit {

  interactive: number = 1; 
  savedInteractive = 1;

  constructor(private el: ElementRef, private router: Router) { }

  ngAfterViewInit(): void {
    this.router.navigate(
      ['/instructor-dashboard/interactive01'],
      {
        queryParams: { mode: 0 },
        skipLocationChange: true
      }
      

    );
  }

  public viewFullscreen() {
    const container = this.el.nativeElement.querySelector('#model');
    container.requestFullscreen();

  }

}
