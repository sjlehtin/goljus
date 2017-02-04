import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Goljus from './Goljus';

it('renders without crashing', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus />);
});

it('has current board state', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus />);
    expect(goljus.state.board).not.toBe(undefined);
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

it('can give the board to a caller', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="2,3"/>);
    expect(goljus.getBoard).not.toBe(undefined);
    expect(goljus.getBoard()).toEqual([
        [false, false, false],
        [false, false, false]])
});

it('can update the board', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    expect(Goljus.updateBoard).not.toBe(undefined);
    let oldBoard = goljus.getBoard();
    expect(Goljus.updateBoard(oldBoard)).toEqual(oldBoard);
});

it('kills dead cells on update', () => {
    let goljus = TestUtils.renderIntoDocument(<Goljus shape="5,5"/>);
    expect(Goljus.updateBoard).not.toBe(undefined);
    let oldBoard = goljus.getBoard();
    oldBoard[2][2] = true;
    let newBoard = Goljus.updateBoard(oldBoard);
    expect(newBoard).not.toEqual(oldBoard);
    expect(newBoard).toEqual(Goljus.createBoard(5, 5));
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

    expect(newBoard).toEqual(expectedBoard);
});
