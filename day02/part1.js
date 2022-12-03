const events = require('events');
const fs = require('fs');
const readline = require('readline');

const oppMap = new Map();
oppMap.set('X', 'A');
oppMap.set('Y', 'B');
oppMap.set('Z', 'C');

const pointMap = new Map();
pointMap.set('X', 1);
pointMap.set('Y', 2);
pointMap.set('Z', 3);

var tournamentPoints = 0;

function game(opp, you) {
    var points = pointMap.get(you);

    if (opp === oppMap.get(you)) {
        points += 3;
    } else {
        if (
            (opp === 'A' && you === 'Y') ||
            (opp === 'B' && you === 'Z') ||
            (opp === 'C' && you === 'X')
        ) {
            points += 6;
        }
    }

    console.log(`This game won ${points} points`)
    return points;
}

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(process.argv[2]),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            const words = line.split(' ');
            tournamentPoints += game(words[0], words[1]);
        });

        await events.once(rl, 'close');

        console.log(tournamentPoints);

    } catch (err) {
        console.error(err);
    }
})();