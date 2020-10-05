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
            match: /\*\*([^*]*)\*\*/g,
            replace: "<b>$1</b>"
        },
        italic: {
            match: /\*([^*]*)\*/g,
            replace: "<i>$1</i>"
        },
        href: {
            match: /\[(.*)]\((.*)\)/g,
            replace: "<a href=\"$2\">$1</a>"
        },
        underscore: {
            match: /_([^*]*)_/g,
            replace: "<u>$1</u>"
        },
        strikethrough: {
            match: /~~([^*]*)~~/g,
            replace: "<del>$1</del>"
        }
    };

    formatText(text: string): string {
        for (var format in this.FORMATTING_BLOCKS) {
            let regex = this.FORMATTING_BLOCKS[format].match;
            let replace = this.FORMATTING_BLOCKS[format].replace;
            text = text.replace(regex, replace);
        }

        return text;
    }

    constructor(props: Props) {
        super(props);
        

        this.state = {
            text: this.formatText(props.text)
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({text: this.formatText(this.props.text)});
        }
    }

    render() {
        return (
            <span>
                {parse(this.state.text)}
            </span>
        )
    }
}