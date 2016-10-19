// Pixi init
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(600, 600, null, true, true);
document.body.appendChild(renderer.view);
var graphics = new PIXI.Graphics();


var n = 0;
var state_count = 5;
var cell_size, cell_ctr, cell_diameter, cell_dims, state, neighbours;

// Init state and neighbours array
function init(){
    cell_size = 8;
    cell_ctr = cell_size /  2;
    cell_diameter = cell_size / 2.2;

    cell_dims = [Math.floor(renderer.width/cell_size), Math.floor(renderer.height / cell_size)];

    state = create_grid(cell_dims[0], cell_dims[1], false, true);
    neighbours = create_grid(cell_dims[0], cell_dims[1], 0, false);

    for(var y = 0; y < state.y_size; y++) {
        for(var x = 0; x < state.x_size; x++) {
            if(state[y][x]){
                change_cell(neighbours, x, y, state[y][x]);
            }
        }
    }
}

// Update board state
function update(){
    var current_n = copy_grid(neighbours);

    for(var y = 0; y < state.y_size; y++) {
        for(var x = 0; x < state.x_size; x++) {
            var n = current_n[y][x];
            var s = state[y][x];

            if (s) {
                if (n < 2 | n > 3){
                    change_cell(neighbours, x, y, false)
                    state[y][x] = false
                }
            }
            else{
                if (n == 3){
                    change_cell(neighbours, x, y, true)
                    state[y][x] = true
                }
            }
        }
    }
}

function connect_cells(fx, fy, tx, ty){
    if(fx > 0 && fy > 0 && tx > 0 && ty > 0 &&
       fx < cell_dims[0] && fy < cell_dims[1] && tx < cell_dims[0] && ty < cell_dims[1] &&
       state[ty][tx]){
        var cfx = (fx * cell_size) + cell_ctr
        var cfy = (fy * cell_size) + cell_ctr;
        var ctx = (tx * cell_size) + cell_ctr;
        var cty = (ty * cell_size) + cell_ctr;
        graphics.moveTo(cfx, cfy);
        graphics.lineTo(ctx, cty);
    }
}

// Draw an individual cell with connecting lines
function draw_cell(x, y, state) {
    var centrex = (x * cell_size) + cell_ctr;
    var centrey = (y * cell_size) + cell_ctr;
    graphics.beginFill(0xffffff);
    graphics.drawCircle(centrex, centrey, cell_diameter);

    graphics.lineStyle(5, 0xffffff);
    //connect_cells(x, y, x-1, y-1);
    connect_cells(x, y, x, y-1);
    connect_cells(x, y, x+1, y);
    connect_cells(x, y, x-1, y);
    //connect_cells(x, y, x+1, y-1);
    //connect_cells(x, y, x-1, y+1);
    connect_cells(x, y, x, y+1);
    //connect_cells(x, y, x+1, y+1);
    graphics.lineStyle(0, 0xffffff);

    graphics.endFill();
}

// Draw the board
function draw(transition){
    graphics.clear();

    for(var y = 0; y < state.y_size; y++) {
        for(var x = 0; x < state.x_size; x++) {
            // Are we on, or in a directional transition?
            cs = state[y][x];

            if (cs){
                draw_cell(x, y, state_count-1);
            }
        }
    }

    stage.addChild(graphics);
    renderer.render(stage);
}

function resize() {
    renderer.resize(window.innerWidth, window.innerHeight);
    init();
}

resize();
requestAnimationFrame(game_loop);

// Game loop, only update the board every state_count frames to allow for
// transition animations
function game_loop() {
    if(n >= state_count){
        update();
        n = 0;
    }
    draw(n);
    n++;

    requestAnimationFrame(game_loop);
}

window.onresize = resize;
