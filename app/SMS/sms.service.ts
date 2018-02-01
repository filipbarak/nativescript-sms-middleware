declare var android: any;
import {Injectable} from '@angular/core';
import * as TNSPhone from 'nativescript-phone';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class SmsService {
    serverUrl = 'https://young-bayou-10751.herokuapp.com';
    // serverUrl = 'http://localhost:3000';
    private jwtToken = '';
    headers = new HttpHeaders();
    socket;

    constructor(private http: HttpClient) {
        this.createHeaders();
        
    }

    logPhone() {
        console.dir(TNSPhone)
    }

    sendSms(numbers, body) {
        // sms.send(numbers, body)
        //     .then((args) => {
        //         sms.send(numbers, body);
        //     }, (err) => {
        //         console.log('Error: ' + err);
        //     })

        let sms = android.telephony.SmsManager.getDefault();
        sms.sendTextMessage(numbers, null, body, null, null);
    }

    createHeaders(token?) {
        this.headers.append('Content-Type', 'application/json');
        if (token) {
            this.headers.append('x-auth', token);
        }
    }
    

}