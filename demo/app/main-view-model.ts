import { Observable } from "tns-core-modules/data/observable";
import { action } from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { TextView } from "tns-core-modules/ui/text-view";

export class HelloWorldModel extends Observable {

  sliderValue: number;
  showRob = false;
  showEddy = false;
  showTrumpsTies = false;

  // icons, see https://linearicons.com/free (click a pic for the hex code used below)
  iconCamera = String.fromCharCode(0xe826);
  iconTrash = String.fromCharCode(0xe811);

  constructor() {
    super();

    // laughable code, I know, but it's just a quick demo
    setTimeout(() => {
      const page = topmost().currentPage;
      const textView = <TextView>page.getViewById("tv3");
      if (!textView) {
        return;
      }
      textView.on("textChange", (args: any) => {
        const text = textView.text;
        const words = text.split(" ");
        if (words.length === 0) {
          return;
        }
        const lastWord = words[words.length - 1].toLowerCase();

        this.set("showRob", false);
        this.set("showEddy", false);
        this.set("showTrumpsTies", false);
        if (lastWord.indexOf("@") > -1) {
          if ("@" === lastWord) {
            this.set("showRob", true);
            this.set("showEddy", true);
            this.set("showTrumpsTies", true);
          } else if ("@roblauer".indexOf(lastWord) > -1) {
            this.set("showRob", true);
            this.set("showEddy", false);
            this.set("showTrumpsTies", false);
          } else if ("@eddyverbruggen".indexOf(lastWord) > -1) {
            this.set("showRob", false);
            this.set("showEddy", true);
            this.set("showTrumpsTies", false);
          } else if ("@trumpsties".indexOf(lastWord) > -1) {
            this.set("showRob", false);
            this.set("showEddy", false);
            this.set("showTrumpsTies", true);
          }
        }
      });
    });
  }

  setAmountInTextField(args: any): void {
    const textView = <TextView>topmost().currentPage.getViewById("tf1");
    textView.text = args.object.text;
    textView.dismissSoftInput();
  }

  appendToTextView2(args: any): void {
    const textView = <TextView>topmost().currentPage.getViewById("tv2");
    textView.text += " " + args.object.text + " ";
    this.positionCursorAtEnd(textView);
  }

  appendToTextView3(args: any): void {
    const textView = <TextView>topmost().currentPage.getViewById("tv3");
    let newText = textView.text;

    const words = textView.text.split(" ");
    if (words.length > 0) {
      const lastWord = words[words.length - 1].toLowerCase();
      if (args.object.text.startsWith(lastWord)) {
        words.pop();
        newText = words.join(" ");
      }
    }
    textView.text = (newText + " " + args.object.text).trim() + " ";
    this.positionCursorAtEnd(textView);
  }

  showUserForTextView3(args: any): boolean {
    const textView = <TextView>topmost().currentPage.getViewById("tv3");
    console.log(args.object.text);
    return textView.text.endsWith("@");
  }

  getSliderValue(): any {
    return this.sliderValue === undefined ? undefined : Math.round(this.sliderValue);
  }

  onTapTv1Camera(): void {
    action({
      title: "Add a picture from..",
      cancelable: true,
      cancelButtonText: "Cancel",
      actions: ["the camera", "the photo album"]
    });
  }

  onTapTv1Trash(): void {
    const page = topmost().currentPage;
    const textView = <TextView>page.getViewById("tv1");
    textView.text = "";
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

  private positionCursorAtEnd(textView: TextView): void {
    if (textView.android) {
      textView.android.setSelection(textView.text.length);
    }
  }
}
