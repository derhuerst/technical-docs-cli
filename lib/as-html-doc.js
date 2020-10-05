'use strict'

const toText = require('hast-util-to-text')
const {select} = require('hast-util-select')
const h = require('hastscript')
const u = require('unist-builder')

// from https://github.com/public-transport/transport.rest/blob/a81a2ea9642406a57e20283608bbafda10061b6a/index.html#L16-L75
const CSS = `\
body {
	margin: 1rem auto;
	padding: 0 1rem;
	max-width: 45rem;
	background-color: #fff;
	/* https://css-tricks.com/system-fonts-svg/ */
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
	font-size: 105%;
	line-height: 1.55;
	color: #222;
}
@media screen and (max-width: 60rem) {
	body {
		font-size: 100%;
	}
}
@media screen and (max-width: 40rem) {
	body {
		font-size: 95%;
	}
}

h1, h2, h3, p {
	margin: 1rem 0;
}

h1 {
	font-size: 180%;
	font-weight: 600;
}
h2 {
	font-size: 140%;
	font-weight: 600;
}
h3 {
	font-size: 130%;
	font-weight: 400;
}
hgroup h1, hgroup h2 {
	margin: .5rem 0;
}

a, a code {
	text-decoration: none;
	color: #006eff;
}
a:hover {
	text-decoration: underline;
	color: #009cff;
}
a code {
	color: inherit;
}

code, pre {
	padding: .05em .2em;
	background-color: #f8f8f8;
	border: 1px solid #ddd;
	border-radius: .15em;
	/* https://www.client9.com/css-system-font-stack-monospace-v2/ */
	font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
	font-size: 95%;
	color: #111;
}
pre {
	padding: .25em .3em;
	font-size: 90%;
	text-align: left;
	line-height: 1.4;
	overflow-x: scroll;
}
pre code {
	padding: 0;
	background-color: unset;
	border: none;
	border-radius: 0;
	font-size: inherit;
}

h1 .heading-anchor,
h2 .heading-anchor,
h3 .heading-anchor,
h4 .heading-anchor {
	display: none;
	margin-left: .4em;
	font-size: 60%;
	vertical-align: middle;
}
h1:hover .heading-anchor, h1:focus .heading-anchor,
h2:hover .heading-anchor, h2:focus .heading-anchor,
h3:hover .heading-anchor, h3:focus .heading-anchor,
h4:hover .heading-anchor, h4:focus .heading-anchor {
	display: unset;
	text-decoration: none;
}
`

const newline = () => u('text', '\n')
const withNewlines = els => els.flatMap(el => [el, newline()])

// inpired by https://github.com/rehypejs/rehype-document/blob/6446b7cb933b2cb7c751e3902b9644351e82ee58/index.js
const asHTMLDocument = (cfg = {}) => (tree, file) => {
	const {
		syntaxStylesheetUrl,
		defaultTitle,
		author,
	} = cfg

	const h1 = select('h1', tree)
	const title = h1 && toText(h1) || defaultTitle
	const body = tree.type === 'root' ? [...tree.children] : [tree]

	return u('root', withNewlines([
		u('doctype', {name: 'HTML'}),
		h('html', {
			// todo: make configurable?
			lang: 'en',
			dir: 'lrt',
		}, withNewlines([
			h('head', withNewlines([
				h('meta', {charset: 'utf-8'}),
				h('title', title),
				h('meta', {property: 'og:title', content: title}),
				h('meta', {property: 'twitter:title', content: title}),
				h('meta', {name: 'author', content: author}),
				h('meta', {
					name: 'viewport',
					content: 'width=device-width,initial-scale=1',
				}),
				h('link', {
					rel: 'stylesheet',
					href: syntaxStylesheetUrl,
				}),
				h('style', CSS),
			])),
			h('body', withNewlines(body)),
		])),
	]))
}

module.exports = asHTMLDocument
