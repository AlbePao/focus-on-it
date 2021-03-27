import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogAlertData {
  title?: string;
  description: string;
  cancelOrConfirm?: boolean;
}

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss'],
})
export class DialogAlertComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogAlertData) {}
}
