function create_grid(x_size, y_size, init_value, random){
    var grid = [];
    for(var y = 0; y < y_size; y++){
        grid[y] = [];
        for(var x = 0; x < x_size; x++){
            if(random) {
                grid[y][x] = Math.random() <= 0.5 ? false : true;
            }
            else {
                grid[y][x] = init_value;
            }
        }
    }
    grid.x_size = x_size;
    grid.y_size = y_size;
    return grid;
}

function copy_grid(grid){
    var newArray = grid.map(function(arr) {
        return arr.slice();
    });
    return newArray;
}

function toroid(g, x, y){
    if(x < 0){x = g.x_size-1;}
    if(y < 0){y = g.y_size-1;}
    if(x > g.x_size-1){x = 0;}
    if(y > g.y_size-1){y = 0;}
    return {x: x, y: y};
}

function delta_grid(g, x, y, delta){
    var c = toroid(g, x, y);
    g[c.y][c.x] += delta;
}

function gv(g, x, y){
    var c = toroid(x, y);
    return g[c.y][c.x];
}

function neighbours(g, x, y){
    return [
        [gv(g, x-1, y-1), gv(g, x, y-1), gv(g, x+1, y-1)],
        [gv(g, x-1, y), gv(g, x, y), gv(g, x+1, y)],
        [gv(g, x-1, y+1), gv(g, x, y+1), gv(g, x+1, y+1)],
    ];
}

function change_cell(g, x, y, on) {
    var delta = on ? 1 : -1;

    delta_grid(g, x-1, y-1, delta)
    delta_grid(g, x, y-1, delta)
    delta_grid(g, x+1, y-1, delta)
    delta_grid(g, x-1, y, delta)
    delta_grid(g, x+1, y, delta)
    delta_grid(g, x-1, y+1, delta)
    delta_grid(g, x, y+1, delta)
    delta_grid(g, x+1, y+1, delta)
}

function log(s, n){
    for(var y = 0; y < s.y_size; y++) {
        var rows = "";
        var rown = "";
        for(var x = 0; x < s.x_size; x++) {
            rows += (s[y][x] ? "o" : ".") + " ";
            rown += n[y][x] + " ";
        }
        console.log(rows + "     " + rown);
    }
    console.log("|-------------|      |-------------|");
}
