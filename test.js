'use strict'

const {ok} = require('assert')
const createPipeline = require('.')

const failWithError = (err) => {
	console.error(err)
	process.exit(1)
}

const t1 = `\
- [internal relative](/foo/readme.md)
- [external absolute](https://github.com/derhuerst/technical-docs-cli/blob/foo/bar/readme.md)
`

const pipeline = createPipeline({})
pipeline.process(t1, (err, file) => {
	if (err) failWithError(err)

	ok(file.contents.includes(
		'foo/readme.html'
	), 'output does not contain internal relative link')
	ok(file.contents.includes(
		'https://github.com/derhuerst/technical-docs-cli/blob/foo/bar/readme.md'
	), 'output does not contain external absolute link')
})
