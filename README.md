# BallistaVue

A lean and simple launcher for Mirth Connect Admin Client.

**Note: This is a fork of [kayyagari:ballista](https://github.com/kayyagari/ballista) with an alternative frontend written with Vue3**

## Usage
1. Go to releases and download a suitable installer for your OS platform
2. Create a new connection or if you are using MirthConnect Admin Launcher then import existing connections from `<MCAL-root>/data/connections.json`
3. Select a connection from the list of connections on the left hand side
4. Adjust the `Java Home` field's value if necessary **(Ballista assumes JRE version 8 or higher was already installed on the local machine)**
5. Click on `Open`

## Known Issues
* Ballista cannot open MC Admin Client for version 3.10.1 due to the bug in MC server https://github.com/nextgenhealthcare/connect/issues/4432. This bug in MC server was fixed in version 3.11.0.

## Development

### Recommended IDE Setup

#### VSCode

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

##### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

#### Jetbrains IDEs

##### Prerequisites
* [Rust plugin](https://www.jetbrains.com/rust/)

## Building
These compilation instructions are written for users not familiar with Rust and Tauri who just want to build and use Catapault.

You should generally follow the official [getting started guide](https://tauri.app/v1/guides/getting-started/prerequisites) from Tauri. 

A good reference for how to run builds is the file `.github/workflows/build-ballista.yml`. If you can replicate the same steps the build pipeline does, then you should have good builds!

### MacOS
1. Open the project in VS Code. Let VS code install the suggested plugins.
2. Install Rust `brew install rust`
3. Install dependencies `yarn`
4. Run `yarn tauri build`
5. A DMG will be built at `./src-tauri/target/release/bundle/dmg/Ballista_0.1.0_aarch64.dmg`
6. Install the app as usual. An installation to `~/Applications` instead of `/Applications` is best for development.

### Linux

Should be very similar to MacOS.

### Windows

Please make a PR if you use Windows and know how to compile the app!

___Follow the instructions at___: https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-windows

Follow the openssl instructions at: https://docs.rs/crate/openssl/0.9.24 *EXCEPT* you have to use different commands to set env vars in PowerShell:
```
$env:OPENSSL_DIR='C:\Program Files\OpenSSL-Win64\'
$env:OPENSSL_INCLUDE_DIR='C:\Program Files\OpenSSL-Win64\include'
$env:OPENSSL_LIB_DIR='C:\Program Files\OpenSSL-Win64\lib'
$env:OPENSSL_NO_VENDOR=1
Get-ChildItem Env
```