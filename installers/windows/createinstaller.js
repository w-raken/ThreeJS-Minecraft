var electronInstaller = require('electron-winstaller');
var path = require('path');

var settings = {
	appDirectory: path.join(path.join((path.join('./'), 'win_packager'), 'Electron_Angular-win32-ia32/')),
	outputDirectory: path.join(path.join('./'), 'win_installer'),
	authors: '',
	exe: 'Electron_Angular.exe'
};

console.log('Creating windows installer');

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
	console.log("The installers of your application were succesfully created !");
}, (e) => {
	console.log('Error : ' + e.message);
});