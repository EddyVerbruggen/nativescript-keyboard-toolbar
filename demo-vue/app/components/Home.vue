<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout>

      <StackLayout>
        <TextView id="tv2" text="Say it with emoji!" borderColor="#eee" borderWidth="1" height="60" class="m-t-15" android:paddingLeft="6"/>
      </StackLayout>

      <KeyboardToolbar forId="tv2" height="44">
        <GridLayout columns="*, *, *, *, *, *" class="toolbar">
          <Label col="0" text="👍" @tap="appendToTextView2"/>
          <Label col="1" text="👎" @tap="appendToTextView2"/>
          <Label col="2" text="😄" @tap="appendToTextView2"/>
          <Label col="3" text="🎉" @tap="appendToTextView2"/>
          <Label col="4" text="😕" @tap="appendToTextView2"/>
          <Label col="5" text="❤️" @tap="appendToTextView2"/>
        </GridLayout>
      </KeyboardToolbar>
    </GridLayout>
  </Page>
</template>

<script>
  import {topmost} from "tns-core-modules/ui/frame";

  export default {
    computed: {
      message() {
        return "Blank {N}-Vue app";
      }
    }, methods: {
      appendToTextView2(args) {
        const textView = topmost().currentPage.getViewById("tv2");
        console.log(args.object.text);
        textView.text += " " + args.object.text + " ";
        this.positionCursorAtEnd(textView);
      },
      positionCursorAtEnd(textView) {
        if (textView.android) {
          textView.android.setSelection(textView.text.length);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  // Start custom common variables
  @import '../app-variables';
  // End custom common variables

  // Custom styles
  .fa {
    color: $accent-dark;
  }

  .info {
    font-size: 20;
  }

  TextField, TextView {
    font-size: 13;
    padding: 6 0;
  }

  TextField {
    font-size: 13;
    padding: 6;
  }

  .toolbar {
    background-color: #f6f6f6;
    border-color: #c6c6c6;
    border-top-width: 1px;
  }

  .toolbar Label {
    color: #777;
    padding: 5 13;
    text-align: center;
    vertical-align: center;
  }
</style>
