const path = require('path');
const json = require(path.resolve('./package.json'));
const os = require('os');
const exec = require('child_process').exec;

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

const linuxConfig = `{
    "dest": "linux_installer",
    "categories": [
        "Utility"
    ],
    "lintianOverrides": [
        "changelog-file-missing-in-native-package"
    ]
}`;

switch (process.env.NODE_OS) {
    case "mac":
        exec("mkdir mac_installer && electron-installer-dmg ./mac_packager/" + json.name + "-" + spec['platform']['2'] + "-" + spec['arch']['2'] + "/" + json.name + ".app " + json.name + " --out=mac_installer --overwrite && rm -rf mac_packager");
        break;
    case "linux":
        exec("electron-installer-debian --src ./linux_packager/" + json.name + "-" + spec['platform']['3'] + "-" + spec['arch']['2'] + "/ --arch " + spec['arch']['5'] + " --dest linux_installer --config " + linuxConfig);
        break;
    case "win":
        const electronInstaller = require('electron-winstaller');

        var settings = {
            appDirectory: path.join(path.join((path.join('./'), 'win_packager'), json.name + "-" + spec['platform']['1'] + "-" + spec['arch']['1'] + '/')),
            outputDirectory: path.join(path.join('./'), 'win_installer'),
            authors: '',
            exe: json.name + '.exe',
            name: json.name.replace(/-/g, "_")
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