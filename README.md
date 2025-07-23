# Sqwid SDK

SDK to build dApps compatible with Sqwid NFT Marketplace.

## Installation

```yarn add sqwid-sdk```

Make sure the consuming project has `@reef-chain/util-lib` installed.

`yarn add @reef-chain/util-lib`

## Functions

The library exports 4 main functions.

1. `connectToReef`

Allows you to connect to Reef Chain using browser extension, returns observables for `selectedReefSigner` (connected reef account), `signers` (all accounts in connected extension) , `provider` (provider instance to connect to reef chain), `loading` (status of connecting to extension), `reefState` (function which comes with various methods for state management)

Importing connectToReef

```ts
// import like this
import { connectToReef } from 'sqwid-sdk';
```

You can initialise it like this, and use the `state` to store the value of `signers`,`selectedReefSigner`,`provider`,`loading`,`reefState`,`error` etc.

```ts
// put this in any function
const reef$ = connectToReef('sqwid-sdk-sample');

reef$.subscribe((state) => {
    if (state.loading) return;

    if (state.error) {
    console.error('REEF ERROR:', (state.error as any).message);
    } else {
    console.log('Reef State:', state);
    }
}
```

2. `connectToSqwid` [IMPORTANT]

Allows you to connect to Sqwid Backend, this should be called everytime you switch the account or want to connect to Sqwid first, as it sets the headers in your browser, which are used to make all the sqwid calls. So this is neccessary

Importing `connectToSqwid`

```ts
import {connectToSqwid} from 'sqwid-sdk';
```

To connect to sqwid, the first requirement is connectToReef has been initialized already. As you need to pass the selectedSigner to connect to sqwid backend.

```ts
await connectToSqwid(selectedReefSigner); //here selectedReefSigner is reefExtensionConnectResponse.selectedReefSigner 
```

This function will sets the required cookies in Header to make calls to Sqwid.

3. `sqwidRead`

This comes with various methods.

<img width="809" height="148" alt="Screenshot 2025-07-23 at 12 50 14 PM" src="https://github.com/user-attachments/assets/0d38adef-f2a7-4ea5-b506-9ac3e6dd2b96" />
