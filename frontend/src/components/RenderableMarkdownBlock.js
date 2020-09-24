import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import PlainTextBlock from './PlainTextBlock.js';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes.js';
import HeadingBlock from './HeadingBlock';
import UnorderedListBlock from './UnorderedListBlock';


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
        if (text.startsWith('-')) {
            return MarkdownBlockTypes.UNORDERED_LIST;
        }
        if (text.startsWith('1.')) {
            return MarkdownBlockTypes.ORDERED_LIST;
        }

        return MarkdownBlockTypes.PLAIN_TEXT;
    }
    
    interpretAndRender() {
        let blockType = this.interpretBlockType(this.state.text);

        switch (blockType) {
            case MarkdownBlockTypes.H1:
                return (<HeadingBlock text={this.state.text} headingLevel={1}/>)
            case MarkdownBlockTypes.H2:
                return (<HeadingBlock text={this.state.text} headingLevel={2}/>)
            case MarkdownBlockTypes.H3:
                return (<HeadingBlock text={this.state.text} headingLevel={3}/>)
            case MarkdownBlockTypes.H4:
                return (<HeadingBlock text={this.state.text} headingLevel={4}/>)
            case MarkdownBlockTypes.H5:
                return (<HeadingBlock text={this.state.text} headingLevel={5}/>)
            case MarkdownBlockTypes.UNORDERED_LIST:
                return (<UnorderedListBlock text={this.state.text}/>)
            default:
                return (<PlainTextBlock text={this.state.text}/>)
        }
    }

    render() {
        return (
            <div className="RenderableMarkdownBlock"
                onClick={(e) => {this.handleFocus(e)}}>
                {this.interpretAndRender()}
            </div>
        )
    }
}
