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
        if (typeof(width) === "undefined" || typeof(height) === "undefined" ||
            width === 0 || height === 0) {
            throw new Error("shape needs to be correct format and is mandatory");
        }

        let board = new Array(width);
        for (let ii = 0; ii < width; ii++) {
            board[ii] = new Array(height).fill(false);
        }

        this.state = {board: Goljus.createBoard(width, height),
                      width: width, height: height};
    }

    static createBoard(width, height) {
        let board = new Array(width);
        for (let ii = 0; ii < width; ii++) {
            board[ii] = new Array(height).fill(false);
        }
        return board;
    }

    getBoard() {
        return this.state.board;
    }

    static updateBoard(oldBoard) {
        return Goljus.createBoard(oldBoard.length, oldBoard[0].length);
    }

    render() {
        return <div />;
    }
}

Goljus.defaultProps = {shape: "30,30"}

export default Goljus;
