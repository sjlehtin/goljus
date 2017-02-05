/* esversion: 6 */

import React, { Component } from 'react';

/*
From Wikipedia (https://en.wikipedia.org/wiki/Conway's_Game_of_Life):

Every cell interacts with its eight neighbours, which are the cells that are
horizontally, vertically, or diagonally adjacent. At each step in time,
the following transitions occur:

Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
/*

 In the board, a live cell is true and dead is false.

 */
class Goljus extends Component {
    constructor(props) {
        super(props);
        let [width, height] = props.shape.split(',', 2).map((x) => { return parseInt(x) });
        if (isNaN(width) || isNaN(height)) {
            throw new Error("shape needs to be correct format and is mandatory");
        }

        if (width < 2) {
            throw new Error(`width needs to be at least 2, was ${width}`);
        }

        if (height < 2) {
            throw new Error(`height needs to be at least 2, was ${height}`);
        }

        let board = new Array(width);
        for (let ii = 0; ii < width; ii++) {
            board[ii] = new Array(height).fill(false);
        }

        this.state = {board: Goljus.createBoard(width, height),
                      width: width, height: height};
        if (this.props.period) {
            setTimeout(() => { this._timerHandler() }, this.props.period);
        }
    }

    _timerHandler() {
        this.tick();
    }

    static createBoard(width, height) {
        let board = new Array(width);
        for (let ii = 0; ii < width; ii++) {
            board[ii] = new Array(height).fill(false);
        }
        board.width = width;
        board.height = height;
        return board;
    }

    getBoard() {
        return this.state.board;
    }

    static countNeighbors(board, xcoord, ycoord) {
        let numNeighbors = 0;
        for (let [ii, jj] of [[-1, -1], [-1, 0], [-1, 1],
                              [0, -1], [0, 1],
                              [1, -1], [1, 0], [1, 1]]) {
            let newX = xcoord + ii, newY = ycoord + jj;
            newX %= board.width;
            newY %= board.height;
            if (newX < 0) {
                newX += board.width;
            }
            if (newY < 0) {
                newY += board.height;
            }
            if (board[newX][newY]) {
                numNeighbors += 1;
            }
        }
        return numNeighbors;
    }

    static updateBoard(oldBoard) {
        let newBoard = Goljus.createBoard(oldBoard.width, oldBoard.height);

        for (let ii = 0; ii < oldBoard.width; ii++) {
            for (let jj = 0; jj < oldBoard.height; jj++) {
                let numNeighbors = Goljus.countNeighbors(oldBoard, ii, jj);
                if (oldBoard[ii][jj]) {
                    // Was alive.
                    if (numNeighbors < 2) {
                        newBoard[ii][jj] = false;
                    } else if (numNeighbors > 3) {
                        newBoard[ii][jj] = false;
                    } else {
                        newBoard[ii][jj] = true;
                    }
                } else {
                    // Was dead.
                    if (numNeighbors === 3) {
                        newBoard[ii][jj] = true;
                    } else {
                        newBoard[ii][jj] = false;
                    }
                }
            }
        }
        return newBoard;
    }

    tick() {
        console.log("Advancing state");
        this.setState({board: Goljus.updateBoard(this.state.board)});
    }

    render() {
        return <div />;
    }
}

Goljus.propTypes = {
    shape: React.PropTypes.string,
    period: React.PropTypes.number
};

Goljus.defaultProps = {shape: "30,30"}

export default Goljus;
