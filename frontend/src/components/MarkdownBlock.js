import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';

export default class MarkdownBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {text: props.text};
        this.id = props.id;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({text: e.target.value});
    }

    render() {
        return (
            <div className="MarkdownBlock" id="block">
                <TextareaAutosize
                    value={this.state.text}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}