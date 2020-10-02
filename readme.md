# @derhuerst/technical-docs-cli

**Render technical markdown docs as HTML.** Opinionated.

[![npm version](https://img.shields.io/npm/v/@derhuerst/technical-docs-cli.svg)](https://www.npmjs.com/package/@derhuerst/technical-docs-cli)
[![build status](https://api.travis-ci.org/derhuerst/@derhuerst/technical-docs-cli.svg?branch=master)](https://travis-ci.org/derhuerst/@derhuerst/technical-docs-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/@derhuerst/technical-docs-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/@derhuerst/technical-docs-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installation

```shell
npm install @derhuerst/technical-docs-cli
```


## Usage

```
Usage:
    build-technical-doc [options]
Options:
    --syntax-stylesheet <name>
        Print a syntax highlighting stylesheet from highlight.js.
    --syntax-stylesheet-url
        Link to the syntax highlighting stylesheet. Default: ./syntax.css
    --change-md-links
        Change `*.md` links to `.html`. Default: true
Examples:
    cat readme.md | build-technical-doc >index.html
```
