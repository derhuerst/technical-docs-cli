import {ok, strictEqual} from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {
	createPipeline,
	createMarkdownRenderer,
	determineSyntaxStylesheetPath,
} from './index.js'

const failWithError = (err) => {
	console.error(err)
	process.exit(1)
}

const render = (rendererCfg, input) => {
	return new Promise((resolve, reject) => {
		const renderer = createMarkdownRenderer(rendererCfg)
		setImmediate(() => {
			renderer.end(input)
		})

		renderer.on('error', reject)
		let res = ''
		renderer.on('data', (chunk) => {
			res += chunk
		})
		renderer.on('end', () => {
			resolve(res)
		})
	})
}

const t1 = `\
- [internal relative](/foo/readme.md)
- [external absolute](https://github.com/derhuerst/technical-docs-cli/blob/foo/bar/readme.md)
`

const t2 = `\
# foo

> [!IMPORTANT]
> bar baz

## hello world

> [!CAUTION]
> don't do this!

> quooote
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

	console.log('pipeline.process() seems to work ✔️')
})

{
	const res = await render({
		syntaxStylesheetUrl: '/foo.csv',
	}, t1)
	{
		ok(res.includes(
			'<link rel="stylesheet" href="/foo.csv"',
		), 'output does not include custom link stylesheet link')

		console.log('renderer Stream seems to work ✔️')
	}
}

{
	const res = await render({}, t2)
	{
		ok(
			res.match(/<blockquote>\s*<p>quooote<\/p>\s*<\/blockquote>/),
			'output does not contain exact HTML string with blockquotes',
		)

		console.log('GitHub-style blockquote alerts seem to work ✔️')
	}
}

{
	const githubCssPath = determineSyntaxStylesheetPath('github')
	strictEqual(typeof githubCssPath, 'string', 'determineSyntaxStylesheetPath() must return a string')
	readFileSync(githubCssPath)
	console.log('syntax stylesheet file exists ✔️')
}
