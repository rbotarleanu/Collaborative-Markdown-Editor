import React from 'react';

// @ts-ignore
var parse = require('html-react-parser');

interface Props {
    text: string
};

interface State {
    text: string
};

interface FormatBlock {
    match: RegExp,
    replace: string
};

type FORMATTING_BLOCKS = {
    [format: string]: FormatBlock
};


export default class PlainTextBlock extends React.Component<Props, State> {

    FORMATTING_BLOCKS: FORMATTING_BLOCKS = {
        bold: {
            match: /\*\*([^\*]*)\*\*/g,
            replace: "<b>$1</b>"
        },
        italic: {
            match: /\*([^\*]*)\*/g,
            replace: "<i>$1</i>"
        },
    };

    constructor(props: Props) {
        super(props);
        var text: string = props.text;

        for (var format in this.FORMATTING_BLOCKS) {
            let regex = this.FORMATTING_BLOCKS[format].match;
            let replace = this.FORMATTING_BLOCKS[format].replace;
            text = text.replace(regex, replace);
        }

        this.state = {
            text: text
        };
    }

    render() {
        return (
            <span>
                {parse(this.state.text)}
            </span>
        )
    }
}