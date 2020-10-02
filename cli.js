#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    build-technical-doc [options]
Options:
    --syntax-stylesheet <name>
        Print a syntax highlighting stylesheet from highlight.js.
    --syntax-stylesheet-url
        Link to the syntax highlighting stylesheet. Default: ./syntax.css
    --change-md-links
        Change \`*.md\` links to \`.html\`. Default: true
Examples:
    cat readme.md | build-technical-doc >index.html
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`parse-url v${pkg.version}\n`)
	process.exit(0)
}

const stream = require('unified-stream')
const createPipeline = require('.')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

if (argv['syntax-stylesheet']) {
	const {readFileSync} = require('fs')

	const stylesheet = argv['syntax-stylesheet']
	const path = require.resolve(`highlight.js/styles/${stylesheet}.css`)
	const css = readFileSync(path, {encoding: 'utf8'})
	process.stdout.write(css)
	process.exit()
}

const pipeline = createPipeline({
	syntaxStylesheetUrl: argv['syntax-stylesheet-url'] || './syntax.css',
	changeMdLink: argv['change-md-links'] === 'false'
		? () => false
		: () => true,
})

process.stdin
.once('error', showError)
.pipe(stream(pipeline))
.once('error', showError)
.pipe(process.stdout)
.once('error', showError)
