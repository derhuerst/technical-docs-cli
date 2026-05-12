import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'
import slug from 'rehype-slug'
import link from 'rehype-autolink-headings'
import highlight from 'rehype-highlight'
import bash from 'highlight.js/lib/languages/bash'
import html from 'rehype-stringify'
import stream from 'unified-stream'
import {changeMdLinks} from './lib/change-md-links.js'
import {asHTMLDocument} from './lib/as-html-doc.js'

const createPipeline = (cfg) => {
	const {
		changeMdLink,
		inlineHtml,
	} = cfg

	return unified()
	.use(markdown)
	.use(changeMdLinks, {
		changeMdLink,
	})
	.use(remark2rehype, {allowDangerousHtml: inlineHtml})
	.use(raw)
	.use(slug)
	.use(link, {
		behaviour: 'append',
		properties: {
			class: 'heading-anchor',
			'aria-label': 'link to the heading itself',
			'aria-hidden': 'true',
		},
		content: {type: 'text', value: '🔗'},
	})
	.use(highlight, {
		languages: Object.assign(Object.create(null), {
			'shell': bash,
		}),
	})
	.use(asHTMLDocument, cfg)
	.use(html)
}

const createMarkdownRenderer = (opt = {}) => {
	const pipeline = createPipeline(opt)
	return stream(pipeline)
}

// todo: make async
const determineSyntaxStylesheetPath = (name) => {
	const url = import.meta.resolve(`highlight.js/styles/${name}.css`)
	return new URL(url).pathname
}

export {
	createPipeline,
	createMarkdownRenderer,
	determineSyntaxStylesheetPath,
}
