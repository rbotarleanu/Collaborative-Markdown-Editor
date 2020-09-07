import React, { Component } from 'react';
import '../styles/Editor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarkdownBlock from './MarkdownBlock.js';


export default class Editor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editor: {
                paragraphs: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
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
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at vehicula massa. Aenean ex mauris, lobortis a sapien vel, consequat tempor urna. Nullam mi est, tincidunt et maximus sed, rhoncus quis nisi. Praesent non aliquet ligula, id porta lorem. Pellentesque eget nulla lectus. Nullam vitae odio nec nisl convallis luctus.",
                    "Nam quis hendrerit sem, eu vestibulum nibh.",
                    "Quisque pulvinar neque non sem vestibulum, non ultricies turpis cursus. Praesent ante metus, consectetur in magna sed, vulputate ultrices enim.",
                    "Sed eget velit ut risus mattis sollicitudin. Cras placerat tortor id consequat vulputate."
                ],
                cursors: {

                }
            }
        };
    }

    render() {
        return (
            <div className="Editor" id="editor">
                <div className="TextBlocks">
                    {
                        this.state.editor.paragraphs.map((paragraph, idx) => {
                            return (
                                <MarkdownBlock
                                    text={paragraph}
                                    id={idx}
                                    key={idx}
                                /> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}