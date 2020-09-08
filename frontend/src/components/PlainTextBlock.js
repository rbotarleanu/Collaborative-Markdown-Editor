import React, { Component } from 'react';


export default class PlainTextBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        }
    }

    render() {
        return (
            <div className="PlainTextBlock">
                {this.state.text}
            </div>
        )
    }
}