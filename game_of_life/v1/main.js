// Pixi init
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(800, 700, null, true, true);
document.body.appendChild(renderer.view);
var graphics = new PIXI.Graphics();

// Cell size and numbers
var cell_size = 8;
var cell_dims = [Math.floor(renderer.width/cell_size), Math.floor(renderer.height / cell_size)];
var n = 0;

// Transitional state animation
var state_colours = [0x993300,
                     0x551133,
                     0x335555,
                     0x335577,
                     0x997799,
                     0x9999cc,
                     0xaaaaff,
                     0xffffff];
var state_count = state_colours.length;
var state_factor = 1 / state_count;

// Init state and neighbours array
var state = create_grid(cell_dims[0], cell_dims[1], false, true);
var oldstate = copy_grid(state);
var neighbours = create_grid(cell_dims[0], cell_dims[1], 0, false);

for(var y = 0; y < state.y_size; y++) {
    for(var x = 0; x < state.x_size; x++) {
        if(state[y][x]){
            change_cell(neighbours, x, y, state[y][x]);
        }
    }
}

requestAnimationFrame(game_loop);

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

// Draw an individual cell in a number of transitional states
function draw_cell(cellx, celly, state) {
    var centrex = (cellx * cell_size) + cell_size / 2;
    var centrey = (celly * cell_size) + cell_size / 2;
    var circle_size = cell_size / 2 * (state * state_factor);
    graphics.beginFill(state_colours[state]);
    graphics.drawCircle(centrex, centrey, circle_size);
    graphics.endFill();
}

// Draw the board
function draw(transition){
    graphics.clear();

    for(var y = 0; y < state.y_size; y++) {
        for(var x = 0; x < state.x_size; x++) {
            // Are we on, or in a directional transition?
            cs = state[y][x];
            os = oldstate[y][x];

            if (cs && os){
                draw_cell(x, y, state_count-1);
                continue;
            }

            if (cs && !os){
                draw_cell(x, y, transition);
                continue;
            }

            if (!cs && os){
                draw_cell(x, y, state_count - 1 - transition);
                continue;
            }

        }
    }

    stage.addChild(graphics);
    renderer.render(stage);
}

// Game loop, only update the board every state_count frames to allow for
// transition animations
function game_loop() {
    if(n >= state_count){
        oldstate = copy_grid(state);
        update();
        n = 0;
    }
    draw(n);
    n++;

    requestAnimationFrame(game_loop);
}
