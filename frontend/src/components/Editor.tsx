import React from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarkdownBlock from './MarkdownBlock';
import { interpretBlockType } from '../utils/MarkdownBlockMatching';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes';
import { request } from 'https';

interface Props {
    text: string
};

interface State {
    paragraphs: Array<string>,
    cursors: {
        [user: string]: {
            block: number,
            selection: {
                start: number,
                end: number
            }
        }
    },
    selectedFile: File | null
};

class TextBlock {
    text: string;
    blockType: number;

    constructor(text: string, blockType: number) {
        this.text = text;
        this.blockType = blockType;
    }
};


export default class Editor extends React.Component<Props, State> {

    private blockRefs: { [ref: number]: MarkdownBlock };
    private DUMMY_BLOCK = "Click here to edit...";

    constructor(props: Props) {
        super(props);
        var documentBlocks = this.splitDocumentIntoBlocks(props.text);
        documentBlocks.push(this.DUMMY_BLOCK);

        this.state = {
            paragraphs: documentBlocks,
            cursors: { self: {block: -1, selection: {start: -1, end: -1 } } },
            selectedFile: null
        };

        this.blockRefs = {};
    }

    private splitDocumentIntoBlocks(doc: string): Array<string> {
        var newlineBlocks: Array<TextBlock> = [];
        var mergedBlocks: Array<string> = [];
        
        doc.split('\n').forEach((block) => {
            if (block.trim().length === 0) {
                return;
            }

            let blockType = interpretBlockType(block);
            newlineBlocks.push(new TextBlock(block, blockType));
        });

        // If possible, try to merge consecutive blocks of these types
        let mergeableBlockTypes: Array<number> = [
            MarkdownBlockTypes.PLAIN_TEXT,
            MarkdownBlockTypes.ORDERED_LIST,
            MarkdownBlockTypes.UNORDERED_LIST,
            MarkdownBlockTypes.TABLE
        ];
        for (var i = 0; i < newlineBlocks.length; ++i) {
            if (mergeableBlockTypes.indexOf(newlineBlocks[i].blockType) === -1) {
                mergedBlocks.push(newlineBlocks[i].text);
                continue;
            }
            
            if (i === 0 || newlineBlocks[i - 1].blockType !== newlineBlocks[i].blockType) {
                mergedBlocks.push(newlineBlocks[i].text);
            } else {
                mergedBlocks[mergedBlocks.length - 1] += '\n' + newlineBlocks[i].text;
            }
        }

        return mergedBlocks;
    }

    private cleanUpParagraphs(paragraphs: Array<string>, focusedBlockIdx: number): Array<string> {
        // Remove empty blocks
        paragraphs = paragraphs.filter(
            (block) => block.trim().length !== 0);

        // If there is more than 1 dummy block near the end, we remove redundant ones
        var numDummyBlocks = 0;
        for (var i = paragraphs.length - 1; i >= 0; --i) {
            if (paragraphs[i] !== this.DUMMY_BLOCK) {
                break;
            }

            numDummyBlocks += 1;
        }
        if (numDummyBlocks > 0) {
            paragraphs.splice(
                paragraphs.length - numDummyBlocks,
                numDummyBlocks);
        }

        // A single dummy block is always shown at the end of the document
        paragraphs.push(this.DUMMY_BLOCK);

        return paragraphs;
    }

    public handleSwitchToNextFocusBlock(currentBlockIdx: number, reverse: boolean = false): void {
        var newState = {...this.state};
        newState.paragraphs = this.cleanUpParagraphs(newState.paragraphs,
                                                     currentBlockIdx);
        let nextBlock = currentBlockIdx + (reverse ? -1 : 1);
        let cursorPos = reverse ? -1 : 0;

        this.setState(newState);
        requestAnimationFrame(() => {
            if (this.blockRefs[nextBlock]) {
                this.blockRefs[nextBlock].handleOnFocus(cursorPos);
            }
        });
    }

    public handleBlockFocus(focusedBlockIdx: number): void {
        Object.keys(this.blockRefs).forEach((idx: string) => {
            let idxToNum = parseInt(idx);
            if (idxToNum === focusedBlockIdx) {
                return;
            }

            if (this.blockRefs && this.blockRefs[idxToNum]) {
                this.blockRefs[idxToNum].handleOffFocus();
            }
        });

        var newState = {...this.state};
        newState.paragraphs = this.cleanUpParagraphs(newState.paragraphs, focusedBlockIdx);

        newState.cursors.self = {
            block: focusedBlockIdx,
            selection: {start: -1, end: -1}
        };
    
        this.setState(newState);
    }

    public updateBlockInformation(blockId: number, text: string,
                                  selectionStart: number,
                                  selectionEnd: number): void {
        var newState = this.state;
        newState.paragraphs[blockId] = text;
        newState.cursors.self = {
            block: blockId,
            selection: {
                start: selectionStart,
                end: selectionEnd
            }
        };
        this.setState(newState);
    }

    private onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target || !e.target.files || e.target.files.length === 0) {
            return;
        }

        this.setState({
            selectedFile: e.target.files[0]
        });
    }

   render() {
        return (
            <div className="Editor" id="editor"
                    onClick={(e) => { this.handleBlockFocus(-1); }}>
                <div className="TextBlocks">
                    {
                        this.state.paragraphs.map((paragraph, idx) => {
                            return (
                                <MarkdownBlock
                                    text={paragraph}
                                    id={idx}
                                    key={idx}
                                    notifyFocus={(id: number) => this.handleBlockFocus(id)}
                                    switchFocusToNextBlock={(id: number, reverse: boolean = false) =>
                                        this.handleSwitchToNextFocusBlock(id, reverse)}
                                    updateBlockInfo={
                                        (blockId: number, text: string, selectionStart: number, selectionEnd: number) =>
                                        this.updateBlockInformation(blockId, text, selectionStart, selectionEnd)
                                    }
                                    ref={(ref) => {
                                        if (ref) {
                                            this.blockRefs[idx]=ref
                                        }
                                    }}
                                /> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}