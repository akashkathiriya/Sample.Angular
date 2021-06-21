import { FormComponentBase } from '../../models/form-component-model';

export class CheckBoxQuestion extends FormComponentBase<string> {
  controlType = 'checkbox';
}