import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MacroModelService } from '../macro-model.service';

@Component({
  selector: 'app-macro04ho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './macro04ho.component.html',
  styleUrls: ['./macro04ho.component.scss']
})
export class Macro04hoComponent implements OnInit {

  mode = signal(0);
  constructor(private route: ActivatedRoute, private titleService: Title, private announcer: LiveAnnouncer, private macroModel: MacroModelService ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      const mode = +params['mode'];
      this.mode.set(mode);
      this.setTitle(mode);
      
    });
    
  }


  private setTitle(mode: number) {
    let newTitle = ``;
    switch (mode) {
      case 0:
        newTitle = `Static AD/AS model`;
        break;
      case 1:
        newTitle = `Dynamic AD/AS model`;
        break;
      case 2:
        newTitle = `Monetary policy (dynamic AD/AS)`;
        break;
      case 3:
        newTitle = `Fiscal policy (dynamic AD/AS)`;
        break;
      default:
        break;
    }
    this.titleService.setTitle(newTitle);
  }

}
