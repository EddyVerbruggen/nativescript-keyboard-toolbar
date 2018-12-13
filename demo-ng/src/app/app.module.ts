import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { registerElement } from "nativescript-angular";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ItemDetailModalComponent } from "./item/item-detail-modal.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { ItemsComponent } from "./item/items.component";

registerElement("KeyboardToolbar", () => require("nativescript-keyboard-toolbar").Toolbar);

@NgModule({
  bootstrap: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptFormsModule
  ],
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailComponent,
    ItemDetailModalComponent
  ],
  entryComponents: [
    ItemDetailModalComponent
  ],
  providers: [],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
}
