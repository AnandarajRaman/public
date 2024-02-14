const gulp = require('gulp');
const markdownlint = require('gulp-markdownlint');
const spellcheck = require('gulp-markdown-spellcheck');
const fs = require('fs');
const path = require('path');

// Task for linting Markdown files based on .markdownlint.json
gulp.task('md-lint', function() {
    return gulp.src('.markdownlint.json')
        .pipe(markdownlint());
});

// Task for checking typos in Markdown files based on .spelling file
gulp.task('typo', function() {
    return gulp.src('.spelling')
        .pipe(spellcheck());
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
