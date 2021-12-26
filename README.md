# Markdown Changelog reader

## Setup

```
> npm install
```

## Build

Run once on start and every time you change any non-typescript/non-javascript files.
See package.json => scripts => build for more details.

```angular2html
> npm run build
```

## Re-compile:

I you allow in your Webstorm Config in Preferences => Framework => TypeScript: you can check recompile on changes.
this will recompile all typescript files in /scr to javascript in /build, but NOT any asset file.
Asset file changes need to be compiled separatly using: npm run build.


