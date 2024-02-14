const gulp = require('gulp');
const markdownlint = require('gulp-markdownlint');
const spellcheck = require('gulp-markdown-spellcheck');
const fs = require('fs');
const path = require('path');

// Task for linting Markdown files based on .markdownlint.json
gulp.task('md-lint', (done) => {
    const options = {
        files: sync(['*.md', './docs/**/*.md'], { cwd: process.cwd() }), // Adjusted file paths to include Markdown files in the 'docs' folder
        config: require('.markdownlint.json') // Using the configuration from .markdownlint.json in the root directory
    };
    md(options, (result, err) => {
        if (err && err.toString().length) {
            console.error(err.toString());
            process.exit(1);
        } else {
            console.log('\n*** Markdown Lint Succeeded ***\n');
            done();
        }
    });
});

// Task for checking typos in Markdown files based on .spelling file
const { readFileSync } = require('fs');

gulp.task('typo', (done) => {
    try {
        // Read the contents of the .spelling file
        const spellingContent = readFileSync('./.spelling', 'utf8');

        // Run mdspell command to check spelling in Markdown files of the docs folder
        const mdspellcmd = `npx mdspell docs/**/*.md -r -n -a -x --color --en-us -d . --ignore-acronyms --ignore-numbers --ignore-acronyms --ignore-urls --ignore-emails ${spellingContent}`;
        const output = execSync(mdspellcmd, { stdio: 'inherit' });

        done();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});

// Task for validating filenames
gulp.task('filename', function() {
    const docsPath = 'docs';

    return fs.readdirSync(docsPath).forEach(file => {
        const fileName = path.basename(file);
        const fileNameWithoutExt = fileName.split('.')[0];

        if (fileName !== fileNameWithoutExt.toLowerCase() + '.md') {
            console.error(`Error: Invalid filename detected: ${fileName}`);
            process.exit(1);
        }
    });
});

// Task for validating folder names
gulp.task('foldername', function() {
    const docsPath = 'docs';

    return fs.readdirSync(docsPath).forEach(folder => {
        if (!fs.statSync(path.join(docsPath, folder)).isDirectory()) return;

        if (folder !== folder.toLowerCase()) {
            console.error(`Error: Invalid folder name detected: ${folder}`);
            process.exit(1);
        }
    });
});

// Default task
gulp.task('default', gulp.series('md-lint', 'typo', 'filename', 'foldername'));
