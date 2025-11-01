export interface IGenericModal {
  isOpen: boolean;
  message: string | null;
  type: ModalTypes;
}

export type ModalTypes = 'SUCCESS' | 'ERROR' | 'LOADING' | null ;
