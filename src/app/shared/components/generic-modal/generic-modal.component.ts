import {Component, inject, Input} from '@angular/core';
import {ModalTypes} from '../../../core/interfaces/generic-modal.interface';
import {GenericModalService} from '../../../core/services/generic-modal.service';
import {CustomIconsComponent} from '../custsom-icons/custom-icons.component';

@Component({
  selector: 'app-generic-modal',
  imports: [
    CustomIconsComponent
  ],
  templateUrl: './generic-modal.component.html',
  styleUrl: './generic-modal.component.scss'
})
export class GenericModalComponent {
  @Input() message: string | null = null;
  @Input() modalType: ModalTypes = null;
  modalService = inject(GenericModalService);
}
