const events = require('events');
const fs = require('fs');
const readline = require('readline');

var forest = [];
var height;
var width;

function scenicScore(forest, x, y) {
    var thisHeight = forest[x][y];

    //Right
    var right = 0;
    for (var i = y + 1; i < width; i++) {
        if (forest[x][i] < thisHeight) {
            right++;
        } else {
            right++;
            break;
        }
    }

    //Left
    var left = 0;
    for (var i = y - 1; i >=0; i--) {
        if (forest[x][i] < thisHeight) {
            left++;
        } else {
            left++;
            break;
        }
    }

    //Up
    var up = 0;
    for (var i = x - 1; i >=0; i--) {
        if (forest[i][y] < thisHeight) {
            up++;
        } else {
            up++;
            break;
        }
    }

    //Down
    var down = 0;
    for (var i = x + 1; i < height; i++) {
        if (forest[i][y] < thisHeight) {
            down++;
        } else {
            down++;
            break;
        }
    }

    return up * down * left * right;

}

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
        
        height = forest.length;
        width = forest[0].length;

        var maxScenic = 0;
        for(var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var thisScenicScore = scenicScore(forest, i, j);
                if(thisScenicScore > maxScenic) {
                    maxScenic = thisScenicScore;
                }
            }
        }

        console.log(maxScenic);


    } catch (err) {
        console.error(err);
    }
})();