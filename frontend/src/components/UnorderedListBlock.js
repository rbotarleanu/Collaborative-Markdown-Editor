import React, { Component } from 'react';
import { getNodeText } from '@testing-library/react';


export default class UnorderedListBlock extends Component {

    LEVELS = {
        1: '-',
        2: '+',
        3: '*'
    };

    constructor(props) {
        super(props);

        this.state = {
            text: this.splitIntoLevels(props.text)
        }
    }

    splitIntoLevels(text) {
        var splitText = [];
        text.split(this.LEVELS[1]).forEach((level1) => {
            level1 = level1.trim();
            if (level1.length === 0) {
                return;
            }

            splitText.push(level1);
            // var level1Components = [];

            // level1.split(this.LEVELS[2]).forEach((level2) => {
            //     level2 = level2.trim();
            //     if (level2.length === 0) {
            //         return;
            //     }
            //     var level2Components = [];

            //     level2.split(this.LEVELS[3]).forEach((level3) => {
            //         level2Components.push(level3);      
            //     });

            //     level1Components.push(level2Components);
            // });
            
            // splitText.push(level1Components);
        });

        return splitText;
    }

    renderHeading(text) {
        return (
            <ul>
            {
                text.map((level1ListElement) => {
                    return (<li>{level1ListElement}</li>)
                })
            }
            </ul>
        )
    }

    render() {
        return (
            <div className="UnorderedListBlock">
                {this.renderHeading(this.state.text)}
            </div>
        )
    }
}