'use strict'

const {selectAll} = require('unist-util-select')
const {basename, extname} = require('path')
const {parse: parseURL, format: formatURL} = require('url')

const changeMdLinks = (opt = {}) => (tree, file) => {
	const {
		changeMdLink,
	} = opt

	// todo
	const links = selectAll('link[url]', tree)
	for (const link of links) {
		const url = parseURL(link.url, 'http://localhost')
		if (!url.pathname) continue
		const file = basename(url.pathname)
		const ext = extname(file)

		if (!file || ext !== '.md') continue
		if (!changeMdLink(file, link)) continue
		url.pathname = basename(file, ext) + '.html'
		link.url = formatURL(url)
	}
}

module.exports = changeMdLinks
