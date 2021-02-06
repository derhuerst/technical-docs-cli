'use strict'

const {selectAll} = require('unist-util-select')
const {dirname, basename, extname, join} = require('path')
const {parse: parseURL, format: formatURL} = require('url')

const defaultChangeMdLink = (file, link) => {
	const url = parseURL(link.url, 'http://localhost')
	return !url.host // don't convert external links
}

const changeMdLinks = (opt = {}) => (tree, file) => {
	const changeMdLink = opt.changeMdLink || defaultChangeMdLink

	const links = selectAll('link[url]', tree)
	for (const link of links) {
		const url = parseURL(link.url, 'http://localhost')
		if (!url.pathname) continue
		const dir = dirname(url.pathname)
		const file = basename(url.pathname)
		const ext = extname(file)

		if (!file || ext !== '.md') continue
		if (!changeMdLink(file, link)) continue
		url.pathname = join(dir, basename(file, ext) + '.html')
		link.url = formatURL(url)
	}
}

module.exports = changeMdLinks
