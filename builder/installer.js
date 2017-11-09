const path = require('path');
const json = require(path.resolve('./package.json'));
const exec = require('child_process').exec;

// See available platform and arch here :
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

const linuxConfig = {
    src: "./linux_packager/" + json.name + "-" + spec['platform']['3'] + "-" + spec['arch']['2'] + "/",
    arch: "amd64",
    dest: "linux_installer",
    categories: [
        "Utility"
    ],
    lintianOverrides: [
        "changelog-file-missing-in-native-package"
    ]
};

switch (process.env.NODE_OS) {
    case "mac":
        console.log('Creating mac installer...');
        exec("mkdir mac_installer && electron-installer-dmg ./mac_packager/" + json.name + "-" + spec['platform']['2'] + "-" + spec['arch']['2'] + "/" + json.name + ".app " + json.name + " --out=mac_installer --overwrite && rm -rf mac_packager", (error) => {
            if (!error) {
                console.log('Removing mac_packager...');
                console.log('Successfully created installer at ./mac_installer/');
            } else {
                console.log('Error : ' + error);
            }
        });
        break;
    case "linux":
        const linuxInstaller = require('electron-installer-debian');

        console.log('Creating linux installer...');

        linuxInstaller(linuxConfig, (error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            console.log('Removing linux_packager...');
            console.log('Successfully created installer at ' + linuxConfig.dest);
        });
        break;
    case "win":
        const electronInstaller = require('electron-winstaller');

        let settings = {
            appDirectory: path.join(path.join((path.join('./'), 'win_packager'), json.name + "-" + spec['platform']['1'] + "-" + spec['arch']['2'] + '/')),
            outputDirectory: path.join(path.join('./'), 'win_installer'),
            authors: '',
            exe: json.name + '.exe',
            name: json.name.replace(/-/g, "_")
        };

        console.log('Creating windows installer...');

        resultPromise = electronInstaller.createWindowsInstaller(settings);

        resultPromise.then(() => {
            console.log('Removing win_packager...');
            exec("del /s /q win_packager && rmdir /s /q win_packager", { maxBuffer: 1024 * 2048 }, (error) => {
                if (!error) {
                    console.log("Successfully created installer at ./win_installer/");
                } else {
                    console.log('Error : ' + error);
                }
            });
        }, (e) => {
            console.log('Error : ' + e.message);
        });
        break;
    default:
        throw new Error("NODE_OS undefined");
}