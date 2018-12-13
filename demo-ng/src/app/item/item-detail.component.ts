import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base";
import { Item } from "./item";
import { ItemService } from "./item.service";

const emailValidator = require("email-validator");

@Component({
  selector: "ns-details",
  moduleId: module.id,
  templateUrl: "./item-detail.component.html",
})
export class ItemDetailComponent implements OnInit {
  item: Item;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.params["id"];
    this.item = this.itemService.getItem(id);
  }

  emailOK(): boolean {
    return emailValidator.validate(this.item.email);
  }

  closeKeyboard(textField: EditableTextBase): void {
    textField.dismissSoftInput();
  }
}
