import { Component } from '@angular/core';
import {CommonDialogComponent, dialogConfigs} from "../../../views/components/common-dialog/common-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

  constructor(private dialog: MatDialog,) { }

  callMeBack() {
    const dialogConfig = dialogConfigs['consult']
    this.dialog.open(CommonDialogComponent, dialogConfig)
  }
}
