# NativeScript Keyboard Toolbar

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/EddyVerbruggen/nativescript-keyboard-toolbar.svg?branch=master
[build-url]:https://travis-ci.org/EddyVerbruggen/nativescript-keyboard-toolbar
[npm-image]:http://img.shields.io/npm/v/nativescript-keyboard-toolbar.svg
[npm-url]:https://npmjs.org/package/nativescript-keyboard-toolbar
[downloads-image]:http://img.shields.io/npm/dm/nativescript-keyboard-toolbar.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

<img src="https://github.com/EddyVerbruggen/nativescript-keyboard-toolbar/raw/master/media/keyboard-toolbar-demo.gif" height="550px" />

_iOS and Android running the included [demo](/demo) - much better framerate [on YouTube](https://www.youtube.com/watch?v=JJOOXrcopSA)!_

## What The Keyboard!?
Glad you asked 😅! Here's a few highlights:

- ⌨️ Mobile keyboards are a compromise, let's make them easier to work with by attaching a toolbar on top of it.
- 🥅 Design goal = declare any NativeScript layout and stick it on top of the soft keyboard.
- 🙅‍♀️ No third party dependencies - only stuff in `tns-core-modules` your app already has.
- ♾ Allow multiple toolbar designs on one page.
- 🏒 Make the toolbar _stick_ to the keyboard, no matter its shape or form.

## Installation
```bash
tns plugin add nativescript-keyboard-toolbar
```

## Usage with NativeScript Core

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" loaded="pageLoaded" class="page" xmlns:kt="nativescript-keyboard-toolbar">

    <!-- This GridLayout wrapper is required; it wraps the visible layout and the Toolbar layout(s) -->
    <GridLayout rows="*" columns="*">

        <StackLayout>
            <Label text="Some text"/>
            <!-- Add an 'id' property that we can reference below -->
            <TextField id="priceTextField" hint="Enter the price" keyboardType="number"/>
        </StackLayout>

        <!-- The 'forId' and 'height' properties are mandatory! -->
        <kt:Toolbar forId="priceTextField" height="44">
            <GridLayout columns="*, *, *, *, *, *" class="toolbar">
                <Label col="0" text="👍" tap="{{ appendToTextView }}"/>
                <Label col="1" text="👎" tap="{{ appendToTextView }}"/>
                <Label col="2" text="😄" tap="{{ appendToTextView }}"/>
            </GridLayout>
        </kt:Toolbar>

    </GridLayout>
</Page>
```

### Demo app
Check the source in the [demo](/demo) folder, or run it on your own device:

```bash
git clone https://github.com/EddyVerbruggen/nativescript-keyboard-toolbar
cd nativescript-keyboard-toolbar/src
npm i
npm run demo.ios # or .android
```

## Usage with NativeScript-Angular

### API

```html
```

### Demo app
Check the source in the [demo-ng](/demo-ng) folder, or run it on your own device:

```bash
git clone https://github.com/EddyVerbruggen/nativescript-keyboard-toolbar
cd nativescript-keyboard-toolbar/src
npm i
npm run demo-ng.ios # or .android
```

## Usage with NativeScript-Vue

### API

```html
```

### Demo app
Check the source in the [demo-vue](/demo-vue) folder, or run it on your own device:

```bash
git clone https://github.com/EddyVerbruggen/nativescript-keyboard-toolbar
cd nativescript-keyboard-toolbar/src
npm i
npm run demo-vue.ios # or .android
```

## Future work
- `SearchBar` support.
- Orientation-change support.
- Dismiss keyboard on iOS when tapping outside the keyboard (configurable). 
- Auto-scroll the view if the keyboard overlaps the text field.
- Modal support on Android (currently you can't use the toolbar in a modal because the toolbar is behind the modal)