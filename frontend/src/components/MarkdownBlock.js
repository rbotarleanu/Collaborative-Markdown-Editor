import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';
import RenderableMarkdownBlock from './RenderableMarkdownBlock.js';

export default class MarkdownBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false
        };
        this.id = props.id;

        this.notifyInFocus = props.notifyFocus;
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOffFocus = this.handleOffFocus.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleOnFocus() {
        this.setState({inFocus: true});
        this.notifyInFocus(this.id);
    }

    handleOffFocus() {
        this.setState({inFocus: false});
    }

    render() {
        return (
            <div className="MarkdownBlock">
                {this.state.inFocus && 
                    <TextareaAutosize
                        value={this.state.text}
                        onChange={this.handleChange}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.handleOnFocus();
                        }}
                    />
                }
                {!this.state.inFocus &&
                    <RenderableMarkdownBlock
                        text={this.state.text}
                        onFocus={this.handleOnFocus}
                    />
                }
            </div>
        )
    }
}