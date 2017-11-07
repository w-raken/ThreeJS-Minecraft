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
		'4': 'arm64',
		'5': 'amd64'
	}
};

switch (process.env.NODE_OS) {
	case "mac":
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['2'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=mac_packager --icon=builder/icons/mac/icon.icns");
		break;
	case "linux":
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['3'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=linux_packager --icon=builder/icons/linux/icon.png");
		break;
	case "win":
		exec("cross-env NODE_ENV=prod webpack && electron-packager . --overwrite --platform=" + spec['platform']['1'] + " --arch=" + spec['arch']['2'] + " --prune=true --out=win_packager --icon=builder/icons/win/icon.ico");
		break;
	default:
		throw new Error("NODE_OS undefined");
}