# x86 Instruction Reference. Reworked version
This extension is a complete rework (fork) of the original [Extension](https://marketplace.visualstudio.com/items?itemName=whiteout2.x86#review-details) ([Source code](https://github.com/whiteout2/x86)). 

The original project appears to be abandoned, so this fork aims to modernize the codebase, fix long-standing issues, and ensure compatibility with the latest versions of VS Code.

## Key improvements over the original

Starting with version 0.5.0, the extension was entirely rewritten:
- Legacy code (FTP/JSON parts, dead files) removed.
- Migrated to modern fetch API, jsdom, and webpack bundling.
- Deprecated VS Code APIs replaced, caching and performance added.

See the [CHANGELOG.md](/CHANGELOG.md) for a full list of changes since the fork.

## Basic functional
- Shows x86 instructions in side bar
- Custom activity bar icon [x86]
- Parses and references https://www.felixcloutier.com/x86

![Image of x86 extension search bar](/media/x86_screenshot.png)
![Image of x86 extension](/media/x86_screenshot2.png)
