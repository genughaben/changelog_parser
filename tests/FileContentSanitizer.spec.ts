import * as fs from "fs";
import { PathOrFileDescriptor } from "fs";
import {FileContentSanitizer} from "../src/FileContentSanitizer";


describe("FileContentSanitizer", () => {
  test("splitLines", () => {
    const expectedResult = [
      "# CHANGELOGS  ",
      "      ",
      "    ## Changelog Title - Version 2.00  ",
      "      ",
      "    ### 2021-12-20  ",
      "    ",
    ];

    const testInput = `# CHANGELOGS  
      
    ## Changelog Title - Version 2.00  
      
    ### 2021-12-20  
    `

    const actualResult = FileContentSanitizer.splitLines(testInput);
    expect(actualResult).toEqual(expectedResult);
  });

  test("trim", () => {
    const expectedResult = [
      "# CHANGELOGS",
      "",
      "## Changelog Title - Version 2.00",
      "",
      "### 2021-12-20",
      ""
    ];

    const testInput = [
      "# CHANGELOGS  ",
      "      ",
      "    ## Changelog Title - Version 2.00  ",
      "      ",
      "    ### 2021-12-20  ",
      "    ",
    ];

    const actualResult = FileContentSanitizer.trim(testInput);
    expect(actualResult).toEqual(expectedResult);
  });

  test("removeEmptyLines", () => {
    const expectedResult = [
      '# CHANGELOGS',
      '## Changelog Title - Version 2.00',
      '### 2021-12-20',
    ]
    const testInput = [
      '# CHANGELOGS',
      '',
      '## Changelog Title - Version 2.00',
      '',
      '### 2021-12-20',
      '',
    ];

    const actualResult = FileContentSanitizer.removeEmptyLines(testInput);
    expect(actualResult).toEqual(expectedResult);
  });

  test("removeChangelogsTitleLine", () => {
    const expectedResult = [
      '## Changelog Title - Version 2.00',
      '### 2021-12-20',
    ]
    const testInput = [
      "# CHANGELOGS",
      '## Changelog Title - Version 2.00',
      '### 2021-12-20'
    ]

    const actualResult = FileContentSanitizer.removeChangelogsTitleLine(testInput);
    expect(actualResult).toEqual(expectedResult);
  });

  test("cleanLines", () => {
    const expectedResult = [
      '## Changelog Title - Version 2.00',
      '### 2021-12-20',
      '#### Feature Title 1',
      'Text describing the feature 1 Line 1',
      'Text describing the feature 1 Line 2',
      'Text describing the feature 1  Line 3',
      '#### Feature Title 2',
      'Text describing the feature 2',
      '## Changelog Title - Version 1.00',
      '### 2021-10-10',
      '#### Feature Title 1',
      'Text describing the feature 1',
      '#### Feature Title 2',
      'Text describing the feature 2'
    ]

    const testFilePath: PathOrFileDescriptor = './tests/assets/CHANGELOG.md'
    const testFileContent: string = fs.readFileSync(testFilePath, "utf8");

    const acutalResult = FileContentSanitizer.cleanLines(testFileContent);
    expect(acutalResult).toEqual(expectedResult);
  });
});
