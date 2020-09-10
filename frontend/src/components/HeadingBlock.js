import React, { Component } from 'react';


export default class HeadingBlock extends Component {

    PREFIXES = {
        1: '#',
        2: '##',
        3: '###',
        4: '####',
        5: '#####'
    };

    constructor(props) {
        super(props);

        this.state = {
            text: this.stripPrefix(props.text, props.headingLevel),
            headingLevel: props.headingLevel
        }
    }

    stripPrefix(text, headingLevel) {
        let prefixIndex = text.indexOf(this.PREFIXES[headingLevel]);
        let prefixEnd = prefixIndex + this.PREFIXES[headingLevel].length;
        return text.substring(prefixEnd, text.length);
    }

    renderHeading(text, headingLevel) {
        switch(headingLevel) {
            case 1:
                return (<h1>{text}</h1>)
            case 2:
                return (<h2>{text}</h2>)
            case 3:
                return (<h3>{text}</h3>)
            case 4:
                return (<h4>{text}</h4>)
            default:
                return (<h5>{text}</h5>)
        }
    }

    render() {
        return (
            <div className="HeadingBlock">
                {this.renderHeading(this.state.text, this.state.headingLevel)}
            </div>
        )
    }
}