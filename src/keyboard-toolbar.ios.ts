import * as application from "tns-core-modules/application";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { ToolbarBase } from "./keyboard-toolbar.common";
import { screen } from "tns-core-modules/platform";
import cubicBezier = AnimationCurve.cubicBezier;

// TODO (see loopmein) if IQKeyboardManager is available, disable it
export class Toolbar extends ToolbarBase {
  private startPositionY: number;
  private lastHeight: number;
  private lastKeyboardHeight: number;

  constructor() {
    super();

    // TODO wire this when the textfield receives focus.. but doing it here for simplicity
    const observer = application.ios.addNotificationObserver(
        UIKeyboardWillChangeFrameNotification,
        notification => {
          const isFirstAnimation = this.lastKeyboardHeight === undefined;
          const parent = (<View>this.content.parent);
          const newKeyboardHeight = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height;
          if (newKeyboardHeight === this.lastKeyboardHeight) {
            return;
          }

          this.lastKeyboardHeight = newKeyboardHeight;

          if (isFirstAnimation) {
            const animateToY = this.startPositionY - newKeyboardHeight - (this.showWhenKeyboardHidden === true ? 0 : (this.lastHeight / screen.mainScreen.scale));
            console.log(">> animateToY: " + animateToY);
            console.log(">> this.lastHeight: " + this.lastHeight);
            parent.animate({
              translate: {x: 0, y: animateToY},
              // see http://cubic-bezier.com/#.17,.67,.69,1.04
              curve: cubicBezier(.32, .49, .56, 1),
              duration: 370
            }).then(() => {
            });
          } else {
            parent.translateY = this.startPositionY - newKeyboardHeight;
          }
        }
    );

    // when the keyboard is closed, we need this
    const observer2 = application.ios.addNotificationObserver(
        UIKeyboardWillHideNotification,
        notification => {
          const parent = (<View>this.content.parent);
          const animateToY = this.showWhenKeyboardHidden === true && this.showAtBottomWhenKeyboardHidden !== true ? 0 : this.startPositionY;
          parent.animate({
            translate: {x: 0, y: animateToY},
            curve: cubicBezier(.32, .49, .56, 1), // perhaps make this one a little different as it's the same as the 'show' animation
            duration: 370
          }).then(() => {
          });

          this.lastKeyboardHeight = undefined;

          // application.ios.removeNotificationObserver(observer, UIKeyboardWillChangeFrameNotification);
          // application.ios.removeNotificationObserver(observer2, UIKeyboardWillHideNotification);
        }
    );
  }

  _addChildFromBuilder(name: string, value: View): void {
    this.content = value;
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
