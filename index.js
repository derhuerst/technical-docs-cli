'use strict'

const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const slug = require('rehype-slug')
const link = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const bash = require('highlight.js/lib/languages/bash')
const html = require('rehype-stringify')
const changeMdLinks = require('./lib/change-md-links')
const asHTMLDocument = require('./lib/as-html-doc')

const createPipeline = (cfg) => {
	const {
		syntaxStylesheetUrl,
		changeMdLink,
	} = cfg

	return unified()
	.use(markdown)
	.use(changeMdLinks, {
		changeMdLink,
	})
	.use(remark2rehype)
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
	.use(asHTMLDocument, {
		syntaxStylesheetUrl,
	})
	.use(html)
}

module.exports = createPipeline
