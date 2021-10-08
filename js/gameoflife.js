function seed(...args) {
    return [...args];
}

function same([x, y], [j, k]) {
    return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
    return this.find(c => same(c, cell));
}

const printCell = (cell, state) => {
    return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
    const result = {
        topRight: [0, 0],
        bottomLeft: [0, 0]
    };

    if (state.length > 0) {
        const xValues = state.map(cell => cell[0]);
        const yValues = state.map(cell => cell[1]);
        result.topRight = [Math.max(...xValues), Math.max(...yValues)];
        result.bottomLeft = [Math.min(...xValues), Math.min(...yValues)];
    }

    return result;
};

const printCells = (state) => {
    const { bottomLeft, topRight } = corners(state);
    let grid = [];
    let y = bottomLeft[1];

    // While y isn't at highest value
    while (y <= topRight[1]) {
        let x = bottomLeft[0];
        // While x isn't at highest value
        let row = [];
        while (x <= topRight[0]) {
            row.push(printCell([x, y], state));
            x++;
        }
        grid.unshift(row.join(' ') + '\n');
        y++;
    }

    return grid.join('');
};

const getNeighborsOf = ([x, y]) => {
    return [
            [x - 1, y + 1], [x, y + 1],
            [x + 1, y + 1], [x - 1, y],
            [x + 1, y], [x - 1, y - 1],
            [x, y - 1], [x + 1, y - 1]
        ];
};

const getLivingNeighbors = (cell, state) => {
    const neighbours = getNeighborsOf(cell);

    return neighbours.filter(cell => contains.call(state, cell));
};

const willBeAlive = (cell, state) => {
    const livingNeighbours = getLivingNeighbors(cell, state);

    return !!(livingNeighbours.length === 3 || contains.call(state, cell) && livingNeighbours.length === 2);
};

const calculateNext = (state) => {
    const currentStateCorners = corners(state);
    const extendedStateCorners = {
        topRight: [currentStateCorners.topRight[0] + 1, currentStateCorners.topRight[1] + 1],
        bottomLeft: [currentStateCorners.bottomLeft[0] - 1, currentStateCorners.bottomLeft[1] - 1]
    };

    let grid = [];
    let y = extendedStateCorners.bottomLeft[1];
    // While y isn't at highest value
    while (y <= extendedStateCorners.topRight[1]) {
        let x = extendedStateCorners.bottomLeft[0];
        // While x isn't at highest value
        while (x <= extendedStateCorners.topRight[0]) {
            grid.push([x, y])
            x++;
        }
        x = extendedStateCorners.bottomLeft[0];
        y++;
    }

    return grid.filter(cell => willBeAlive(cell, state));
};

const iterate = (state, iterations) => {
  const states = [state];

    let i = 0;
    while(i < iterations) {
        states.push(calculateNext(states[states.length - 1]));
      i++;
    }

    return states;
};

const main = (pattern, iterations) => {
  const states = iterate(startPatterns[pattern], iterations);
  states.forEach(state => {
    console.log(printCells(state));
  })
};

const startPatterns = {
    rpentomino: [
        [3, 2],
        [2, 3],
        [3, 3],
        [3, 4],
        [4, 4]
    ],
    glider: [
        [-2, -2],
        [-1, -2],
        [-2, -1],
        [-1, -1],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [2, 3]
    ],
    square: [
        [1, 1],
        [2, 1],
        [1, 2],
        [2, 2]
    ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
        main(pattern, parseInt(iterations));
    } else {
        console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
