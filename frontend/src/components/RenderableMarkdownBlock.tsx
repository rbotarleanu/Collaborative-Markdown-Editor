import React, { Component } from 'react';
import '../styles/MarkdownBlock.css';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes.js';
import PlainTextBlock from './PlainTextBlock';
import HeadingBlock from './HeadingBlock';
import UnorderedListBlock from './UnorderedListBlock';
import OrderedListBlock from './OrderedListBlock';
import TableBlock from './TableBlock';
import ImageBlock from './ImageBlock';
import LatexBlock from './LatexBlock';
import { interpretBlockType } from '../utils/MarkdownBlockMatching';


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

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({ text: this.props.text });
        }
    }

    interpretAndRender(): JSX.Element {
        let blockType = interpretBlockType(this.state.text);
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
            case MarkdownBlockTypes.TABLE:
                return (<TableBlock text={this.state.text}/>)
            case MarkdownBlockTypes.IMAGE:
                return (<ImageBlock text={this.state.text}/>)
            case MarkdownBlockTypes.LATEX:
                return (<LatexBlock text={this.state.text}/>)
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
