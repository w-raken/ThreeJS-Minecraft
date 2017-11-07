const path = require('path');
const json = require(path.resolve('./package.json'));
const exec = require('child_process').exec;

// See available platforms and archs here :
// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
const spec = {
	'platform': {
		'1': 'win32',
		'2': 'darwin',
		'3': 'linux'
	},
	'arch': {
		'1': 'ia32',
		'2': 'x64',
		'3': 'armv7l',
		'4': 'arm64'
	}
};

switch (process.env.NODE_OS) {
	case "mac":
		console.log('Creating mac packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['2'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=mac_packager --icon=builder/icons/mac/icon.icns", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./mac_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	case "linux":
		console.log('Creating linux packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['3'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=linux_packager --icon=builder/icons/linux/icon.png", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./linux_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	case "win":
		console.log('Creating win packager...');
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['1'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=win_packager --icon=builder/icons/win/icon.ico", (error) => {
			if (!error) {
				console.log('Successfully created packager at ./win_packager/');
			} else {
				console.log('Error : ' + error);
			}
		});
		break;
	default:
		throw new Error("NODE_OS undefined");
}