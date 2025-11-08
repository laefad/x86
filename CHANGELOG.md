# Change Log

## 0.5.3

1. Changed the README and screenshots for the new version 
2. Changed the extension publisher and the extension data directory name
3. Updated the license

## 0.5.2

1. Moved all parsing related code to the specified class Parser.
2. Update deps versions.
3. Finally fixed icons via importing js bundle from @vscode-elements.

## 0.5.1 

1. Fixed icons in webview lists.
2. Changed a WebviewViewProvider instead of a TreeDataProvider.
3. Added some vscode webview ui packages.

## 0.5.0

Complete reworking of the expansion: 
1. Cleanup:
    1. Removed vsix packages from git.
    2. Removed code related to tests, since there were no tests itselves.
    3. Removed ftp and json parts of the extension, as it is unknown what they were used for. And seems to have been added just to learn the api vscode.
    4. Testing, linting, ftp and json related packages have been removed.
    5. Also, various icons (resources dir) related to item 3 have been removed.
    6. Removed usage.md, bugs.txt, _config.yml, slash:allowed?yes!.txt, .gitattributes and docs/index.html as meaningless.
    7. The old dir is also deleted.
2. Code:
    1. All requests are rewritten using fetch instead of the 'request' library.
    2. Parsing html is now performed using the jsdom library, which provides more native and easier parsing, than the htmlparser2 library.
    3. The tree view of instructions has been completely rewritten: code taken from examples has been removed; data is now saved to a file and reused on future runs; the number of instructions related to rendering and updating has been reduced to zero.
    4. The instruction representation is allocated to a separate class. Now caching of html pages is performed.
    5. All the old commands have been removed, and new two commands have been created: to download a new list of instructions and to open a view of a specific instruction.
    6. The extension is now built using webpack, which reduces the final size and increases the build speed.
3. Other:
    1. .vscode/settings.json removed.
    2. .vscode/tasks.json and .vscode/launch.json rewritten to webpack interaction.
    3. Strict mode is enabled in tsconfig.
    4. The extension icons have been renamed and relocated.
    5. All files in the /x86 directory have been removed because globalStorageUri is now used to cache pages.
    6. .vscodeignore and .gitignore updated


## 0.4.2

- Added stylesheet to correctly show tables

## 0.4.0

- Migration to @vscode/test-electron API since vscode is deprecated
- Show icon with correct size
- Added view for SMX instructions

## 0.3.3

- Using Webview API to open instructions since previewHtml is deprecated
- Resolved issue where extension would not install on Windows because of filenames containing ':'

## 0.1.0

- Instruction reference now opens up in VS Code itself (using previewHtml) instead of externally in default browser

## 0.0.1

- Initial release
