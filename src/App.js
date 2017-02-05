import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Goljus from './Goljus';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {generation: 0};
    }

    onGameClick() {
        console.log("Game clicked");
        this.setState({generation: this.state.generation + 1});
    }

    render() {
        let foregroundStyle = {position: "absolute", width: "100%", height: "100%", zIndex: 1},
            gameStyle = {position: "absolute", opacity: "0.1", width: "100%", zIndex: 0},
            backgroundStyle = {position: "absolute", zIndex: -1, background: ""};

        return (
            <div className="App">
                <div style={{height: "600px"}}>
                    <div style={{position: "relative"}}>
                        <div style={foregroundStyle}>
                            <h1 className="App-header">Semeai Oy</h1>
                        </div>
                        <div style={gameStyle}>
                            <Goljus shape="30,40" seed="random:30%" period={1500} key={this.state.generation} onClick={() => this.onGameClick()}/>
                        </div>
                        <div style={backgroundStyle}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
