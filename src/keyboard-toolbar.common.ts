import { ContentView } from "tns-core-modules/ui/content-view";
import { AddChildFromBuilder } from "tns-core-modules/ui/core/view";
import { Property } from "tns-core-modules/ui/core/properties";
import { booleanConverter } from "tns-core-modules/ui/core/view-base";

export const showWhenKeyboardHiddenProperty = new Property<ToolbarBase, boolean>({
  name: "showWhenKeyboardHidden",
  defaultValue: false,
  valueConverter: booleanConverter
});

export const showAtBottomWhenKeyboardHiddenProperty = new Property<ToolbarBase, boolean>({
  name: "showAtBottomWhenKeyboardHidden",
  defaultValue: false,
  valueConverter: booleanConverter
});

export abstract class ToolbarBase extends ContentView implements AddChildFromBuilder {
  protected showWhenKeyboardHidden: boolean;
  protected showAtBottomWhenKeyboardHidden: boolean;

  abstract _addChildFromBuilder(name: string, value: any): void;

  [showWhenKeyboardHiddenProperty.setNative](value: boolean) {
    this.showWhenKeyboardHidden = value;
  }

  [showAtBottomWhenKeyboardHiddenProperty.setNative](value: boolean) {
    this.showAtBottomWhenKeyboardHidden = value;
  }
}

showWhenKeyboardHiddenProperty.register(ToolbarBase);
showAtBottomWhenKeyboardHiddenProperty.register(ToolbarBase);