#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'inline-html',
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
    --inline-html
        Accept dangerous inline HTML? Default: false
Examples:
    cat readme.md | build-technical-doc >index.html
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`parse-url v${pkg.version}\n`)
	process.exit(0)
}

const createPipeline = require('.')
const {determineSyntaxStylesheetPath} = createPipeline
const {createMarkdownRenderer} = createPipeline

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

if (argv['syntax-stylesheet']) {
	const {readFileSync} = require('fs')

	const stylesheet = argv['syntax-stylesheet']
	const path = determineSyntaxStylesheetPath(stylesheet)
	const css = readFileSync(path, {encoding: 'utf8'})
	process.stdout.write(css)
	process.exit()
}

const renderer = createMarkdownRenderer({
	syntaxStylesheetUrl: argv['syntax-stylesheet-url'] || './syntax.css',
	changeMdLink: argv['change-md-links'] === 'false'
		? () => false
		: null,
	inlineHtml: !!argv['inline-html'],
})

process.stdin
.once('error', showError)
.pipe(renderer)
.once('error', showError)
.pipe(process.stdout)
.once('error', showError)
