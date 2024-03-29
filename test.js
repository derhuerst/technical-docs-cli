'use strict'

const {ok, strictEqual} = require('assert')
const {readFileSync} = require('fs')
const createPipeline = require('.')
const {createMarkdownRenderer} = createPipeline
const {determineSyntaxStylesheetPath} = createPipeline

const failWithError = (err) => {
	console.error(err)
	process.exit(1)
}

const t1 = `\
- [internal relative](/foo/readme.md)
- [external absolute](https://github.com/derhuerst/technical-docs-cli/blob/foo/bar/readme.md)
`

const pipeline = createPipeline({
	additionalHeadChildren: (h) => [
		h('meta', {property: 'foo', content: 'bar'}),
	],
})
pipeline.process(t1, (err, file) => {
	if (err) failWithError(err)

	ok(file.contents.includes(
		'<meta property="foo" content="bar">',
	), 'output does not include custom element in <head>')
	ok(file.contents.includes(
		'foo/readme.html'
	), 'output does not contain internal relative link')
	ok(file.contents.includes(
		'https://github.com/derhuerst/technical-docs-cli/blob/foo/bar/readme.md'
	), 'output does not contain external absolute link')
})

{
	const renderer = createMarkdownRenderer({
		additionalHeadChildren: (h) => [
			h('meta', {property: 'foo', content: 'bar'}),
		],
	})
	renderer.end(t1)

	renderer.once('error', failWithError)
	let res = ''
	renderer.on('data', (chunk) => {
		res += chunk
	})
	renderer.once('end', () => {
		console.error('res', res) // todo: remove
		ok(res.includes(
			'<link rel="stylesheet" href="/foo.csv"',
		), 'output does not include custom link stylesheet link')
	})
}

{
	const githubCssPath = determineSyntaxStylesheetPath('github')
	strictEqual(typeof githubCssPath, 'string', 'determineSyntaxStylesheetPath() must return a string')
	readFileSync(githubCssPath)
}
