import React from 'react';
import 'katex/dist/katex.min.css';

// react-latex doesn't have @types: https://github.com/zzish/react-latex/issues/23
// @ts-ignore
var Latex = require('react-latex');


interface Props {
    text: string
};

interface State {
    text: string
};

export default class LatexBlock extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            text: props.text
        };
    }

    render() {
        return (
            <Latex>{this.state.text}</Latex>
        )
    }
}