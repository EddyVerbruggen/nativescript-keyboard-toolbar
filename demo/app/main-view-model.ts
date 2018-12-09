import { Observable } from "tns-core-modules/data/observable";
import * as frameModule from "tns-core-modules/ui/frame";
import { TextView } from "tns-core-modules/ui/text-view";

export class HelloWorldModel extends Observable {
  public message: string;
  // private keyboardToolbar: KeyboardToolbar;

  constructor() {
    super();

    // this.keyboardToolbar = new KeyboardToolbar();
    // this.message = this.keyboardToolbar.message;
  }

  onTap(): void {
    console.log(">> tapped");
  }

  hideKeyboard(): void {
    const page = frameModule.topmost().currentPage;
    const textView = <TextView>page.getViewById("tv");
    textView.dismissSoftInput();
  }
}
