const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
	.then(createWindowsInstaller)
	.catch((error) => {
		console.error(error.message || error)
		process.exit(1)
	})

function getInstallerConfig() {
	console.log('Creating windows installer')
	const rootPath = path.join('./')
	const outPath = path.join(rootPath, 'win_packager')

	return Promise.resolve({
		appDirectory: path.join(outPath, 'Electron_Angular-win32-ia32/'),
		authors: '',
		noMsi: true,
		outputDirectory: path.join(rootPath, 'win_installer'),
		exe: 'Electron_Angular.exe',
		setupExe: 'Electron_Angular_Installer.exe',
		//setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
	})
}