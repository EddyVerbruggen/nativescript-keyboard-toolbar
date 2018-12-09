var KeyboardToolbar = require("nativescript-keyboard-toolbar").KeyboardToolbar;
var keyboardToolbar = new KeyboardToolbar();

describe("greet function", function() {
    it("exists", function() {
        expect(keyboardToolbar.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(keyboardToolbar.greet()).toEqual("Hello, NS");
    });
});