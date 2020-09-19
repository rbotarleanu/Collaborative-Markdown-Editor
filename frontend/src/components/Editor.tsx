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
                    "- Hello\n- how are you doing\n- very well, thank you\n",
                    "1. First\n2. second\n3. third.\n",
                    "[Click me](www.google.com)",
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