
import { MarkdownBlockTypes } from './MarkdownBlockTypes.js';

export function interpretBlockType(block: string): number {
    block = block.trim();

    if (block.startsWith('#####')) {
        return MarkdownBlockTypes.H5;
    }
    if (block.startsWith('####')) {
        return MarkdownBlockTypes.H4;
    }
    if (block.startsWith('###')) {
        return MarkdownBlockTypes.H3;
    }
    if (block.startsWith('##')) {
        return MarkdownBlockTypes.H2;
    }
    if (block.startsWith('#')) {
        return MarkdownBlockTypes.H1;
    }
    if (block.startsWith('-') || block.startsWith('+') || block.startsWith('*')) {
        return MarkdownBlockTypes.UNORDERED_LIST;
    }
    if (block.match(/^\d./) || block.match(/^[a-z]\)/) || block.match(/^[i|v]+\./)) {
        return MarkdownBlockTypes.ORDERED_LIST;
    }
    if (block.startsWith('|')) {
        return MarkdownBlockTypes.TABLE;
    }
    if (block.startsWith('!')) {
        return MarkdownBlockTypes.IMAGE;
    }
    if (block.startsWith('$')) {
        return MarkdownBlockTypes.LATEX;
    }

    return MarkdownBlockTypes.PLAIN_TEXT;
}