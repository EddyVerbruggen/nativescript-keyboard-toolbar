import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { TextView } from "tns-core-modules/ui/text-view";

export class HelloWorldModel extends Observable {
  onTapTf1(): void {
    console.log(">> tapped tf1");
  }

  onTapTv1(): void {
    console.log(">> tapped tv1");
  }

  onTapTv2(): void {
    console.log(">> tapped tv2");
  }

  hideKeyboardTf1(): void {
    const page = topmost().currentPage;
    const textView = <TextView>page.getViewById("tf1");
    textView.dismissSoftInput();
  }

  hideKeyboardTv1(): void {
    const page = topmost().currentPage;
    const textView = <TextView>page.getViewById("tv1");
    textView.dismissSoftInput();
  }

  hideKeyboardTv2(): void {
    const page = topmost().currentPage;
    const textView = <TextView>page.getViewById("tv2");
    textView.dismissSoftInput();
  }
}
