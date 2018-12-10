import { ContentView, View } from "tns-core-modules/ui/content-view";
import { Property } from "tns-core-modules/ui/core/properties";
import { AddChildFromBuilder } from "tns-core-modules/ui/core/view";
import { booleanConverter } from "tns-core-modules/ui/core/view-base";

export const forProperty = new Property<ToolbarBase, string>({
  name: "for"
});

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
  content: View;
  protected for: string;
  protected showWhenKeyboardHidden: boolean;
  protected showAtBottomWhenKeyboardHidden: boolean;

  protected abstract loaded(): void;
  protected abstract unloaded(): void;

  onLoaded(): void {
    super.onLoaded();
    this.loaded();
  }

  onUnloaded(): void {
    super.onUnloaded();
    this.unloaded();
  }

  _addChildFromBuilder(name: string, value: View): void {
    this.content = value;
  }

  [forProperty.setNative](value: string) {
    this.for = value;
  }

  [showWhenKeyboardHiddenProperty.setNative](value: boolean) {
    this.showWhenKeyboardHidden = value;
  }

  [showAtBottomWhenKeyboardHiddenProperty.setNative](value: boolean) {
    this.showAtBottomWhenKeyboardHidden = value;
  }
}

forProperty.register(ToolbarBase);
showWhenKeyboardHiddenProperty.register(ToolbarBase);
showAtBottomWhenKeyboardHiddenProperty.register(ToolbarBase);