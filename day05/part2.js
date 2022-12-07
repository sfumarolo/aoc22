const events = require('events');
const fs = require('fs');
const readline = require('readline');

var boxes = [];
var crane = [];

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            if (line.includes('[')) { //This is a row with some boxes in it
                console.log('Found a row of boxes');
                if (boxes.length == 0) {
                    var length = (line.length - 3) / 4 + 1;
                    for (var i = 0; i < length; i++) {
                        boxes.push([]);
                    }
                }

                for (var i = 0; i < boxes.length; i++) {
                    var charIndex = i * 4 + 1;
                    var char = line.charAt(charIndex);
                    if(char !== ' ') {
                        boxes[i].push(line.charAt(charIndex));
                    }
                }
                console.log(boxes);
            } else if (line.includes('move')) {
                console.log('Line contains instructions for a move');
                var splitResult = line.substring(5).split(/[^0-9]+/);
                for (var i = 0; i < parseInt(splitResult[0]); i++) {
                    crane.push(boxes[parseInt(splitResult[1]) - 1].pop());
                }

                for (var i = 0; i < parseInt(splitResult[0]); i++) {
                    boxes[parseInt(splitResult[2]) - 1].push(crane.pop())
                }
            } else if (line.includes('1')) { //This is the row of the stack identifiers
                console.log(`Done processing boxes. Here's the index row. Switching modes...`);
                boxes.forEach(stack => stack.reverse());
            }
        });

        await events.once(rl, 'close');
        
        console.log('Done!');

        var finalString = '';
        boxes.forEach(stack => finalString = finalString.concat(stack.pop()));
        console.log(finalString);

    } catch (err) {
        console.error(err);
    }
})();