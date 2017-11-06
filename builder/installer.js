const path = require('path');
const json = require(path.resolve('./package.json'));
const os = require('os');
const exec = require('child_process').exec;

switch (process.env.NODE_OS) {
    case "mac":
        exec("mkdir mac_installer && electron-installer-dmg ./mac_packager/" + json.name + "-" + os.platform() + "-" + os.arch() + "/" + json.name + ".app " + json.name + " --out=mac_installer --overwrite && rm -rf mac_packager");
        break;
    case "linux":
        console.log('todo')
        break;
    case "win":
        const electronInstaller = require('electron-winstaller');

        var settings = {
            appDirectory: path.join(path.join((path.join('./'), 'win_packager'), json.name + "-" + os.platform() + "-" + os.arch() + '/')),
            outputDirectory: path.join(path.join('./'), 'win_installer'),
            authors: '',
            exe: json.name + 'exe'
        };

        console.log('Creating windows installer');

        resultPromise = electronInstaller.createWindowsInstaller(settings);

        resultPromise.then(() => {
            exec("del /s /q win_packager && rmdir /s /q win_packager");
            console.log("The installers of your application were succesfully created !");
        }, (e) => {
            console.log('Error : ' + e.message);
        });
        break;
    default:
        throw new Error("NODE_OS undefined");
}