import * as application from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { topmost } from "tns-core-modules/ui/frame";
import { ToolbarBase } from "./keyboard-toolbar.common";

// TODO (see loopmein) if IQKeyboardManager is available, disable it
export class Toolbar extends ToolbarBase {
  private startPositionY: number;
  private lastHeight: number;
  private lastKeyboardHeight: number;
  private keyboardNotificationObserver: any;

  onLoaded(): void {
    super.onLoaded();
    this.keyboardNotificationObserver = application.ios.addNotificationObserver(
        UIKeyboardWillChangeFrameNotification,
        notification => {
          const newKeyboardHeight = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height;

          if (newKeyboardHeight === this.lastKeyboardHeight) {
            return;
          }

          const isFirstAnimation = this.lastKeyboardHeight === undefined;
          this.lastKeyboardHeight = newKeyboardHeight;

          if (!isFirstAnimation) {
            const parent = (<View>this.content.parent);
            parent.translateY = this.startPositionY - newKeyboardHeight;
          }
        });
  }

  onUnloaded(): void {
    super.onUnloaded();
    application.ios.removeNotificationObserver(this.keyboardNotificationObserver, UIKeyboardWillChangeFrameNotification);
  }

  _addChildFromBuilder(name: string, value: View): void {
    this.content = value;
    const parent = value.parent as View;

    setTimeout(() => {
      const page = topmost().currentPage;
      const forView = <View>page.getViewById(this.for);

      forView.on("focus", () => {
        // wrap in a timeout, to make sure this runs after 'UIKeyboardWillChangeFrameNotification'
        setTimeout(() => {
          const animateToY = this.startPositionY - this.lastKeyboardHeight - (this.showWhenKeyboardHidden === true ? 0 : (this.lastHeight / screen.mainScreen.scale));
          parent.animate({
            translate: {x: 0, y: animateToY},
            // see http://cubic-bezier.com/#.17,.67,.69,1.04
            curve: AnimationCurve.cubicBezier(.32, .49, .56, 1),
            duration: 370
          }).then(() => {
          });
        });
      });

      forView.on("blur", () => {
        const animateToY = this.showWhenKeyboardHidden === true && this.showAtBottomWhenKeyboardHidden !== true ? 0 : this.startPositionY;
        parent.animate({
          translate: {x: 0, y: animateToY},
          curve: AnimationCurve.cubicBezier(.32, .49, .56, 1), // perhaps make this one a little different as it's the same as the 'show' animation
          duration: 370
        }).then(() => {
        });

        this.lastKeyboardHeight = undefined;
      });
    }, 500);
  }

  public onLayout(left: number, top: number, right: number, bottom: number): void {
    super.onLayout(left, top, right, bottom);
    const parent = <View>this.content.parent;
    const {x, y} = parent.getLocationOnScreen();
    const newHeight = parent.getMeasuredHeight();
    this.startPositionY = screen.mainScreen.heightDIPs - y - ((this.showWhenKeyboardHidden === true ? parent.getMeasuredHeight() : 0) / screen.mainScreen.scale);
    if (this.lastHeight === undefined) {
      // this moves the keyboardview to the bottom (just move it offscreen/toggle visibility(?) if the user doesn't want to show it without the keyboard being up)
      if (this.showWhenKeyboardHidden === true) {
        if (this.showAtBottomWhenKeyboardHidden === true) {
          parent.translateY = this.startPositionY;
        }
      } else {
        parent.translateY = this.startPositionY;
      }
    } else if (this.lastHeight !== newHeight) {
      parent.translateY = this.startPositionY;
    }
    this.lastHeight = newHeight;
  }
}
