const events = require('events');
const fs = require('fs');
const readline = require('readline');

var totalPoints = 0;
var sacksThisGroup = [];

function pointsForChar(char) {
    var charPoints = char.charCodeAt(0) - 96;
    charPoints = charPoints < 0 ? charPoints + 58 : charPoints;
    console.log(charPoints);
    return charPoints;
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            console.log(line);
            sacksThisGroup.push(line);
            if (sacksThisGroup.length == 3) {
                for (var i = 0; i < sacksThisGroup[0].length; i++) {
                    const searchingChar = sacksThisGroup[0].charAt(i);
                    if (sacksThisGroup[1].includes(searchingChar) &&
                        sacksThisGroup[2].includes(searchingChar)) {
                            console.log(searchingChar);
                            const charPoints = pointsForChar(searchingChar);
                            console.log(charPoints);
                            totalPoints += charPoints;
                            break;
                        }
                }




                sacksThisGroup = [];
            }
        });

        await events.once(rl, 'close');
        
        console.log(">> " + totalPoints);

    } catch (err) {
        console.error(err);
    }
})();