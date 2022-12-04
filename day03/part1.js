const events = require('events');
const fs = require('fs');
const readline = require('readline');

var totalPoints = 0;

function pointsForChar(char) {
    var charPoints = char.charCodeAt(0) - 96;
    charPoints = charPoints < 0 ? charPoints + 58 : charPoints;
    console.log(charPoints);
    return charPoints;
}

function processGame(gameText) {
    var pointsThisGame = 0;
    var foundChars = [];
    console.log(gameText);

    const sack1 = gameText.substring(0, gameText.length / 2);
    const sack2 = gameText.substring(gameText.length / 2, gameText.length);

    for (let i = 0; i < sack1.length; i++) {
        var char = sack1.charAt(i);
        if (!foundChars.includes(char)) {
            foundChars.push(char);
            if(sack2.includes(char)) {
                console.log(char);
                pointsThisGame += pointsForChar(char);
            }
        }

        char = sack2.charAt(i);
        if (!foundChars.includes(char)) {
            foundChars.push(char);
            if(sack1.includes(char)) {
                console.log(char);
                pointsThisGame += pointsForChar(char);
            }
        }
    }

    return pointsThisGame;
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            totalPoints += processGame(line);
        });

        await events.once(rl, 'close');
        
        console.log(">> " + totalPoints);

    } catch (err) {
        console.error(err);
    }
})();