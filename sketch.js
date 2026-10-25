const r = require("raylib");

function setup() {
    const world = {
        windowWidth: 600,
        windowHeight: 600,
        rows: 50,
        cols: 50,
    };

    world.sandArray = initEmptyArray(world.rows, world.cols);

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "SANDSCAPES");
    r.SetTargetFPS(60);

    return world;
}

function initEmptyArray(rows, cols) {
    const array = [];

    for (let row = 0; row < rows; row++) {
        const row = [];
        for (let col = 0; col < cols; col++) {
            row.push(0);
        }
        array.push(row);
    }
    return array;
}

function getSandColor() {
    return {
        r: 230,
        g: 210,
        b: 150,
        a: 100 + Math.floor(Math.random() * 155),
    };
}

function drawSandGrid(world) {
    const sandSide = world.windowWidth / world.cols;

    for (let row = 0; row < world.rows; row++) {
        for (let col = 0; col < world.rows; col++) {
            const posX = col * sandSide;
            const posY = row * sandSide;
            const currentSand = world.sandArray[row][col];
            const color = currentSand ? getSandColor() : r.WHITE;

            r.DrawRectangle(posX, posY, sandSide, sandSide, color);
        }
    }
}

function canSandFall(currentSand, belowSand) {
    return currentSand && !belowSand;
}

function canSandShiftSideways(current, below, belowLeft, belowRight) {
    return current && below && (!belowLeft || !belowRight);
}

function updateSandPosition(world) {
    for (let row = world.rows - 2; row >= 0; row--) {
        for (let col = 0; col < world.cols; col++) {
            const current = world.sandArray[row][col];
            const below = world.sandArray[row + 1][col];

            const belowLeft = world.sandArray[row + 1][col - 1];
            const belowRight = world.sandArray[row + 1][col + 1];

            if (canSandFall(current, below)) {
                world.sandArray[row][col] = 0;
                world.sandArray[row + 1][col] = 1;
            } else if (
                canSandShiftSideways(current, below, belowLeft, belowRight)
            ) {
                let offset = 0;
                if (!belowLeft && !belowRight) {
                    offset = Math.random() > 0.5 ? -1 : 1;
                } else if (!belowLeft && belowRight) {
                    offset = -1;
                } else {
                    offset = 1;
                }

                world.sandArray[row][col] = 0;
                world.sandArray[row + 1][col + offset] = 1;
            }
        }
    }
}

function isRowOutOfBounds(row, bound) {
    return row < 0 || row >= bound;
}

function handleSandCreation(world) {
    const radius = 2;

    if (r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT)) {
        const sandSide = world.windowWidth / world.cols;

        const colIdx = Math.floor(r.GetMouseX() / sandSide);
        const rowIdx = Math.floor(r.GetMouseY() / sandSide);

        for (let row = rowIdx - radius; row < rowIdx + radius; row++) {
            for (let col = colIdx - radius; col < colIdx + radius; col++) {
                if (Math.random() > 0.25 || isRowOutOfBounds(row, world.rows))
                    continue;
                world.sandArray[row][col] = 1;
            }
        }
    }
}

function isRunning() {
    return !r.WindowShouldClose();
}

function draw(world) {
    r.BeginDrawing();

    drawSandGrid(world);

    r.EndDrawing();
}

function update(world) {
    updateSandPosition(world);
    handleSandCreation(world);
}

function tearDown() {
    r.CloseWindow();
}

module.exports = {
    setup,
    isRunning,
    draw,
    update,
    tearDown,
};
