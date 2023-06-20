import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { ExternalReference } from '@angular/compiler';

@Component({
  selector: 'app-instructor-view',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './instructor-view.component.html',
  styleUrls: ['./instructor-view.component.scss']
})
export class InstructorViewComponent {

  interactive: null | number = null; 

  constructor(private el: ElementRef) { }

  public viewFullscreen() {
    const container = this.el.nativeElement.querySelector('#model');
    container.requestFullscreen();

  }

}
