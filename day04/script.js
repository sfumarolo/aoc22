const events = require('events');
const fs = require('fs');
const readline = require('readline');

var fullOverlap = 0;
var partialOverlap = 0;

function buildRange(range) {
    var split = range.split('-');
    return {
        min: parseInt(split[0], 10),
        max: parseInt(split[1], 10)
    }
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            //console.log(`${line}`);
            const ranges = line.split(',');
            var r1 = buildRange(ranges[0]);
            var r2 = buildRange(ranges[1]);

            if (((r1.min <= r2.min) && (r1.max >= r2.max)) ||
                (r2.min <= r1.min) && (r2.max >= r1.max)) {
                    console.log(`${line}`);
                    fullOverlap += 1;
            }

            if (((r1.max >= r2.min) && (r1.min <= r2.min)) ||
                ((r2.max >= r1.min) && (r2.min <= r1.min))) {
                    console.log(`${line}`);
                    partialOverlap += 1;
            }
        });

        await events.once(rl, 'close');

        console.log(fullOverlap);
        console.log(partialOverlap);

    } catch (err) {
        console.error(err);
    }
})();