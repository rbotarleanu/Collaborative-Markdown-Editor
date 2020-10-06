import React from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';
import RenderableMarkdownBlock from './RenderableMarkdownBlock';


type updateBlockInfoFn = (
    blockId: number, text: string,
    selectionStart: number, selectionEnd: number) => void;

interface State {
    text: string,
    inFocus: boolean,
    cursorPos: {x: number, y: number},
    lastKeyPressed: string,
    lastKeyPressTime: number
};

interface Props {
    text: string,
    id: number,
    notifyFocus: (id: number) => void
    updateBlockInfo: updateBlockInfoFn,
    switchFocusToNextBlock: (id: number) => void
};

export default class MarkdownBlock extends React.Component<Props, State> {

    private notifyInFocus: (id: number) => void;
    private switchFocusToNextBlock: (id: number) => void;
    private updateBlockInfo: updateBlockInfoFn;
    private id: number;
    private textAreaRef: HTMLTextAreaElement | null;
    private _isMounted: boolean = false;
    private HOTKEY_DELTA = 500;

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text,
            inFocus: false,
            cursorPos: {x: 0, y: 0},
            lastKeyPressTime: 0,
            lastKeyPressed: ""
        };

        this.notifyInFocus = props.notifyFocus;
        this.updateBlockInfo = props.updateBlockInfo;
        this.switchFocusToNextBlock = props.switchFocusToNextBlock;
        this.id = props.id;
        this.textAreaRef = null;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.text !== this.props.text) {
            this.setState({ text: this.props.text });
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (!e.target) {
            return;
        }

        // We don't need to update the block info here since a selection event
        // is also triggered.
        this.setState({ text: e.target.value });
    }

    public handleOnFocus() {
        this.notifyInFocus(this.id);
        this.setState({ inFocus: true });
        requestAnimationFrame(() => {
            if (this.textAreaRef) {
                this.textAreaRef.focus();
                this.textAreaRef.setSelectionRange(0, 0);
            }
        });
    }

    private handleSelect(e: React.SyntheticEvent<HTMLTextAreaElement, Event>) {
        let target = e.target as HTMLTextAreaElement;
        this.updateBlockInfo(
            this.id, this.state.text,
            target.selectionStart, target.selectionEnd);
    }

    public handleOffFocus() {
        if (this._isMounted) {
            this.setState({ inFocus: false });
        }
    }

    private handleEditorKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        let newState = {...this.state};
        newState.lastKeyPressTime = e.timeStamp;
        newState.lastKeyPressed = e.key;

        switch(e.key) {
            case "Escape":
                newState.inFocus = false;
                break;
            case "Shift":
                // Since we are monitoring key up events events in shift+enter
                // the enter key up event happens first
                if (this.state.lastKeyPressed === 'Enter' &&
                    e.timeStamp - this.state.lastKeyPressTime < this.HOTKEY_DELTA) {
                    newState.inFocus = false;
                    requestAnimationFrame(() => {
                        this.switchFocusToNextBlock(this.id);
                    });
                }
                break;
            default:
                break;
        }

        this.setState(newState);
    }

    render() {
        return (
            <div className="MarkdownBlock">
                {this.state.inFocus && 
                    <TextareaAutosize
                        value={this.state.text}
                        onChange={(e) => {this.handleChange(e);}}
                        onSelect={(e) => {this.handleSelect(e);}}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!this.state.inFocus) {
                                this.handleOnFocus();
                            }
                        }}
                        onKeyUp={(e) => {this.handleEditorKeyPress(e);}}
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