import { FormComponentBase } from '../../models/form-component-model';

export class DropdownQuestion extends FormComponentBase<string> {
  controlType = 'dropdown';
}