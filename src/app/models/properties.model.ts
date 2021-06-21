
import { DecimalPipe } from '@angular/common';
export class Properties {
    SamplingTime: string;
    Properties: Property[]
}
export class Property {
    Id: number;
    Value: object;
    Label: string;
    PropertyType: number
}