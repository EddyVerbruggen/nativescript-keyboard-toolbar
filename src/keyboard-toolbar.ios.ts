import * as application from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { View, ViewBase } from "tns-core-modules/ui/core/view";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { topmost } from "tns-core-modules/ui/frame";
import { ToolbarBase } from "./keyboard-toolbar.common";

export class Toolbar extends ToolbarBase {
  private startPositionY: number;
  private lastHeight: number;
  private lastKeyboardHeight: number;
  private keyboardNotificationObserver: any;

  protected _loaded(): void {
    this.keyboardNotificationObserver = application.ios.addNotificationObserver(
        UIKeyboardWillChangeFrameNotification,
        notification => {
          const newKeyboardHeight = notification.userInfo.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height;

          if (newKeyboardHeight === this.lastKeyboardHeight) {
            return;
          }

          const isFirstAnimation = this.lastKeyboardHeight === undefined;
          this.lastKeyboardHeight = newKeyboardHeight;

          if (!isFirstAnimation && this.hasFocus) {
            const parent = (<View>this.content.parent);
            parent.translateY = this.startPositionY - newKeyboardHeight - (this.lastHeight / screen.mainScreen.scale);
          }
        });

    const onViewForIdFound = forView => {
      const parent = this.content.parent as View;

      // experimental support for non-text widgets.. but not sure if this is useful, so not documenting it yet
      const isText = forView instanceof EditableTextBase;

      if (isText) {
        forView.on("focus", () => {
          this.hasFocus = true;
          // wrap in a timeout, to make sure this runs after 'UIKeyboardWillChangeFrameNotification'
          setTimeout(() => {
            const animateToY = this.startPositionY - this.lastKeyboardHeight - (this.showWhenKeyboardHidden === true ? 0 : (this.lastHeight / screen.mainScreen.scale));
            this.log("focus, animateToY: " + animateToY);
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
          this.hasFocus = false;
          const animateToY = this.showWhenKeyboardHidden === true && this.showAtBottomWhenKeyboardHidden !== true ? 0 : this.startPositionY;
          this.log("blur, animateToY: " + animateToY);
          parent.animate({
            translate: {x: 0, y: animateToY},
            curve: AnimationCurve.cubicBezier(.32, .49, .56, 1), // perhaps make this one a little different as it's the same as the 'show' animation
            duration: 370
          }).then(() => {
          });
        });

      } else {
        // it's not a text widget, so just animate the toolbar
        forView.on("tap", () => {
          const animateToY = this.startPositionY - (this.lastHeight / screen.mainScreen.scale);
          this.log("tap, animateToY: " + animateToY);
          parent.animate({
            translate: {x: 0, y: animateToY},
            // see http://cubic-bezier.com/#.17,.67,.69,1.04
            curve: AnimationCurve.cubicBezier(.32, .49, .56, 1),
            duration: 370
          }).then(() => {
          });
        });
      }
    };

    // TODO this can be reused on Android (but I haven't seen the underlying issue there (yet))
    this.getViewForId(10)
        .then(view => onViewForIdFound(view))
        .catch(() => console.log(`\n⌨ ⌨ ⌨ Please make sure forId="<view id>" resolves to a visible view, or the toolbar won't render correctly! Example: <Toolbar forId="myId" height="44">\n\n`));
  }

  // depending on the framework (looking at you, Angular!) it may take longer to find the view, so here we try to get it asap (instead of a fixed 1sec timeout for instance)
  private getViewForId(attemptsLeft: number): Promise<ViewBase> {
    return new Promise<ViewBase>((resolve, reject) => {
      if (attemptsLeft-- > 0) {
        setTimeout(() => {
          const page = topmost().currentPage;
          const found = page.modal ? page.modal.getViewById(this.forId) : page.getViewById(this.forId);
          if (found) {
            resolve(found);
          } else {
            this.getViewForId(attemptsLeft).then(resolve).catch(reject);
          }
        }, 200);
      } else {
        reject();
      }
    });
  }

  protected _unloaded(): void {
    application.ios.removeNotificationObserver(this.keyboardNotificationObserver, UIKeyboardWillChangeFrameNotification);
  }

  protected _layout(left: number, top: number, right: number, bottom: number): void {
    const parent = <View>this.content.parent;
    const newHeight = parent.getMeasuredHeight();
    if (newHeight === this.lastHeight) {
      return;
    }

    const {y} = parent.getLocationOnScreen();
    this.startPositionY = screen.mainScreen.heightDIPs - y - ((this.showWhenKeyboardHidden === true ? newHeight : 0) / screen.mainScreen.scale);
    this.log("_layout, startPositionY: " + this.startPositionY);

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
