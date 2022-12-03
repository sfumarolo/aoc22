const events = require('events');
const fs = require('fs');
const readline = require('readline');

var calsThisElf = 0;
var elfList = [];

function wrapElf() {
    console.log(">> " + calsThisElf);
    elfList.push(calsThisElf);
    calsThisElf = 0;
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            if (line ==='') {
                console.log(`This elf had ${calsThisElf} calories.`);
                wrapElf();
            } else {
                calsThisElf += parseInt(line, 10);
            }
            console.log(`Line ${line}`);
        });

        await events.once(rl, 'close');
        wrapElf();

        elfList.sort(function(a, b) {
            return b-a;
          });
        console.log(elfList);
        console.log(elfList[0]);
        
        var topSum = 0;
        for (let i = 0; i < 3; i++) {
            topSum += elfList[i];
        }
        console.log(topSum);

    } catch (err) {
        console.error(err);
    }
})();