import React from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarkdownBlock from './MarkdownBlock';

interface Props {};
interface State {
    editor: { paragraphs: Array<string> },
    cursors: { }
};


export default class Editor extends React.Component<Props, State> {

    private blockRefs: { [ref: number]: MarkdownBlock };

    constructor(props: Props) {
        super(props);
        this.state = {
            editor: {
                paragraphs: [
                    "#Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "##Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "### Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    " #### Nam quis hendrerit sem, eu vestibulum nibh.",
                    "##### Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "- Hello\n+*level* 2 \n+level 2 again \n*level 3\n*level 3 **again**\n*level 3 thrice is here\n- how are you doing\n+amazing \n+amazing again\n+amazing thrice\n*level 3 dup\n*level 3 dupdup\n* level3 dupdupdup\n- very well, thank you",
                    "1. First\na)This is Ab)This *is* Bi.1stii.second2. second3. **third**.\n",
                    "This is [a link](https://www.google.com) to Google",
                    "|Col1|Col2|Col3|Col4|\n|V11|V12|V13|V14|\n|V21|v22|v23|v24|",
                    "![https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/1280px-Markdown-mark.svg.png](Markdown logo)",
                    "$\\frac{1}{2}=0.5$",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Sed eget velit ut risus mattis sollicitudin. Cras placerat tortor id consequat vulputate."
                ]
            },
            cursors: {}
        };
        
        this.blockRefs = {};
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