import React from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';
import RenderableMarkdownBlock from './RenderableMarkdownBlock';

interface State {
    text: string,
    inFocus: boolean,
    cursorPos: {x: number, y: number}
};

interface Props {
    text: string,
    id: number,
    notifyFocus: (id: number) => void
};

export default class MarkdownBlock extends React.Component<Props, State> {

    private notifyInFocus: (id: number) => void;
    private id: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false,
            cursorPos: {x: 0, y: 0},
        };

        this.notifyInFocus = props.notifyFocus;
        this.id = props.id;
    }

    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (!e.target) {
            return;
        }

        this.setState({ text: e.target.value });
    }

    private handleOnFocus() {
        this.notifyInFocus(this.id);
        this.setState({inFocus: true});
    }

    public handleOffFocus() {
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
                    />
                }
                {!this.state.inFocus &&
                    <RenderableMarkdownBlock
                        text={this.state.text}
                        onFocus={() => this.handleOnFocus()}
                    />
                }
            </div>
        )
    }
}