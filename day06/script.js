const tokenLength = process.argv[2];
const input = process.argv[3];
console.log(input);

for (var i = tokenLength; i < input.length; i++) {
    var token = input.substring(i-tokenLength, i);
    console.log(token);

    var unique = true;
    for (var j = 0; j < tokenLength; j++) {
        if (token.lastIndexOf(token.charAt(j)) !== j) {
            unique = false;
            break;
        }
    }

    if (unique) {
        console.log (i);
        break;
    }
}