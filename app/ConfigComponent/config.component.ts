import {Component} from "@angular/core";
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {SmsService} from "../SMS/sms.service";

@Component({
    selector: 'config',
    templateUrl: './ConfigComponent/config.component.html'
})
export class ConfigComponent {
    server;
    currentServer;
    public constructor(public params: ModalDialogParams, private smsService: SmsService) {
        this.currentServer = this.smsService.getServerUrlFromStorage();
    }

    public close(response: string) {
        this.params.closeCallback(response);
    }
}