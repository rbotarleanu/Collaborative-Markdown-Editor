import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import PlainTextBlock from './PlainTextBlock.js';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes.js';


export default class RenderableMarkdownBlock extends Component {

    constructor(props) {
        super(props);

        this.onFocusNotify = props.onFocus;

        this.state = {
            text: props.text
        };

        this.handleFocus = this.handleFocus.bind(this);
    }

    handleFocus(e) {
        e.preventDefault();
        e.stopPropagation();
        this.onFocusNotify();
    }

    interpretBlockType(text) {
        if (text.startsWith('#####')) {
            return MarkdownBlockTypes.H5;
        }
        if (text.startsWith('####')) {
            return MarkdownBlockTypes.H4;
        }
        if (text.startsWith('###')) {
            return MarkdownBlockTypes.H3;
        }
        if (text.startsWith('##')) {
            return MarkdownBlockTypes.H2;
        }
        if (text.startsWith('#')) {
            return MarkdownBlockTypes.H1;
        }

        return MarkdownBlockTypes.PLAIN_TEXT;
    }
    
    interpretAndRender() {
        let blockType = this.interpretBlockType(this.state.text);

        switch (blockType) {
            default:
                return (<PlainTextBlock text={this.state.text}/>)
        }
    }

    render() {
        return (
            <div className="RenderableMarkdownBlock" onClick={(e) => {this.handleFocus(e)}}>
                {this.interpretAndRender()}
            </div>
        )
    }
}
