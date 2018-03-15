import {Component} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

@Component({
    selector: "contacts-modal",
    templateUrl: "app.modal.html"
})
export class ContactsModalComponent {


    public constructor(private params: ModalDialogParams) {

    }

    public close(response: string) {
        this.params.closeCallback(response);
    }
}