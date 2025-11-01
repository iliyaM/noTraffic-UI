import {Injectable, signal, WritableSignal} from '@angular/core';
import {IGenericModal, ModalTypes} from '../interfaces/generic-modal.interface';

@Injectable({
  providedIn: 'root'
})
export class GenericModalService {

  modalState: WritableSignal<IGenericModal> = signal<IGenericModal>({
    isOpen: false,
    type: null,
    message: null
  });

  constructor() {
  }

  open(type: ModalTypes, message: string | null) {
    this.modalState.set({isOpen: true, type, message});
  }

  close() {
    this.modalState.update((state: IGenericModal) => ({...state, isOpen: false}));
  }
}
