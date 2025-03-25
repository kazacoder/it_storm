import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

  @Input()
  formValues = {
    service: '',
    name: '',
    phone: ''
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  proceedBtn(service: string) {
    // some logic
    this.formValues.service = service;
    console.log(this.formValues)
  }
}


const commonDialogSize = {
  // ToDo: need to realize adaptive size
  width: '727px',
  height: '489px',
}

export const dialogConfigs = {
  done: {
    width: commonDialogSize.width,
    height: commonDialogSize.height,
    data: {
      type: 'done',
      service: ''
    }
  },
  service: {
    width: commonDialogSize.width,
    height: commonDialogSize.height,
    data: {
      title: 'Заявка на услугу',
      service: '',
      type: 'service',
      btnText: 'Оставить заявку',
    }
  },
  consult: {
    width: commonDialogSize.width,
    height: commonDialogSize.height,
    data: {
      title: 'Закажите бесплатную консультацию!',
      service: '',
      type: 'consult',
      btnText: 'Оставить заявку',
    }
  },
}
