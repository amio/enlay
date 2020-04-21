#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Inlay text file with env variables
 *
 * EXAMPLE
 *
 *    "${HOME}" => "/root"
 *
 *    "${NONE_EXIST}" => "${NONE_EXIST}"
 *
 *    "${NONE_EXIST:-default string}" => "default string"
 *
 * USAGE
 *    node enlay.js nginx_template.conf > nginx.conf
 */

const version = require(path.join(__dirname, 'package.json')).version

const help = `
  ${bold('enlay')} (v${version}) - Inlay text file with env variables

  USAGE

     enlay nginx_template.conf > nginx.conf

  INLAY RULES

     "\${HOME}"                         => "/root"
     "\${NONE_EXIST}"                   => "\${NONE_EXIST}"
     "\${NONE_EXIST:-localhost:3000}"   => "localhost:3000"
     "\${NONE_EXIST:-}"                 => ""
`

const [source] = process.argv.slice(2)

if (!source) {
  console.log(help)
  process.exit(1)
}

if (source === '-v') {
  console.log(version)
  process.exit()
}

if (source === '-h') {
  console.log(help)
  process.exit()
}

const cwd = process.cwd()
const sourceFile = path.resolve(cwd, source)

if (!fs.existsSync(sourceFile)) process.exit(2)

const sourceText = fs.readFileSync(sourceFile, 'utf8')

const inlayRegex = /\$\{([\w_]+)(?::-([^}]*))?\}/
const inlayRegexG = new RegExp(RegExp(inlayRegex).source, 'gm')
const inlaidText = sourceText.replace(inlayRegexG, (str) => {
  const [, name, defaultValue] = str.match(inlayRegex)

  const envValue = process.env[name]
  return envValue !== undefined ? envValue : defaultValue || str
})

process.stdout.write(inlaidText)

function bold (str) {
  return `\x1b[1m${str}\x1b[0m`
}
