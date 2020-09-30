import React from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarkdownBlock from './MarkdownBlock';
import { interpretBlockType } from '../utils/MarkdownBlockMatching';
import { MarkdownBlockTypes } from '../utils/MarkdownBlockTypes';
import { sampleText } from '../utils/SampleText.js';
import axios from 'axios';

interface Props {
    text: string
};

interface State {
    editor: { paragraphs: Array<string> },
    cursors: { },
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

    constructor(props: Props) {
        super(props);
        this.state = {
            editor: {
                paragraphs: this.splitDocumentIntoBlocks(props.text)
            },
            cursors: {},
            selectedFile: null
        };
        
        this.blockRefs = {};
    }

    private splitDocumentIntoBlocks(doc: string): Array<string> {
        var newlineBlocks: Array<TextBlock> = [];
        var mergedBlocks: Array<string> = [];
        
        doc.split('\n').forEach((block) => {
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

    public handleBlockFocus(focusedBlockIdx: number): void {
        Object.keys(this.blockRefs).forEach((idx: string) => {
            let idxToNum = parseInt(idx);
            if (idxToNum === focusedBlockIdx) {
                return;
            }
            
            this.blockRefs[idxToNum].handleOffFocus();
        })
    }

    private onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target || !e.target.files || e.target.files.length == 0) {
            return;
        }

        this.setState({
            selectedFile: e.target.files[0]
        });
    }

   render() {
        return (
            <div className="Editor" id="editor"
                    onClick={(e) => {this.handleBlockFocus(-1)}}>
                <div className="TextBlocks">
                    {
                        this.state.editor.paragraphs.map((paragraph, idx) => {
                            return (
                                <MarkdownBlock
                                    text={paragraph}
                                    id={idx}
                                    key={idx}
                                    notifyFocus={(id: number) => this.handleBlockFocus(id)}
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