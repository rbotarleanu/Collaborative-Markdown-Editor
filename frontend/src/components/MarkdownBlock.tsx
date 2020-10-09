import React from 'react';
import '../styles/MarkdownBlock.css';
import TextareaAutosize from 'react-textarea-autosize';
import RenderableMarkdownBlock from './RenderableMarkdownBlock';

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';


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
    switchFocusToNextBlock: (id: number, reverse?: boolean) => void
};

export default class MarkdownBlock extends React.Component<Props, State> {

    private notifyInFocus: (id: number) => void;
    private switchFocusToNextBlock: (id: number, reverse?: boolean) => void;
    private updateBlockInfo: updateBlockInfoFn;
    private id: number;
    private textAreaRef: typeof ContentEditable | null;
    private _isMounted: boolean = false;
    private HOTKEY_DELTA = 2000;
    private textAreaInnerRef: React.RefObject<HTMLElement>;

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
        this.textAreaInnerRef = React.createRef();
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

    handleChange(e: ContentEditableEvent) {
        if (!e.target) {
            return;
        }

        // We don't need to update the block info here since a selection event
        // is also triggered.
        this.setState({ text: e.target.value });
    }

    public handleOnFocus(cursorPosition: number = 0) {
        this.notifyInFocus(this.id);
        this.setState({ inFocus: true });
        cursorPosition = cursorPosition >= 0 ? cursorPosition : this.state.text.length;
        requestAnimationFrame(() => {
            if (this.textAreaRef) {
                if (this.textAreaInnerRef.current && this.textAreaInnerRef.current.firstChild) {
                    this.textAreaInnerRef.current.focus();
                    let range = document.createRange();
                    range.setStart(this.textAreaInnerRef.current.firstChild, cursorPosition);
                    range.setEnd(this.textAreaInnerRef.current.firstChild, cursorPosition);
                    window.getSelection()?.removeAllRanges();
                    window.getSelection()?.addRange(range);
                }
            }
        });
    }

    private getEditableSelectionRange(): {selectionStart: number, selectionEnd: number} {
        let selection = window.getSelection();
        let selectionStart = 0;
        let selectionEnd = 0;

        if (selection !== null) {
            selectionStart = selection.anchorOffset;
            selectionEnd = selection.focusOffset;
        }
        
        return {
            selectionStart: selectionStart,
            selectionEnd: selectionEnd
        };
    }

    private handleSelect(e: React.SyntheticEvent) {
        let selectionRange = this.getEditableSelectionRange();
        this.updateBlockInfo(
            this.id, this.state.text,
            selectionRange.selectionStart, selectionRange.selectionEnd);
    }

    public handleOffFocus() {
        if (this._isMounted) {
            this.setState({ inFocus: false });
        }
    }

    private handleEditorKeyPress(e: React.KeyboardEvent) {
        let newState = {...this.state};
        newState.lastKeyPressTime = e.timeStamp;
        newState.lastKeyPressed = e.key;
        switch(e.key) {
            case "Escape":
                newState.inFocus = false;
                break;
            case "Enter":
                // Since we are monitoring key up events events in shift+enter
                // the enter key up event happens first
                if (this.state.lastKeyPressed === 'Shift' &&
                    e.timeStamp - this.state.lastKeyPressTime < this.HOTKEY_DELTA) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id);
                }
                break;
            case 'ArrowRight':
                var selectionRange = this.getEditableSelectionRange();
                if (selectionRange.selectionEnd === this.state.text.length) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id);
                }
                break;
            case 'ArrowLeft':
                var selectionRange = this.getEditableSelectionRange();
                if (selectionRange.selectionStart === 0) {
                    newState.inFocus = false;
                    this.switchFocusToNextBlock(this.id, true);
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
                    <ContentEditable
                        html={this.state.text}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!this.state.inFocus) {
                                this.handleOnFocus();
                            }
                        }}
                        onChange={(e) => {this.handleChange(e);}}
                        onSelect={(e) => {this.handleSelect(e);}}
                        onKeyDown={(e) => {this.handleEditorKeyPress(e);}}
                        ref={(ref: any) => this.textAreaRef=ref as typeof ContentEditable}
                        innerRef={this.textAreaInnerRef}
                    />
                    // <EditableTextDisplay
                    //     text={this.state.text}
                    //     onClick={(e) => {
                    //         e.preventDefault();
                    //         e.stopPropagation();

                    //         if (!this.state.inFocus) {
                    //             this.handleOnFocus();
                    //         }
                    //     }}
                        // value={this.state.text}
                        // onChange={(e) => {this.handleChange(e);}}
                        // onSelect={(e) => {this.handleSelect(e);}}
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     e.stopPropagation();

                        //     if (!this.state.inFocus) {
                        //         this.handleOnFocus();
                        //     }
                        // }}
                    // />
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