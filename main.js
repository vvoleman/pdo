import fs from "fs";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-table-of-contents";

var md = new MarkdownIt();

function readFileContent(file) {
    return fs.readFileSync(file, "utf8");
}

function saveFileContent(file, content) {
    return fs.writeFileSync(file, content, "utf8");
}

// Get first parameter from command line
var file = process.argv[2];


// If no parameter is given, exit
if (!file) {
    console.error("No file given");
    process.exit(1);
}

// If file does not exist, exit
if (!fs.existsSync(file)) {
    console.error("File does not exist");
    process.exit(1);
}

const content = readFileContent(file);

// Remove .md from it
file = file.replace(".md", "");

md.use(markdownItAnchor.default);
md.use(markdownItToc, {"includeLevel": [2,3,4]});

let rendered = md.render(content);

// Prepend string to rendered
const link = `<link rel="stylesheet" href="../css/hyper.css">`
rendered = link + rendered;

saveFileContent(`render/${file}.html`, rendered);

// md.use(require("markdown-it-anchor").default); // Optional, but makes sense as you really want to link to something, see info about recommended plugins below
// md.use(require("markdown-it-table-of-contents"));