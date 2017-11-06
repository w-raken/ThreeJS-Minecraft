<p align="center">
    <img src="https://i.imgur.com/Rbs3RkC.png" width="650">
</p>

<hr>

> A simple kit for [Electron](https://electron.atom.io), [Angular 4](https://angular.io) and [Webpack 3](https://webpack.js.org) including a live reload system for Angular.

> The boilerplate include loaders for [TypeScript](https://www.typescriptlang.org/) and [Sass](http://sass-lang.com/).

> [Commands](#commands) are available to package your app or create installer on Windows, Mac and Linux.

## Quick start
### Prerequisites
Be sure to have **Node >= 6.0** and **NPM >= 5** installed on your computer/server
```bash
# check node version
node -v

# check npm version
npm --version
```

If you are confronted to the following error while executing our commands on **Mac OS** :
```bash
ERROR in {project_name}/image.jpg
     Module build failed: Error: dyld: Library not loaded: /usr/local/opt/libpng/lib/libpng16.16.dylib
       Referenced from: /Users/{project_name}/node_modules/mozjpeg/vendor/cjpeg
       Reason: image not found  
```
Please run this command : `brew install libpng`. See issue [here](https://github.com/tcoopman/image-webpack-loader/issues/51).

### Create a new project and install npm packages
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
|`npm run dev`| Execute the app with a live reload system and source mapping
|`npm run prod`| Build the app with css/js optimizations and minifications
|`npm run packager:win`| Package the app with prod configuration and generate .exe & supporting files
|| ↳ Default configuration : Platform Win32, Arch ia32
|`npm run packager:mac`| Package the app with prod configuration and generate .app & supporting files
|| ↳ Default configuration : Platform Darwin, Arch x64
|`npm run packager:linux`| Package the app with prod configuration and generate executable & supporting files
|| ↳ Default configuration : Platform Linux, Arch x64
|`npm run installer:win`| Create Squirrel installer to distribute your app easily
|| ↳ Setup.exe will install app in app_data directory
|| ↳ A desktop shortcut will be created
|| ↳ Default configuration : Platform Win32, Arch ia32 ~ *Tested on Windows 10*
|`npm run installer:mac`| Create DMG installer to distribute your app easily
|| ↳ Require XCode and XCode Command Line Tools
|| ↳ XCode licence must be accepted : `sudo xcodebuild -license accept`
|| ↳ Default configuration : Platform Darwin, Arch x64 ~ *Tested on High Sierra 10.13*
|`npm run installer:linux`| Create DEB installer to distribute your app easily
|| ↳ Default configuration : Platform Linux, Arch ia32 ~ *Tested on Ubuntu 16.04*

## Contributors
| [![Laurent BASSIN](https://avatars2.githubusercontent.com/u/11029822?s=115&v=4)](https://github.com/lbassin) | [![Maxime MARQUET](https://avatars0.githubusercontent.com/u/12535829?s=115&v=4)](https://github.com/x-Raz) |
| :--:|:--: |
| [Laurent BASSIN](https://github.com/lbassin) | [Maxime MARQUET](https://github.com/x-Raz) |

## License
MIT © [Laurent BASSIN](https://github.com/lbassin) & [Maxime MARQUET](https://github.com/x-Raz)
