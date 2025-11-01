import {Component} from '@angular/core';
import {GenericModalService} from './core/services/generic-modal.service';
import {GenericModalComponent} from './shared/components/generic-modal/generic-modal.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    GenericModalComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public genericModalService: GenericModalService) {
  }
}
