import { FormControl, FormGroup } from '@angular/forms';
import { MessageType, AlertMsg } from '../msg/alert.msg';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent} from '../controls/alert/alert.component';
import { Injectable } from '@angular/core';

@Injectable()
export class FormUtils {
  private alertMsg: AlertMsg;
  constructor(private dialog: MatDialog) {}
  static MarkAsTouch(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        const control =  form.controls[key] as FormControl;
        control.markAsTouched();
        const group = form.controls[key] as FormGroup;
        if (group) {
          this.MarkAsTouch(group);
        }
      }
    }
  }
  static cleanForm(me: FormGroup) {
    for (const id in me.controls) {
      if (me.controls.hasOwnProperty(id)) {
        const control = me.controls[id] as FormControl;
        control.setValue(null);
      }
    }
  }
  showMsg(msg, tipo: MessageType = MessageType.info) {
    this.alertMsg = new AlertMsg(msg, tipo);
    this.dialog.open(AlertComponent, {
        data: this.alertMsg,
        panelClass: 'myapp-no-padding-dialog'
    });
}
}

