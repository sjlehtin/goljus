import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Goljus from './Goljus';

const diff = require('jest-diff');

jest.useFakeTimers();

it('renders without crashing', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus />);
});

it('has current board state', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus />);
    expect(goljus.state.board).toBeDefined();
});

it('has board state size that depends on props', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" />);
    expect(goljus.state.board.length).toEqual(5);
    expect(goljus.state.board[0].length).toEqual(5);
});

it('can have board state size that is not square', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,6" />);
    expect(goljus.state.board.length).toEqual(5);
    expect(goljus.state.board[0].length).toEqual(6);
});

it('has a board by default', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus/>);
    expect(goljus.state.board.length).toEqual(30);
    expect(goljus.state.board[0].length).toEqual(30);
});

function compareBoards(oldBoard, newBoard) {
    if (oldBoard.width !== newBoard.width) {
        return false;
    }
    if (oldBoard.height !== newBoard.height) {
        return false;
    }

    for (let ii = 0; ii < oldBoard.width; ii++)   {
        for (let jj = 0; jj < oldBoard.height; jj++) {
            if (oldBoard[ii][jj] !== newBoard[ii][jj]) {
                return false;
            }
        }
    }
    return true;
}

expect.extend({
  toBeSimilarWithBoard(received, expected) {
    const pass = compareBoards(expected, received);
    const message = pass
      ? () => this.utils.matcherHint('.not.toBeSimilarWithBoard') + '\n\n' +
        `Expected value to not be (using ===):\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}`
      : () => {
        const diffString = diff(expected, received, {
          expand: this.expand,
        });
        return this.utils.matcherHint('.toBeSimilarWithBoard') + '\n\n' +
        `Expected value to be (using ===):\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}` +
        (diffString ? `\n\nDifference:\n\n${diffString}` : '');
      };

    return {actual: received, message, pass};
  }
});

it('can give the board to a caller', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="2,3"/>);
    expect(goljus.getBoard).toBeDefined();
    expect(goljus.getBoard()).toBeSimilarWithBoard(Goljus.createBoard(2, 3));
    expect(goljus.getBoard().height).toEqual(3);
    expect(goljus.getBoard().width).toEqual(2);
});

it('can update the board', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    expect(Goljus.updateBoard).toBeDefined();
    let oldBoard = goljus.getBoard();
    expect(Goljus.updateBoard(oldBoard)).toEqual(oldBoard);
});

it('kills cells with too few neighbors on update', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    expect(Goljus.updateBoard).not.toBe(undefined);
    let oldBoard = goljus.getBoard();
    oldBoard[2][2] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    expect(newBoard).not.toBeSimilarWithBoard(oldBoard);
    expect(newBoard).toBeSimilarWithBoard(Goljus.createBoard(5, 5));
});

it('kills cells with too many neighbors on update', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    expect(Goljus.updateBoard).not.toBe(undefined);
    let oldBoard = goljus.getBoard();
    oldBoard[0][1] = true;
    oldBoard[1][0] = true;
    oldBoard[1][1] = true;
    oldBoard[1][2] = true;
    oldBoard[2][1] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    expect(newBoard).not.toBeSimilarWithBoard(oldBoard);
    let expectedBoard = Goljus.createBoard(5, 5);
    expectedBoard[0][0] = true;
    expectedBoard[0][1] = true;
    expectedBoard[0][2] = true;
    expectedBoard[1][0] = true;
    expectedBoard[1][1] = false;
    expectedBoard[1][2] = true;
    expectedBoard[2][0] = true;
    expectedBoard[2][1] = true;
    expectedBoard[2][2] = true;

    expect(newBoard).toBeSimilarWithBoard(expectedBoard);
});

it('creates new cells on update', () => {
    let oldBoard = Goljus.createBoard(5, 5);
    oldBoard[2][1] = true;
    oldBoard[2][2] = true;
    oldBoard[3][2] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    let expectedBoard = Goljus.createBoard(5, 5);
    expectedBoard[2][1] = true;
    expectedBoard[2][2] = true;
    expectedBoard[3][2] = true;
    expectedBoard[3][1] = true;

    expect(newBoard).toBeSimilarWithBoard(expectedBoard);
});

it('has stable square form', () => {
    let oldBoard = Goljus.createBoard(5, 5);
    oldBoard[0][0] = true;
    oldBoard[4][4] = true;
    oldBoard[0][4] = true;
    oldBoard[4][0] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    expect(newBoard).toBeSimilarWithBoard(oldBoard);
});

it('has a cyclic form', () => {
    let oldBoard = Goljus.createBoard(5, 5);
    oldBoard[1][1] = true;
    oldBoard[1][2] = true;
    oldBoard[1][3] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    let expectedBoard = Goljus.createBoard(5, 5);
    expectedBoard[0][2] = true;
    expectedBoard[1][2] = true;
    expectedBoard[2][2] = true;

    expect(newBoard).toBeSimilarWithBoard(expectedBoard);
    expect(Goljus.updateBoard(newBoard)).toBeSimilarWithBoard(oldBoard);
});

it('has an advancing control', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    let oldBoard = goljus.getBoard();
    oldBoard[1][1] = true;
    oldBoard[1][2] = true;
    oldBoard[1][3] = true;

    goljus.tick();

    let expectedBoard = Goljus.createBoard(5, 5);
    expectedBoard[0][2] = true;
    expectedBoard[1][2] = true;
    expectedBoard[2][2] = true;

    expect(goljus.getBoard()).toBeSimilarWithBoard(expectedBoard);

    goljus.tick();
    expect(goljus.getBoard()).toBeSimilarWithBoard(oldBoard);
});

it('verifies shape argument', () => {
    expect(() => {
        TestUtils.renderIntoDocument(<Goljus shape="a"/>);
    }).toThrow(/correct format/);

    expect(() => {
        TestUtils.renderIntoDocument(<Goljus shape="5,a"/>);
    }).toThrow(/correct format/);

    expect(() => {
        TestUtils.renderIntoDocument(<Goljus shape="5"/>);
    }).toThrow(/correct format/);
});

it('verifies shape to be large enough', () => {
    expect(() => {
        TestUtils.renderIntoDocument(<Goljus shape="1,3"/>);
    }).toThrow(/width needs to be at least 2/);

    expect(() => {
        TestUtils.renderIntoDocument(<Goljus shape="3,1"/>);
    }).toThrow(/height needs to be at least 2/);
});

it('allows setting an update period', () => {

    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" period={500}/>);
    let oldBoard = goljus.getBoard();
    oldBoard[1][1] = true;
    oldBoard[1][2] = true;
    oldBoard[1][3] = true;

    goljus.tick = jest.fn(goljus.tick);

    expect(setTimeout).toBeCalledWith(expect.any(Function), 500);
    expect(setTimeout.mock.calls.length).toEqual(1);

    jest.runOnlyPendingTimers();

    expect(goljus.tick).toBeCalled();

    let expectedBoard = Goljus.createBoard(5, 5);
    expectedBoard[0][2] = true;
    expectedBoard[1][2] = true;
    expectedBoard[2][2] = true;

    expect(goljus.getBoard()).toBeSimilarWithBoard(expectedBoard);

    expect(setTimeout.mock.calls.length).toEqual(2);
});

it('allows setting seed', () => {
    let board = Goljus.createBoard(5, 5);
    board[1][1] = true;
    board[1][2] = true;
    board[1][3] = true;
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" seed={board} />);
    let newBoard = goljus.getBoard();
    expect(newBoard).toBeSimilarWithBoard(board);
});

it('allows setting random seed', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" seed="random" />);
    let newBoard = goljus.getBoard();
    expect(newBoard.height).toEqual(5);
});

it('allows setting random seed with a custom random value', () => {
    let spy = jest.fn(Goljus.randomInitializer);
    Goljus.randomInitializer = spy;
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" seed="random:30%" />);
    expect(spy).toBeCalledWith(expect.any(Number), expect.any(Number), 0.3);
    let newBoard = goljus.getBoard();
    expect(newBoard.height).toEqual(5);
});

it('allows setting custom seed initializer', () => {
    const init = jest.fn((ii, jj) => true );
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" seed={init} />);
    let expected = Goljus.createBoard(5, 5);
    for (let ii = 0; ii < expected.width; ii++) {
        for (let jj = 0; jj < expected.height; jj++) {
            expected[ii][jj] = true;
        }
    }
    expect(init).toBeCalledWith(0, 0);
    expect(init).toBeCalledWith(4, 4);
    expect(init.mock.calls.length).toEqual(25);
    expect(goljus.getBoard()).toBeSimilarWithBoard(expected);
});

it('verifies seed argument', () => {
    expect(() => { TestUtils.renderIntoDocument(<Goljus seed="invalid"/>);})
        .toThrow(/invalid seed/);
});

it('renders a table', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5" seed="random" />);
    let table = TestUtils.findRenderedDOMComponentWithTag(goljus, 'table');
    expect(table.querySelectorAll('td').length).toEqual(25);
});