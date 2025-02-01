import { IOptions } from 'sanitize-html';

export const sanitizeOptions: IOptions = {
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'b', 'i', 'strong', 'em', 'strike', 'u',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'span', 'div'
    ],
    allowedAttributes: {
        'a': ['href', 'target', 'rel', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        '*': ['class', 'id', 'style']
    },
    allowedStyles: {
        '*': {
            'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
            'text-align': [/^left$/, /^right$/, /^center$/],
            'font-size': [/^\d+(?:px|em|%)$/]
        }
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: true,
    transformTags: {
        'a': (tagName, attribs) => {
            if (attribs.href) {
                // Add noopener noreferrer for external links
                return {
                    tagName,
                    attribs: {
                        ...attribs,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    }
                };
            }
            return { tagName, attribs };
        }
    }
};