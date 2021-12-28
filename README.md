# Markdown Changelog reader

## Functionality:

### Format description

The class reads a Markdown file and extracts the changelog entries.
The Markdown file is expected to be formatted as follows:
- The first line of the file is the title of the changelog and has to be "# CHANGELOG".
- New Changelogs entries begin with a title which out to have the format: "## [Title]"
- Next comes the date which out to have the format: "### [Date]" and the Date has to be in the format: "YYYY-MM-DD"
- Next multiple features can come. Each consists of at least:
  - A title which out to have the format: "#### [Title]"
  - A description line which out to have the format: "[Description]"
  - The first description can be followed by multiple lines which out to have the format: "[Description]"
- The Next Changelog entry again begins with a title which out to have the format: "## [Title]"

### Example:

```markdown
# CHANGELOGS

## Changelog Title - Version 2.00

### 2021-12-20

#### Feature Title 1

Text describing the feature 1 Line 1
Text describing the feature 1 Line 2
Text describing the feature 1  Line 3

#### Feature Title 2

Text describing the feature 2

## Changelog Title - Version 1.00

### 2021-10-10

#### Feature Title 1

Text describing the feature 1

#### Feature Title 2

Text describing the feature 2
```

=>

```javascript
  const expectedChangeLogs: ChangeLog[] = [
    new ChangeLog(
      'Changelog Title - Version 2.00',
      new Date('2021-12-20'),
      [
        new Feature('Feature Title 1',
          ['Text describing the feature 1 Line 1',
            'Text describing the feature 1 Line 2',
            'Text describing the feature 1  Line 3']
        ),
        new Feature(
          'Feature Title 2',
          ['Text describing the feature 2']
        )
      ]),
    new ChangeLog(
      'Changelog Title - Version 1.00',
      new Date('2021-10-10'),
      [
        new Feature(
        'Feature Title 1',
        [ 'Text describing the feature 1' ]
        ),
        new Feature(
        'Feature Title 2',
        [ 'Text describing the feature 2' ]),
      ],
    )];
```

## Use as library:

Put:

Add "markdown_changelog_parser": "^1.0.4" (or a more current version) to your package.json dependencies section.

### Code example:

```javascript
const changeLogParser = new ChangeLogParser(fileContent);
changeLogParser.parse();
const changelogs = changeLogParser.changeLogs;
console.log(changelogs);
```

### Considerations

In VueJS you need to install raw-loader:

Add "raw-loader": "^4.0.2" (or a more current version) to your package.json dependencies section.
Also add:

```javascript
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          loader: "raw-loader",
        }
      ]
    }
  }
```
as an entry into your vue.config.js file.

Now you can use somethin like: 

```javascript
const fileContent = require(`@/assets/changelogs/${changeLogFileName}`);
```

in your code.

## Development / Customization

### Setup

```
> npm install
```

### Build

Run once on start and every time you change any non-typescript/non-javascript files.
See package.json => scripts => build for more details.

```shell
> npm run build
```

### Automatic re-compiling in Webstorm/IntellJ:

I you allow in your Webstorm Config in Preferences => Framework => TypeScript: you can check recompile on changes.
this will recompile all typescript files in /scr to javascript in /build, but NOT any asset file.
Asset file changes need to be compiled separatly using: npm run build.

### Execute tests:

```shell
> npm run test
```

## Execute tests:

```shell
> npm run test
```
