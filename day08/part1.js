const events = require('events');
const fs = require('fs');
const readline = require('readline');

var forest = [];

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            var row = [];
            for (var i = 0; i < line.length; i++) {
                row.push(parseInt(line.charAt(i)));
            }
            forest.push(row);
            //console.log(`Line ${line}`);
        });

        await events.once(rl, 'close');
        
        var height = forest.length;
        var width = forest[0].length;

        var visible = [];

        //From left
        for (var i = 0; i < height; i++) {
            visible.push(new Array(width));
            var maxSeen = -1;
            for (var j = 0; j < width; j++) {
                if (forest[i][j] > maxSeen) {
                    visible[i][j] = true;
                    maxSeen = forest[i][j];
                } else {
                    visible[i][j] = false;
                }
                //console.log(visible);
            }
        }

        //From right
        for (var i = 0; i < height; i++) {
            var maxSeen = -1;
            for (var j = width - 1; j >= 0; j--) {
                //console.log(`(${i},${j}) : ${forest[i][j]} > ${maxSeen}`)
                if (forest[i][j] > maxSeen) {
                    visible[i][j] = true;
                    maxSeen = forest[i][j];
                }
                //console.log(visible);
            }
        }

        //From top
        for (var j = 0; j < width; j++) {
            var maxSeen = -1;
            for (var i = 0; i < height; i++) {
                //console.log(`(${i},${j}) : ${forest[i][j]} > ${maxSeen}`)
                if (forest[i][j] > maxSeen) {
                    visible[i][j] = true;
                    maxSeen = forest[i][j];
                }
                //console.log(visible);
            }
        }

        //From bottom
        for (var j = 0; j < width; j++) {
            var maxSeen = -1;
            for (var i = height - 1; i >= 0; i--) {
                //console.log(`(${i},${j}) : ${forest[i][j]} > ${maxSeen}`)
                if (forest[i][j] > maxSeen) {
                    visible[i][j] = true;
                    maxSeen = forest[i][j];
                }
                //console.log(visible);
            }
        }

        //console.log(`Forest is ${width} wide by ${height} tall.`);

        //console.log(visible);

        var visibleCount = 0;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                if (visible[i][j]) {
                    visibleCount++;
                }
            }
        }

        console.log(visibleCount);

    } catch (err) {
        console.error(err);
    }
})();