import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormComponentBase } from '../../models/form-component-model';

@Injectable()
export class QuestionControlService {
    
    constructor() { }

    toFormGroup(FormComponent: FormComponentBase<string>[]) {
        const group: any = {};

        FormComponent.forEach(question => {
            group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                : new FormControl(question.value || '');
        });
        return new FormGroup(group);
    }
}