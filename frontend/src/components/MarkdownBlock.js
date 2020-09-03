import React, { Component } from 'react';
import '../styles/Block.css';

export default class MarkdownBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {text: props.text};
        this.id = props.id;
    }

    render() {
        return (
            <div className="Block" id="block">
                {this.state.text}
            </div>
        )
    }
}