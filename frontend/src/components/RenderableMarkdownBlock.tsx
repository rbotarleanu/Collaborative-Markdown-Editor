import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes.js';
import PlainTextBlock from './PlainTextBlock';
import HeadingBlock from './HeadingBlock';
import UnorderedListBlock from './UnorderedListBlock';
import HrefBlock from './HrefBlock';
import OrderedListBlock from './OrderedListBlock';
import TableBlock from './TableBlock';


interface State {
    text: string,
    onFocusNotify: Function
};

interface Props {
    onFocus: Function,
    text: string
};


export default class RenderableMarkdownBlock extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            text: props.text,
            onFocusNotify: props.onFocus
        };

    }

    handleFocus(e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.state.onFocusNotify();
    }

    interpretBlockType(text: string): number {
        text = text.trim();

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
        if (text.startsWith('[')) {
            return MarkdownBlockTypes.HREF;
        }
        if (text.startsWith('|')) {
            return MarkdownBlockTypes.TABLE;
        }

        return MarkdownBlockTypes.PLAIN_TEXT;
    }
    
    interpretAndRender(): JSX.Element {
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
            case MarkdownBlockTypes.ORDERED_LIST:
                return (<OrderedListBlock text={this.state.text}/>)
            case MarkdownBlockTypes.HREF:
                return (<HrefBlock text={this.state.text}/>)
            case MarkdownBlockTypes.TABLE:
                return (<TableBlock text={this.state.text}/>)
            default:
                return (<PlainTextBlock text={this.state.text}/>)
        }
    }

    render() {
        return (
            <div className="RenderableMarkdownBlock"
                onClick={(e) => {
                    if (e) {
                        this.handleFocus(e);
                    }
                }}
            >
                {this.interpretAndRender()}
            </div>
        )
    }
}
