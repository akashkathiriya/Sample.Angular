import { FormComponentBase } from '../../models/form-component-model';

export class TextboxQuestion extends FormComponentBase<string> {
  controlType = 'textbox';
}