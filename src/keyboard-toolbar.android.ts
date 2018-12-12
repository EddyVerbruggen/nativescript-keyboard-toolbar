import { android as AndroidApp } from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { topmost } from "tns-core-modules/ui/frame";
import { ad } from "tns-core-modules/utils/utils";
import { ToolbarBase } from "./keyboard-toolbar.common";

export class Toolbar extends ToolbarBase {
  private startPositionY: number;
  private lastHeight: number;
  private navbarHeight: number;
  private isNavbarVisible: boolean;
  private lastKeyboardHeight: number;
  private onGlobalLayoutListener: android.view.ViewTreeObserver.OnGlobalLayoutListener;
  // private onScrollChangedListener: android.view.ViewTreeObserver.OnScrollChangedListener;

  constructor() {
    super();
    this.verticalAlignment = "top"; // weird but true
  }

  protected _loaded(): void {
    setTimeout(() => this.applyInitialPosition());

    setTimeout(() => {
      const page = topmost().currentPage;
      const forView = <View>page.getViewById(this.for);
      const parent = <View>this.content.parent;

      forView.on("focus", () => {
        this.hasFocus = true;
        if (that.lastKeyboardHeight) {
          this.showToolbar(parent);
        }
      });

      forView.on("blur", () => {
        this.hasFocus = false;
        this.hideToolbar(parent);
      });
    }, 500);

    const that = this;

    /*
    this.onScrollChangedListener = new android.view.ViewTreeObserver.OnScrollChangedListener({
      onScrollChanged(): void {
        console.log(">> scroll changed");
      }
    });
    */

    this.onGlobalLayoutListener = new android.view.ViewTreeObserver.OnGlobalLayoutListener({
      onGlobalLayout(): void {
        // this can happen during livesync - no problemo
        if (!that.content.android) {
          return;
        }

        const rect = new android.graphics.Rect();
        that.content.android.getWindowVisibleDisplayFrame(rect);

        const newKeyboardHeight = (Toolbar.getUsableScreenSizeY() - rect.bottom) / screen.mainScreen.scale;
        if (newKeyboardHeight === 0 && that.lastKeyboardHeight === undefined) {
          return;
        }

        if (newKeyboardHeight === that.lastKeyboardHeight) {
          return;
        }

        // TODO see if orientation needs to be accounted for: https://github.com/siebeprojects/samples-keyboardheight/blob/c6f8aded59447748266515afeb9c54cf8e666610/app/src/main/java/com/siebeprojects/samples/keyboardheight/KeyboardHeightProvider.java#L163
        that.lastKeyboardHeight = newKeyboardHeight;

        if (that.hasFocus) {
          if (newKeyboardHeight === 0) {
            that.hideToolbar(that.content.parent);
          } else {
            that.showToolbar(that.content.parent);
          }
        }
      }
    });

    that.content.android.getViewTreeObserver().addOnGlobalLayoutListener(that.onGlobalLayoutListener);
    // that.content.android.getViewTreeObserver().addOnScrollChangedListener(that.onScrollChangedListener);
  }

  protected _unloaded(): void {
    this.content.android.getViewTreeObserver().removeOnGlobalLayoutListener(this.onGlobalLayoutListener);
    // this.content.android.getViewTreeObserver().removeOnScrollChangedListener(this.onScrollChangedListener);
    this.onGlobalLayoutListener = undefined;
    // this.onScrollChangedListener = undefined;
  }

  private showToolbar(parent): void {
    const animateToY = this.startPositionY - this.lastKeyboardHeight - (this.showWhenKeyboardHidden === true ? 0 : (this.lastHeight / screen.mainScreen.scale)) - (this.isNavbarVisible ? 0 : this.navbarHeight);
    // console.log(">> showToolbar, animateToY: " + animateToY);
    parent.animate({
      translate: {x: 0, y: animateToY},
      curve: AnimationCurve.cubicBezier(.32, .49, .56, 1),
      duration: 370
    }).then(() => {
    });
  }

  private hideToolbar(parent): void {
    const animateToY = this.showWhenKeyboardHidden === true && this.showAtBottomWhenKeyboardHidden !== true ? 0 : this.startPositionY;
    // console.log("hideToolbar, animateToY: " + animateToY);
    parent.animate({
      translate: {x: 0, y: animateToY},
      curve: AnimationCurve.cubicBezier(.32, .49, .56, 1), // perhaps make this one a little different as it's the same as the 'show' animation
      duration: 370
    }).then(() => {
    });
  }

  private applyInitialPosition(): void {
    if (this.startPositionY !== undefined) {
      return;
    }

    const parent = <View>this.content.parent;

    // at this point, topmost().currentPage is null, so do it like this:
    let page: any = parent;
    while (!page.frame) {
      page = page.parent;
    }

    const {y} = parent.getLocationOnScreen();
    const newHeight = parent.getMeasuredHeight();

    // this is the bottom navbar - which may be hidden by the user.. so figure out its actual height
    this.isNavbarVisible = page.getMeasuredHeight() < Toolbar.getUsableScreenSizeY();
    this.navbarHeight = Toolbar.getNavbarHeight();

    this.startPositionY = screen.mainScreen.heightDIPs - y - ((this.showWhenKeyboardHidden === true ? newHeight : 0) / screen.mainScreen.scale) - (this.isNavbarVisible ? this.navbarHeight : 0);

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

  private static getNavbarHeight() {
    const resources = (<android.content.Context>ad.getApplicationContext()).getResources();
    // note: there's also 'navigation_bar_height_landscape'
    const resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
    if (resourceId > 0) {
      return resources.getDimensionPixelSize(resourceId) / screen.mainScreen.scale;
    }
    return 0;
  }

  private static getUsableScreenSizeY(): number {
    const screenSize = new android.graphics.Point();
    AndroidApp.foregroundActivity.getWindowManager().getDefaultDisplay().getSize(screenSize);
    return screenSize.y;
  }
}
