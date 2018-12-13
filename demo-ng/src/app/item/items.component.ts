import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base";

import { Item } from "./item";
import { ItemDetailModalComponent } from "./item-detail-modal.component";
import { ItemService } from "./item.service";

@Component({
  selector: "ns-items",
  moduleId: module.id,
  templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
  items: Item[];

  constructor(private itemService: ItemService,
              private vcRef: ViewContainerRef,
              private modal: ModalDialogService) {
  }

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  appendToTextField(textField: EditableTextBase, what: string): void {
    textField.text += what + " ";
  }

  closeKeyboard(textField: EditableTextBase): void {
    textField.dismissSoftInput();
  }

  openModal(): void {
    const options: ModalDialogOptions = {
      fullscreen: false,
      viewContainerRef: this.vcRef,
      context: {
        id: this.itemService.getItems()[0].id
      }
    };

    this.modal.showModal(ItemDetailModalComponent, options).then(() => {
      console.log("modal closed");
    });
  }
}