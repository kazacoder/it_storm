import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '727px',
      height: '489px',
      data: {
        title: 'Заявка на услугу',
        service: '',
        typeThanks: false,
        btnText: 'Оставить заявку'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    })

  }


}
