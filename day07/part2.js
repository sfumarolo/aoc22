const { match } = require('assert');
const events = require('events');
const fs = require('fs');
const readline = require('readline');

var commands = [];

class Folder {
    constructor(parent) {
        this.parent = parent;
        this.subdirectories = {};
        this.files = [];
    }

    getSize() {
        var size = 0;
        for (const[key, value] of Object.entries(this.subdirectories)) {
            var subdSize = value.getSize();
            size += value.getSize();
        }
        this.files.forEach(file => size += file);
        return size;
    }

    getAllSubdSizes() {
        var sizes = [];
        sizes.push(this.getSize());
        for (const[key, value] of Object.entries(this.subdirectories)) {
            console.log(`${key} ...`);
            //console.log("===");
            //console.log(value);
            var subdsizes = value.getAllSubdSizes();
            //console.log(subdsizes);
            for(const value of subdsizes) {
                //console.log(`> ${value}`);
                sizes.push(value);
            }
        }
        return sizes;
    }
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            commands.push(line);
        });

        await events.once(rl, 'close');
        
        var root = new Folder(null);
        var pwd = root;

        for (const command of commands) {
            var cmdArray = command.split(' ');
            if (command == "$ cd ..") {
                console.log("Navigating Up");
                pwd = pwd.parent;
            } else if (command == "$ cd /") {
                // Do nothing. This is the initial statement
            } else if (command.startsWith("$ cd")) {
                console.log(`Navigating to ${cmdArray[2]}`);
                pwd = pwd.subdirectories[cmdArray[2]]
            } else if (command.startsWith("dir")) {
                console.log(`Adding subdirectory ${cmdArray[1]}`);
                pwd.subdirectories[cmdArray[1]] = new Folder(pwd);
            } else if (command.match(/[0-9]+\ .*/)) {
                console.log(`Adding file of size ${cmdArray[0]}`);
                pwd.files.push(parseInt(cmdArray[0]));
            }
        }

        console.log(root.getSize())
        const currentFree = 70000000 - root.getSize();
        const mustFree = 30000000 - currentFree;
        console.log(mustFree);
        console.log("-+-=");
        console.log(root.getAllSubdSizes());

        var allDsizes = root.getAllSubdSizes();

        allDsizes = allDsizes.sort((a, b) => a - b);
        console.log(allDsizes);
        console.log("---------");
        for (d of allDsizes) {
            //console.log(d);
            if ( d >= mustFree) {
                console.log(d);
                break;
            }
        }
        //console.log(allDsizes);
    } catch (err) {
        console.error(err);
    }
})();