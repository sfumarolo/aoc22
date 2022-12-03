const events = require('events');
const fs = require('fs');
const readline = require('readline');

const winLoseDrawPoints = new Map();
winLoseDrawPoints.set('X', 0);
winLoseDrawPoints.set('Y', 1);
winLoseDrawPoints.set('Z', 2);

const posMap = new Map();
posMap.set('A', 0);
posMap.set('B', 1);
posMap.set('C', 2);

const playPoints = [1, 2, 3]

var tournamentPoints = 0;

function game(opp, requiredResult) {
    
    var oppPlayPointsIndex = posMap.get(opp);

    var shift = winLoseDrawPoints.get(requiredResult) - 1;

    var ourPosition = (oppPlayPointsIndex + shift) % 3;
    ourPosition = ourPosition < 0 ? ourPosition + 3 : ourPosition;
    var points = winLoseDrawPoints.get(requiredResult) * 3 + playPoints[ourPosition];

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