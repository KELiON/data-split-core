[![Build Status](https://travis-ci.org/KELiON/data-split-core.svg)](https://travis-ci.org/KELiON/data-split-core)
### About
[PostCSS](https://github.com/postcss/postcss) postprocessor for moving big base64 inlines to separate css file.


### API

`DataSplit` supports two options:
* `minLength` minimum size of inlined block that will be moved to separate file. Defaut is 0 (all inlines are moved);
* `dataRegexp` – regular expression to find inlines. Default is `/url\(('|")?data/g`

#### Example

    var DataSplit = require('data-split')
    splitter = new DataSplit();
    var result = splitter.process(cssString);
    // New css with all inlines
    console.log(result.inlines.toString());
    // Your css without inlines
    console.log(result.target.toString());
