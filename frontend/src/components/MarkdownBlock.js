import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';
import RenderableMarkdownBlock from './RenderableMarkdownBlock.js';

export default class MarkdownBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false,
            cursorPos: {x: 0, y: 0}
        };
        this.id = props.id;

        this.textAreaRef = null;

        this.notifyInFocus = props.notifyFocus;
        this.handleChange = this.handleChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOffFocus = this.handleOffFocus.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleOnFocus() {
        this.notifyInFocus(this.id);
        this.setState({inFocus: true});
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
                        onChange={(e) => {this.handleChange(e);}}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.handleOnFocus();
                        }}
                        ref={ref => this.textAreaRef=ref}
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