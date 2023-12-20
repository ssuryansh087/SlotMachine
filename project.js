const prompt = require('prompt-sync')();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOL_COUNT = {
    'A': 3,
    'K': 6,
    'Q': 9,
    'J': 12
}

const SYMBOL_VALUES = {
    'A': 7,
    'K': 5,
    'Q': 3,
    'J': 2
}

const deposit = () => {
    while(true){
    const depositAmountString = prompt("Enter a Deposit Amount : ");
    const depositAmount = parseFloat(depositAmountString);

        if(isNaN(depositAmount) || depositAmount <= 0){
            console.log("Invalid Number, please try again!");
        }
        else{
            return depositAmount;
        }
    }
}

const getNumberOfLines = () => {
    while(true){
        const numberofLinesString = prompt("Enter a Number of Lines you want to bet on (1-3) : ");
        const numberofLines = parseFloat(numberofLinesString);
    
            if(isNaN(numberofLines) || numberofLines <= 0 || numberofLines > 3){
                console.log("Invalid Number, please try again!");
            }
            else{
                return numberofLines;
            }
    }
}

const getBet = (balance, lines) => {
    while(true){
        const betString = prompt("Enter the Bet Amount per Line : ");
        const bet = parseFloat(betString);
    
        if(isNaN(bet) || bet <= 0 || bet > balance / lines){
            console.log("Invalid Number, please try again!");
        }
        else{
            return bet;
        }
    }
}

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOL_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i = 0; i < COLUMNS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random()*reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            if(reelSymbols[randomIndex] == undefined){
                randomIndex++;
            }
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLUMNS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printSlots = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length -1 ){
                rowString += ' | ';
            }
        }
        console.log(rowString);
    }
}

const decideWin = (reels, bet, lines, balance) => {
    var linesWon = 0;
    var winnings = 0;
    for(let i = 0; i < lines; i++){
        for(let j = 0; j < COLUMNS - 2; j++){
            if(reels[i][j] == reels[i][j+1] && reels[i][j] == reels[i][j+2]){
                const symbol = reels[i][j];
                linesWon++;
                winnings += (SYMBOL_VALUES[symbol]) * bet;
                console.log(typeof(winnings));
                balance = balance + winnings;
                
            }
            else{
                balance = balance - bet;
            }
        }
    }
    if(linesWon == 0){
        console.log("You didn't win this time!");
    }
    else{
        console.log('You won at ' + linesWon + ' line(s)! Total winnings are ' + winnings + "!");
    }
    console.log('Your Balance is ' + balance  + '.');
    return balance;
}

const game = () => {
    let balance = deposit();

    while(true){
        if(balance > 0){
            const reels = spin();
            const numberofLines = getNumberOfLines();
            const bet = getBet(balance, numberofLines);
            const rows = transpose(reels);
            printSlots(rows);
            balance = decideWin(rows, bet, numberofLines, balance); 
        }
        else{
            console.log('You have no Money Left!');
            var playing = prompt("Do you want to play again? (Y/N) : ");
            if(playing == 'y' || playing == 'Y'){
                game();
            }
            else{
                console.log("Good Game!");
                break;
            }
        }
    }
}

game();