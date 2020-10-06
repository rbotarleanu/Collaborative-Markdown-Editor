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
    updateBlockInfo: (blockId: number, text: string, cursorPosition: number) => void
};

export default class MarkdownBlock extends React.Component<Props, State> {

    private notifyInFocus: (id: number) => void;
    private updateBlockInfo: (blockId: number, text: string, cursorPosition: number) => void;
    private id: number;
    private textAreaRef: HTMLTextAreaElement | null;

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false,
            cursorPos: {x: 0, y: 0}
        };

        this.notifyInFocus = props.notifyFocus;
        this.updateBlockInfo = props.updateBlockInfo;
        this.id = props.id;
        this.textAreaRef = null;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({ text: this.props.text });
        }
    }

    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (!e.target) {
            return;
        }

        this.updateBlockInfo(this.id, e.target.value, e.target.selectionStart);
        this.setState({ text: e.target.value });
    }

    private handleOnFocus() {
        this.notifyInFocus(this.id);
        this.setState({ inFocus: true });
        requestAnimationFrame(() => {
            if (this.textAreaRef) {
                this.textAreaRef.focus();
                this.textAreaRef.setSelectionRange(0, 0);
            }
        });
    }

    public handleOffFocus() {
        this.setState({ inFocus: false });
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

                            if (!this.state.inFocus) {
                                this.handleOnFocus();
                            }
                        }}
                        ref={(ref) => this.textAreaRef=ref}
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