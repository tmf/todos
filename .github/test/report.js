#!/usr/local/bin/node

const { get } = require('https')
const { writeFile, readFile } = require('fs/promises');

const fetch = async url => new Promise(resolve => get(url, response => {
    let content = ''
    response.on('data', chunk => content += chunk);
    response.on('end', () => resolve(content));
}));

(async ([input, output, host = "localhost"]) => {
    const content = await readFile(input);
    const coverage = JSON.parse(new TextDecoder().decode(content))

    const files = await Promise.all(coverage.map(async entry => {
        let result = `<file path="${entry.url.replace("https://localhost/todos", "docs")}">`
        const content = await fetch(entry.url.replace("localhost", host))
        const whichLine = offset => content.substring(0, offset).split("\n").length;
        
        for (fn of entry.functions) {
            if (fn.functionName === "" && fn.ranges[0].startOffset === 0) continue;
            
            for (range of fn.ranges) {
                const start = whichLine(range.startOffset), end = whichLine(range.endOffset)
                for (let line = start; line < end; line++) {
                    result += `<lineToCover lineNumber="${line}" covered="${range.count > 0}"/>`
                }
            }
        }

        result += `</file>`
        return result;
    }))

    await writeFile(output, `<coverage version="1">${files}</coverage>`)
})(process.argv.slice(2))
