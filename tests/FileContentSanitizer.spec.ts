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
      '### 2021-12-20',
    ]

    const actualResult = FileContentSanitizer.removeChangelogsTitleLine(testInput);
    expect(actualResult).toEqual(expectedResult);
  });

  test("cleanLines", () => {
    const expectedResult = [
      "## Changelog Title - Version 2.00",
      '### v3023.23.123123',
      "Changelog description text line 1",
      "Changelog description text line 2",
      "- Feature bullet 1",
      "- Feature bullet 2",
      "Changelog summary text line",
      "## Changelog Title - Version 1.00",
      "### 2021-10-10",
      "Changelog description text line 1",
      "- Feature bullet 1",
      "- Feature bullet 2",
      "- Feature bullet 3",
      "Changelog summary text line 1",
      "Changelog summary text line 2",
    ]

    const testFilePath: PathOrFileDescriptor = './tests/assets/CHANGELOG_example.md'
    const testFileContent: string = fs.readFileSync(testFilePath, "utf8");

    const acutalResult = FileContentSanitizer.cleanLines(testFileContent);
    expect(acutalResult).toEqual(expectedResult);
  });
});
