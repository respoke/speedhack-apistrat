# Welcome to the speed hack challenge

## What you'll need

1. Chrome browser.
2. Respoke account.

## Your mission

1. ***FORK THE CODE PEN*** here: http://codepen.io/Respoke/pen/BdlHK/left/?editors=001
  1. BE SURE TO FORK!
2. Add your appid to the top of the JavaScript.
3. Implement the speedHack() function per these notes:
  1. Docs here may help: https://docs.respoke.io/js-library/respoke.Client.html#startCall
  2. speedHack() is called when the "call" button is clicked
  3. Start a call with the endpoint specified by friendId (which is set for you)
  4. This smaple app contains onConnect() and onLocalMedia() helper funtions you may wish to use
  5. ***BE SURE TO SAVE YOUR FORK'D CODEPEN***
4. Submit your solution. https://docs.google.com/forms/d/17ydlCbAdl9G8AqlFH_VrMl7M0wKDaI0AkBtlJqFyi4c/viewform
5. Send respoke\_judge a message on IRC with your codepen URL.
  1. You can use http://webchat.freenode.net/?channels=apistrat or any IRC client connected to freenode/#apistrat.
6. We'll call you on your app!
  1. Accept the video call by clicking 'allow'.
  2. Tell us what you want to use Respoke for.

### OPTIONAL

You can either modify the fork'd codepen or modify the code locally and then copy/paste into codepen to do the video call.

    $   git clone git@github.com:respoke/speedhack-apistrat.git
    $   cd speedhack-apistrat
    $   npm install -g http-server
    $   http-server

Now visit http://localhost:8080 in your Chrome browser.
