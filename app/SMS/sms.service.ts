declare var android: any;
declare var require: any;
import {Injectable} from '@angular/core';
import * as TNSPhone from 'nativescript-phone';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as applicationSettings from 'tns-core-modules/application-settings';
import {TNSFancyAlert, TNSFancyAlertButton} from 'nativescript-fancyalert';
import * as contacts from 'nativescript-contacts-lite';
import * as app from "tns-core-modules/application";
import * as utils from "utils/utils";


@Injectable()
export class SmsService {
    // serverUrl = 'https://young-bayou-10751.herokuapp.com';
    serverUrl = 'http://localhost:3000';
    context = utils.ad.getApplicationContext();
    id = 'messageSent';
    pendingIntentSent;
    headers = new HttpHeaders();
    socket;
    contactFields = ['display_name', 'phone'];
    allContacts = [];

    constructor() {
        //this.createHeaders();
        this.pendingIntentSent = this.pendingIntent(this.id);


    }

    sendSms(numbers, body) {
        let sms = android.telephony.SmsManager.getDefault();
        sms.sendTextMessage(numbers, null, body, this.pendingIntentSent, null);

    }

    broadcastReciever(id, cb) {
        app.android.registerBroadcastReceiver(id, () => {
            cb();
        });
    }

    unregister(id) {
        app.android.unregisterBroadcastReceiver(id);
    }

    pendingIntent(id) {
        let intent = new android.content.Intent(id);
        return android.app.PendingIntent.getBroadcast(this.context, 0, intent, 0);
    }

    //createHeaders(token?) {
    //    this.headers.append('Content-Type', 'application/json');
    //    if (token) {
    //        this.headers.append('x-auth', token);
    //    }
    //}

    saveKeyToStorage(key) {
        applicationSettings.setString('auth-code', key)
    }

    getKeyFromStorage() {
        return applicationSettings.getString('auth-code');
    }

    onSuccessNotification(code) {
        TNSFancyAlert.showSuccess('Автентицирани', code, 'Затвори');

    }

    saveServerUrlToStorage(server) {
        applicationSettings.setString('serverUrl', server);
    }

    getServerUrlFromStorage() {
        const updatedServer = applicationSettings.getString('serverUrl');
        console.dir(updatedServer);
        if (updatedServer) {
            return this.serverUrl = updatedServer;
        }

        return this.serverUrl;
    }

    getContacts() {
        this.allContacts = [];
        return new Promise((resolve, reject) => {
            contacts.getContactsWorker(this.contactFields).then(contacts => {
                contacts.forEach(contact => {
                    const contactNumber = this.formatPhoneNumber(contact['phone'][0]['number']);
                    if (this.isNumberMobile(contactNumber)) {
                        this.allContacts.push({
                            name: contact['display_name'],
                            number: contactNumber,
                            hasFirm: ''
                        });
                    }
                });
                if (this.allContacts.length > 0) {
                    resolve(this.allContacts);
                }
                else reject();
            })
        })

    }

    formatPhoneNumber(number) {
        number = number.replace(/["'()]/g, "").replace(/-/g, "");
        return number.split(' ').join('')
    }

    isNumberMobile(number) {
        return number.startsWith('+3897')
            || number.startsWith('3897')
            || number.startsWith('07')
    }


}