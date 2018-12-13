import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalDialogParams } from "nativescript-angular";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base";

import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
  selector: "ns-details-modal",
  moduleId: module.id,
  templateUrl: "./item-detail-modal.component.html",
})
export class ItemDetailModalComponent {
  item: Item;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private params: ModalDialogParams) {

    const id = +params.context.id;
    console.log("id: " + id);
    this.item = this.itemService.getItem(id);
  }

  appendToTextField(textField: EditableTextBase, what: string): void {
    textField.text += what + " ";
  }

  closeKeyboard(textField: EditableTextBase): void {
    textField.dismissSoftInput();
  }

  close(): void {
    this.params.closeCallback();
  }
}
