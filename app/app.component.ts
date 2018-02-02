declare var android: any;
import { Component, OnInit, NgZone } from "@angular/core";
import {SmsService} from './SMS/sms.service';
import * as SocketIO from 'nativescript-socket.io';
import * as permissions from 'nativescript-permissions';


@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
    socket;
    code;
    constructor(public smsService: SmsService, private zone: NgZone) {
        this.socket = SocketIO.connect(this.smsService.serverUrl);

        permissions.requestPermission([android.Manifest.permission.SEND_SMS, android.Manifest.permission.CALL_PHONE], "Need permission to send SMS")
            .then(() => {
                console.log("got permissions")
            })
            .catch(() => {
                console.log("No permissions")
            })
    
    }

    ngOnInit() {
        if (!this.code) {
            if (this.getKey()) {
                this.code = this.getKey();
            }
        }
        //console.log(this.smsService.serverUrl)
        //console.dir(this.socket)
        //this.socket.on('message', (socket, message) => {
        //    console.dir(socket);
        //    //call smsService.sendMessage(message.text.content, message.text.numberTo)
        //    // and we are done!
        //    //this.smsService.sendSms(socket.text.numberTo, socket.text.content)
        //})
    }

    authenticate() {
        this.saveKey(this.code);
        let emitEvent = 'message'+this.code;
        console.log(emitEvent);
        this.socket.on(emitEvent, (socket, message) => {
            console.dir(socket);
            socket.text[0].numberTo.forEach(number => {
                this.smsService.sendSms(number, socket.text[0].content)
            })
        })
    }

    logPhone() {
        this.smsService.logPhone();
    }

    saveKey(key) {
        this.smsService.saveKeyToStorage(key);
    }

    getKey() {
       return this.smsService.getKeyFromStorage();
    }
    
}
