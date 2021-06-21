import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ParentDataMappingService } from '../app/services/parent-services/parent-data-mapping.service'

// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


import { FormComponentBase } from '../app/models/form-component-model';
import { DropdownQuestion } from './services/parent-services/form-component-dropdown';
import { TextboxQuestion } from './services/parent-services/form-component-textbox';
import { CheckBoxQuestion } from './services/parent-services/form-component-checkbox';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from './services/parent-services/form-component.service';
import { JsonPipe } from '@angular/common';

import { Properties, Property } from '../app/models/properties.model'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;
  payLoad = '';
  title = 'Sample-Angular';
  parentsData = [];
  questions$: Observable<FormComponentBase<any>[]>;
  questions: FormComponentBase<string>[] = [];
  selectedIndex: number = 0;
  properties: Properties
  ActiveSamplingTime: string
  isValidMessage = true;
  isShowMessageKey = '0'
  currentIndex = 0
  constructor(private _parentDataMappingService: ParentDataMappingService,
    private qcs: QuestionControlService) { }


  ngOnInit(): void {
    this.getSummaryData();
    this.questions$ = this.getQuestions();
    this.form = this.qcs.toFormGroup(this.questions);
  }


  //#region Summary View

  IsObject(val): boolean {
    var IsObjectOrNot = false;
    if (typeof val === 'object') {
      IsObjectOrNot = true;
    }
    return IsObjectOrNot;
  }

  findValue(val, lable): string {

    var data = val.find(parents => parents.Label === lable);
    if (data != undefined)
      return data.Value;
    else
      "";
  }

  async getSummaryData() {
    
    await this._parentDataMappingService.getJsonData().subscribe((response) => {
      if (!!response) {
        var JSONData = JSON.parse(response).Datas;
        this.parentsData = JSONData;

        console.log(this.parentsData);
        var GetFirstParentDataBasedOnSamplingTime = this.parentsData.filter(
          parents => parents.SamplingTime === this.parentsData[0].SamplingTime);
        this.ActiveSamplingTime = this.parentsData[0].SamplingTime;
        localStorage.setItem('DBDataSource', JSON.stringify(GetFirstParentDataBasedOnSamplingTime));

      }
    },
      (error) => {
        if (error.status == 0) {

        } else if (error.status == 500) {

        }
      }
    );
  }

  //#endregion End Summary View

  //#region Dynamic form

  getFormProperties(SamplingTime, index) {
    
    this.selectedIndex = index;
    var GetDataBasedOnSamplingTime = this.parentsData.filter(
      parents => parents.SamplingTime === SamplingTime);
    localStorage.removeItem('DBDataSource');
    localStorage.setItem('DBDataSource', JSON.stringify(GetDataBasedOnSamplingTime));
    this.getQuestions();
    this.updateDynamicFormValues();
    this.ActiveSamplingTime = SamplingTime;
  }

  RenderDetailedView(tab) {
    if (tab.index === 1) {
      this.selectedIndex = 0
      var GetFirstParentDataBasedOnSamplingTime = this.parentsData.filter(
        parents => parents.SamplingTime === this.parentsData[0].SamplingTime);
      localStorage.removeItem('DBDataSource');
      localStorage.setItem('DBDataSource', JSON.stringify(GetFirstParentDataBasedOnSamplingTime));

      this.questions$ = this.getQuestions();
      this.updateDynamicFormValues();
    }
    else {
      this.getSummaryData();
    }
  }
  changeChecked(event) {
    
    let show = true;
    let show3 = true;
    let i = this.selectedIndex
    Object.keys(this.form.controls).forEach((key) => {
      //   // for (let index = 0; index < this.parentsData[i].Properties.length; index++) {

      //   //  if (this.parentsData[i].Properties[index].PropertyType == "3") {
      switch ('1' == '1') {
        case (key === '2'): {
          if (this.form.controls[3] == undefined) {
            this.form.controls[key].setValue(event.target.value == "false" ? true : false);
            show = false;
          }
          else{
          if (this.form.controls[3].value == true || this.form.controls[3].value == "") {
          } else {
            this.form.controls[key].setValue(event.target.value == "false" ? true : false);
            show = false;
          }
        }
          break;
        }
        case (key === '3'): {
          if (show == true) {
            this.form.controls[key].setValue(event.target.value == "false" ? true : false);
          }
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
      // if (key === '2') {
      //   // if (this.form.controls[3].value == "" || this.form.controls[3].value == "true" || this.form.controls[3].value == "false" ) {

      //   // }
      //   // else {


      //     this.form.controls[key].setValue(event.target.value == "false" ? true : false);
      //     show = false;
      // //  }
      // }
      // else if (key === '3') {
      //   if (show == true) {

      //     this.form.controls[key].setValue(event.target.value == "false" ? true : false);
      //   }

      // }
    })
  }
  updateDynamicFormValues() {
    
    const DetailsViewSubscription = this.questions$.subscribe({
      next(position) {
        localStorage.setItem("SummaryView", JSON.stringify(position))
        console.log('Current Position: ', position);
      },
      error(msg) {
        console.log('Error Getting Location: ', msg);
      }
    });
    var dataa = JSON.parse(localStorage.getItem("SummaryView"))
    this.questions = dataa;
    this.form = this.qcs.toFormGroup(this.questions);
    setTimeout(() => {
      this.isValid();
    }, 1000);


  }
  isValid() {
    Object.keys(this.form.controls).forEach(key => {
      this.isValidMessage = this.form.get(key).valid;
      this.isShowMessageKey = key;
    });


  }
  getQuestions() {
    
    this.questions$ = of(<any>[])
    const BindDynamicForm: FormComponentBase<string>[] = []
    var dataa = JSON.parse(localStorage.getItem("DBDataSource"))
    if (dataa.length > 0) {
      const FormProperties = dataa[0].Properties;
      for (let index = 0; index < FormProperties.length; index++) {
        if (FormProperties[index].PropertyType == 0) {
          BindDynamicForm.push(new TextboxQuestion({
            //key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label == 'Length of the road' ? FormProperties[index].Label + '(KM)' : FormProperties[index].Label,
            value: FormProperties[index].Value,
            required: true,
            type: 'text',
            order: 1
          }))
        }
        else if (FormProperties[index].PropertyType == 1) {
          BindDynamicForm.push(new TextboxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label == 'Length of the road' ? FormProperties[index].Label + '(KM)' : FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : FormProperties[index].Value,
            required: true,
            type: 'number',
            order: 2
          }))
        }
        else if (FormProperties[index].PropertyType == 2) {
          BindDynamicForm.push(new TextboxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label == 'Length of the road' ? FormProperties[index].Label + '(KM)' : FormProperties[index].Label,

            // == "Length of the road"? FormProperties[index].Label            :  FormProperties[index].Value.Unit.Symbol,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : FormProperties[index].Value,
            required: true,
            type: 'number',
            order: 3,

          }))
        }
        else if (FormProperties[index].PropertyType == 3) {
          BindDynamicForm.push(new CheckBoxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label == 'Length of the road' ? FormProperties[index].Label + '(KM)' : FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : Boolean(FormProperties[index].Value),
            required: false,
            type: 'checkbox',
            order: 4
          }))
        }
        else {
          BindDynamicForm.push(new CheckBoxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label == 'Length of the road' ? FormProperties[index].Label + '(KM)' : FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : Boolean(FormProperties[index].Value),
            required: false,
            type: 'checkbox',
            order: 5
          }))
        }

      }
      this.questions$ = of(BindDynamicForm.sort((a, b) => a.order - b.order));
      return of(BindDynamicForm.sort((a, b) => a.order - b.order));
    }
    else {
    }
  }

  //#endregion End Dynamic form

  //#region Update Property
  onSubmit() {
    
    //if (this.form.valid) {
    let body = new Properties()
    let i = this.selectedIndex
    let two = true
    let three = true
    let one = true
    body.Properties = []
    body.SamplingTime = this.ActiveSamplingTime;
    //Object.keys(this.form.controls).forEach((key) => {
    // const control = this.form.controls[key];

    // if (key === '1') {
    //   body.Properties.push({
    //     Id: Number(key),
    //     Label: 'Project Name',
    //     PropertyType: 0,
    //     Value: control.value
    //   });
    // }
    // else if (key === '2') {
    //for (let index = 0; index < this.parentsData[i].Properties.length; index++) {

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.controls[key];
      //   for (let key = 0; key < this.form.controls; index++) {

      if (key === '1') {

        // if (this.parentsData[i].Properties[index].PropertyType == "0") {
        body.Properties.push({
          Id: Number(key),
          Label: 'Project Name',
          PropertyType: 0,
          Value: control.value == "" ? 0 : control.value,
        });
        // }
      }
      if (key === '2') {
        let show = true
        for (let index = 0; index < this.parentsData[i].Properties.length; index++) {

          if (show == true) {
            if (this.parentsData[i].Properties[index].PropertyType == "2") {
              body.Properties.push({
                Id: Number(key),
                Label: 'Construction Count',
                PropertyType: 2,
                Value: control.value == "" ? 0 : control.value,
              });
              two = false;
              show = false;
            }
          }
          if (show == true) {
            if (this.parentsData[i].Properties[index].PropertyType == "3") {
              body.Properties.push({
                Id: Number(key),
                Label: 'Is Construction Completed',
                PropertyType: 3,
                Value: control.value == "" ? false : control.value,
              });
              three = false;
              show = false;
            }
          }
          if (show == true) {
            if (this.parentsData[i].Properties[index].PropertyType == "1") {
              body.Properties.push({
                Id: Number(key),
                Label: 'Length of the road',
                PropertyType: 1,
                Value: {
                  "Value": control.value,
                  "Symbol": 'KM',
                  "Unit": {
                    "Id": 1
                  }
                }
              });
              one = false;
              show = false;
            }
          }
        }
      }
      if (key === '3') {
        let show1 = true
        for (let index = 0; index < this.parentsData[i].Properties.length; index++) {

          if (show1 == true) {
            if (two == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "2") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Construction Count',
                  PropertyType: 2,
                  Value: control.value == "" ? 0 : control.value,
                });
                two = false;
                show1 = false;
              }
            }

          } if (show1 == true) {
            if (three == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "3") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Is Construction Completed',
                  PropertyType: 3,
                  Value: control.value == "" ? false : control.value,
                });
                three = false
                show1 = false;
              }
            }
          }
          if (show1 == true) {
            if (one == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "1") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Length of the road',
                  PropertyType: 1,
                  Value: {
                    "Value": control.value,
                    "Symbol": 'KM',
                    "Unit": {
                      "Id": 1
                    }
                  }
                });
                one = false;
                show1 = false;
              }
            }
          }
        }
      }
      if (key === '4') {
        let show1 = true
        for (let index = 0; index < this.parentsData[i].Properties.length; index++) {

          if (show1 == true) {
            if (two == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "2") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Construction Count',
                  PropertyType: 2,
                  Value: control.value == "" ? 0 : control.value,
                });
                two = false;
                show1 = false;
              }
            }

          } if (show1 == true) {
            if (three == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "3") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Is Construction Completed',
                  PropertyType: 3,
                  Value: control.value == "" ? false : control.value,
                });
                three = false
                show1 = false;
              }
            }
          }
          if (show1 == true) {
            if (one == true) {
              if (this.parentsData[i].Properties[index].PropertyType == "1") {
                body.Properties.push({
                  Id: Number(key),
                  Label: 'Length of the road',
                  PropertyType: 1,
                  Value: {
                    "Value": control.value,
                    "Symbol": 'KM',
                    "Unit": {
                      "Id": 1
                    }
                  }
                });
                one = false;
                show1 = false;
              }
            }
          }
        }
      }
    });
    //}
    //   }
    //   else if (key === '3') {
    //     body.Properties.push({
    //       Id: Number(key),
    //       Label: 'Is Construction Completed',
    //       PropertyType: 3,
    //       Value: control.value == "" ? false : control.value,
    //     });
    //   }
    //   else if (key === '4') {
    //     body.Properties.push({
    //       Id: Number(key),
    //       Label: 'Length of the road',
    //       PropertyType: 1,
    //       Value: {
    //         "Value": control.value,
    //         "Symbol": 'KM',
    //         "Unit": {
    //           "Id": 1
    //         }
    //       }
    //     });
    //   }

    //});
    this.payLoad = JSON.stringify(body);

    this._parentDataMappingService.updateJsonData(body).subscribe((response) => {
      if (!!response) {
        alert(response.message);
        this.getSummaryData();
      }
    },
      (error) => {
        if (error.status == 0) {

        } else if (error.status == 500) {

        }
      }
    );
  }
  //}
  //#endregion End Property
}

