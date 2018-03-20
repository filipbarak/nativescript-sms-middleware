declare var android: any;
import {Component, OnInit, NgZone, ViewChild, ElementRef, ViewContainerRef} from "@angular/core";
import {SmsService} from './SMS/sms.service';
import * as SocketIO from 'nativescript-socket.io';
import * as permissions from 'nativescript-permissions';
import {ModalDialogService} from 'nativescript-angular/directives/dialogs';
import {ContactsModalComponent} from './app.modal';


@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
    @ViewChild("connectButton") connectButton: ElementRef;
    @ViewChild("codeField") codeField: ElementRef;
    @ViewChild("newCodeButton") newCodeButton: ElementRef;
    @ViewChild("contactButton") contactButton: ElementRef;
    socket;
    code;

    constructor(public smsService: SmsService,
                public modalService: ModalDialogService,
                private vcRef: ViewContainerRef) {
        this.socket = SocketIO.connect(this.smsService.serverUrl);

        permissions.requestPermission([android.Manifest.permission.SEND_SMS, android.Manifest.permission.READ_CONTACTS], "Need permission to send SMS")
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
        let codeField = this.codeField.nativeElement;
        let connectButton = this.connectButton.nativeElement;
        let newCodeButton = this.newCodeButton.nativeElement;
        let contactButton = this.contactButton.nativeElement;
        codeField.editable = false;
        connectButton.isEnabled = false;
        newCodeButton.isEnabled = true;
        contactButton.isEnabled = true;
        this.socket.removeAllListeners();
        this.saveKey(this.code);
        let emitEvent = 'message' + this.code;
        let connectionEvent = 'initConnection' + this.code;
        console.log(emitEvent, 'eventEmitter');
        this.socket.emit('initConnection', {
           code: this.code,
        });
        this.socket.on(connectionEvent, (data) => {
            this.smsService.onSuccessNotification(data.success);
        });
        this.socket.on(emitEvent, (socket, message) => {
            let messageToSend = socket.text[0].content;
            console.dir(socket);
            socket.text[0].numberTo.forEach((number, i) => {
                let chunks = [];
                if (messageToSend.length > 153) {
                    chunks = messageToSend.match(/.{1,153}/g);
                    chunks.forEach((chunk, j) => {
                        setTimeout(() => {
                            this.smsService.sendSms(number, chunk)
                        }, j * 500)
                    });
                }
                else {
                    setTimeout(() => {
                        this.smsService.sendSms(number, messageToSend)
                    }, i * 500);

                }
            });
            this.smsService.broadcastReciever(this.smsService.id, () => {
                console.log('@@@SENT@@@')
                this.socket.emit('smsSent', {
                    isSuccess: true,
                    code: this.code
                });
                this.smsService.unregister(this.smsService.id);
            })
        })
    }

    saveKey(key) {
        this.smsService.saveKeyToStorage(key);
    }

    getKey() {
        return this.smsService.getKeyFromStorage();
    }

    enableForm() {
        let codeField = this.codeField.nativeElement;
        let connectButton = this.connectButton.nativeElement;
        let newCodeButton = this.newCodeButton.nativeElement;
        codeField.editable = true;
        connectButton.isEnabled = true;
        newCodeButton.isEnabled = false;
    }

    syncContacts() {
        let contactButton = this.contactButton.nativeElement;
        contactButton.isEnabled = false;
        console.log('Syncing....');
        this.smsService.getContacts().then(contacts => {
            console.dir({contacts, code: this.code});
            this.socket.emit('contacts', {contacts, code: this.code});

        }, (e) => {
            console.dir('Error in syncing...');
        })
    }

    openContactConfirmationModal() {
        let options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modalService.showModal(ContactsModalComponent, options).then(res => {
            if (res) {
                this.syncContacts();
            }
        })
    }

}
