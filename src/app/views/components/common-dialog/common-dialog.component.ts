import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../../shared/services/request.service";
import {RequestType, RequestTypeType} from "../../../../types/request.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

  requestError: boolean = false;

  @Input()
  formValues = {
    service: '',
    name: '',
    phone: '',
    type: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private requestService: RequestService,
              private dialogRef: MatDialogRef<CommonDialogComponent>,
              private dialog: MatDialog,
              private userService: UserService) { }

  ngOnInit(): void {
    this.formValues.service = this.data.service;
    this.formValues.type = this.data.type;
    const userName = this.userService.getUserName();
    if (userName) {
      this.formValues.name = userName;
    }
  }

  sendRequest() {
    const requestData: RequestType = {
      name: this.formValues.name,
      phone: this.formValues.phone,
      type: this.formValues.type as RequestTypeType,

    };

    // Uncomment below and click "Перезвоните мне" in the Footer to check error message in Dialog
    // requestData.service = ''
    // Uncomment above to check error message in Dialog

    if (this.formValues.type === 'order') {
      requestData.service = this.formValues.service;
    }

    this.requestService.sendRequest(requestData).subscribe({
      next: (data: DefaultResponseType) => {
        if (data.error) {
          console.log(data.error);
          this.requestError = true;
        }
        console.log(data.message);
        this.dialogRef.close();
        this.dialog.open(CommonDialogComponent, dialogConfigs.done);
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse.error.message);
        this.requestError = true;
      }
    });
  }
}


const commonDialogSize = {
  width: '727px',
  height: '489px',
};

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
      type: 'order',
      btnText: 'Оставить заявку',
    }
  },
  consult: {
    width: commonDialogSize.width,
    height: commonDialogSize.height,
    data: {
      title: 'Закажите бесплатную консультацию!',
      service: '',
      type: 'consultation',
      btnText: 'Заказать консультацию',
    }
  },
};
