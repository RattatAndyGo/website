let bgColor = "#f6f6f6";
let pageWidth = 1200;   // Width of page content in pixels
let colors = ["#00ffff", "#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00", "#aa00ff", "#ff00aa", "#8f6a23", "#23628f", "#000000", "#ffffff"]

let win_amount = 4;     // How many consecutive coins are needed to win, static constant
let amount_of_rows = 6;
let amount_of_columns = 8;
let playerCount = 2;

let has_finished;
let current_player;     // Index of colors array
let current_turn;       // Turn counter
let total_seconds;
let game_state;
initialize_game_variables();

setInterval(update_timer, 1000);

function create_empty_game(){
    let game_state = [];
    for(let i = 0; i < amount_of_rows; i++){
        let row = []
        for(let j = 0; j < amount_of_columns; j++){
            row[j] = 0;
        }
        game_state[i] = row;
    }

    return game_state;
}

window.onload = function(){
    draw();
    document.getElementById("amount_of_rows").onchange = function(){
        amount_of_rows = this.value;
        reset_game();
        draw();
    }
    document.getElementById("amount_of_columns").onchange = function(){
        amount_of_columns = this.value;
        reset_game();
        draw();
    }
    document.getElementById("playerCount").onchange = function(){
        playerCount = this.value;
        reset_game();
        draw();
    }
}

function draw(){
    // Create HTML
    let field_html = '';
    for(let i = 0; i < amount_of_rows; i++){
        field_html += get_row_html(i);
    }
    document.getElementById("game_table").innerHTML = field_html;

    let cellWidth = Math.max(pageWidth / amount_of_columns, 20);
    let thickness = Math.min(10, (cellWidth) / 5);
    for(let i = 0; i < amount_of_rows; i++){
        for(let j = 0; j < amount_of_columns; j++){
            let cell = document.getElementById('game_table').rows[i].cells[j];
            let style = `width: ${cellWidth}px; height: ${cellWidth}px; border-radius: ${cellWidth/2}px; background-color: ${colors[game_state[i][j]]};`;
            if(cell.classList.contains('highlighted')) style += `border: ${thickness}px solid #008000;`;
            cell.style = style;
        }
    }
}

function get_row_html(index){
    let row_html = "<tr>";
    for(let j = 0; j < amount_of_columns; j++){
        row_html += get_cell_html(index, j);
    }
    row_html += "</tr>";
    return row_html;
}

function get_cell_html(row, column){
    let move = get_first_empty_slot(column);
    if(move == row && !has_finished){
        return `<td class="highlighted" onclick="add_coin(${column})"></td>`;}
    return `<td></td>`;
}

// Returns the index of the row where the next coin should go.
// Returns -1 if the column is full
function get_first_empty_slot(column){
    let row = -1;
    for(let i = amount_of_rows - 1; i >=0 ; i--){
        if(game_state[i][column] == 0){
            row = i;
            break;
        }
    }
    return row;
}

function add_coin(column){
    if(!has_finished){
        let row = get_first_empty_slot(column);
        if(row == -1){
            return;
        }
        game_state[row][column] = current_player;
        check_game_state(row, column);
        change_active_player();
        draw();
    }
}

function change_active_player(){
    if(has_finished) return;
    current_turn++;
    current_player = (current_player)%playerCount + 1;
    let color = colors[current_player];
    document.getElementById("player").style.backgroundColor = color;
}

function has_won(){
    has_finished = true;
    document.getElementById("notifications").innerHTML = `<p>Player ${current_player} won!</p>`;
}

function check_game_state(row, column){
    check_horizontal(row, column);
    check_vertical(row, column);
    check_main_diagonal(row, column);
    check_secondary_diagonal(row, column);
    check_draw(row, column);
}

function check_generalized(row, column, row_increment, column_increment){
    let consecutive_coins = 0;
    let player = game_state[row][column];

    while(in_board(row, column) && game_state[row][column] == player){
        row -= row_increment;
        column -= column_increment;
    }
    row += row_increment;
    column += column_increment;    // Now row/column is index of start of line

    while(in_board(row, column) && game_state[row][column] == player){
        row += row_increment;
        column += column_increment;
        consecutive_coins++;
    }

    if(consecutive_coins >= win_amount){
        has_won();
    }
}

function in_board(row, column){
    return(row >= 0 && column >= 0 && row < amount_of_rows && column < amount_of_columns);
}

function check_horizontal(row, column){
    check_generalized(row, column, 0, 1);
}

function check_vertical(row, column){
    check_generalized(row, column, 1, 0);
}

function check_main_diagonal(row, column){
    check_generalized(row, column, 1,1);
}

function check_secondary_diagonal(row, column){
    check_generalized(row, column, 1, -1);
}

function check_draw(){
    if(current_turn == amount_of_rows*amount_of_columns){
        document.getElementById("notifications").innerHTML = "<p>The game is a draw.</p>";
        document.getElementById("player").style.backgroundColor = "#ffffff";
        has_finished = true;
    }
}

function initialize_game_variables(){
    has_finished = false;
    current_player = 1;
    current_turn = 0;
    total_seconds = 0;
    game_state = create_empty_game();
}

function reset_game(){
    initialize_game_variables();
    draw();
}

// Source: based on https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function update_timer(){
    if(!has_finished){
        let minutes = add_leading_zero(Math.floor(total_seconds/60));
        let seconds = add_leading_zero(total_seconds % 60);
        let time = minutes + ":" + seconds;
    
        document.getElementById("timer").innerHTML = time;
        total_seconds++;
    }
}

function add_leading_zero(number){
    let res = `${number}`;
    if(res.length == 1){
        res = "0" + res;
    }
    return res;
}

function changeBoardSize(){
    document.getElementById("page-content").style = "max-width: 100vw; width: 100vw;"
    pageWidth = document.getElementById("page-content").offsetWidth;
    draw();
}