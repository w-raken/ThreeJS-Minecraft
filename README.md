<p align="center">
    <img src="https://i.imgur.com/w9lqUrU.png" width="650">
</p>

<hr>

> A simple kit for [Electron](https://electron.atom.io), [Angular 4](https://angular.io) and [Webpack 3](https://webpack.js.org) including a live reload system for Angular.

> The boilerplate include loaders for [TypeScript](https://www.typescriptlang.org/) and [Sass](http://sass-lang.com/).

> [Commands](#commands) are available to package your app or create installer on Windows, Mac and Linux.

## Quick start
### Be sure to have Node version >= 6.0 and NPM >= 5 installed on your computer/server

```bash
# clone via ssh
git clone git@github.com:lbassin/Electron_Angular.git
# or clone via https
git clone https://github.com/lbassin/Electron_Angular.git

# change directory to the app
cd Electron_Angular

# install dependencies with npm
npm install
```
## <a name="commands"></a>Commands
|Command|Description|
|--|--|
|`npm run dev`| Execute the app with a live reload system and source mapping |
|`npm run prod`| Build the app with css/js optimizations and minifications |
|`npm run packager:win`| Package the app with prod configuration and generate .exe and supporting files
|| ↳ Default configuration : Platform Win32, Arch ia32
|`npm run packager:mac`| Package the app with prod configuration and generate .app and supporting files
|| ↳ Default configuration : Platform Darwin, Arch x64
|`npm run packager:linux`| *Soon* |
|`npm run installer:win`| *Soon* |
|`npm run installer:mac`| Create DMG installer to distribute your app easily |
|| ↳ Require XCode and XCode Command Line Tools
|| ↳ XCode licence must be accepted : `sudo xcodebuild -license accept`
|| ↳ Default configuration : Platform Darwin, Arch x64
|`npm run installer:linux`| *Soon* |

## Contributors
| [![Laurent BASSIN](https://avatars2.githubusercontent.com/u/11029822?s=115&v=4)](https://github.com/lbassin) | [![Maxime MARQUET](https://avatars0.githubusercontent.com/u/12535829?s=115&v=4)](https://github.com/x-Raz) |
| :--:|:--: |
| [Laurent BASSIN](https://github.com/lbassin) | [Maxime MARQUET](https://github.com/x-Raz) |

## License
MIT © [Laurent BASSIN](https://github.com/lbassin) & [Maxime MARQUET](https://github.com/x-Raz)
