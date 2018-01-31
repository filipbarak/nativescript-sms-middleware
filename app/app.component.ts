import { Component, OnInit } from "@angular/core";
import {SmsService} from './SMS/sms.service';
import * as SocketIO from 'nativescript-socket.io';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
    socket;
    constructor(private smsService: SmsService) {
        this.socket = SocketIO.connect(this.smsService.serverUrl);
    
    }

    ngOnInit() {
        this.socket.on('message', function(socket, message) {
            console.dir(socket, message);
            //call smsService.sendMessage(message.text.content, message.text.numberTo)
            // and we are done!
        })
    }

    logPhone() {
        this.smsService.logPhone();
    }
    
}
