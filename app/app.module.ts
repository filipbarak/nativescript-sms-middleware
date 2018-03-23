import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppComponent } from "./app.component";
import {SmsService} from './SMS/sms.service';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
 import { NativeScriptHttpModule } from "nativescript-angular/http";
import {HttpClientModule} from '@angular/common/http';
import {NativeScriptFormsModule} from 'nativescript-angular';
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import {ContactsModalComponent} from './app.modal';
import {ConfigComponent} from './ConfigComponent/config.component'

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        HttpClientModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        ContactsModalComponent,
        ConfigComponent
    ],
    providers: [
        SmsService,
        ModalDialogService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        ContactsModalComponent,
        ConfigComponent
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
