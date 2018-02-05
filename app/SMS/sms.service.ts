declare var android: any;
declare var require: any;
import {Injectable} from '@angular/core';
import * as TNSPhone from 'nativescript-phone';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as applicationSettings from 'tns-core-modules/application-settings';
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import * as contacts from 'nativescript-contacts-lite';

@Injectable()
export class SmsService {
    serverUrl = 'https://young-bayou-10751.herokuapp.com';
     //serverUrl = 'http://localhost:3000';
    headers = new HttpHeaders();
    socket;
    contactFields = ['display_name', 'phone'];
    allContacts = [];

    constructor() {
        //this.createHeaders();

    }

    sendSms(numbers, body) {
        let sms = android.telephony.SmsManager.getDefault();
        sms.sendTextMessage(numbers, null, body, null, null);
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
        TNSFancyAlert.showSuccess('Автентицирани', `Успешно автентицирани со кодот ${code}`, 'Затвори');

    }

    getContacts() {
        return new Promise((resolve, reject) => {
            contacts.getContactsWorker(this.contactFields).then(contacts => {
                contacts.forEach(contact => {
                    if (contact['phone'][0]['type'] === "mobile") {
                        this.allContacts.push({
                            name: contact['display_name'],
                            number: this.formatPhoneNumber(contact['phone'][0]['number'])
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
        number = number.replace(/["'()]/g,"").replace(/-/g, "");
        return number.split(' ').join('')
    }


    

}