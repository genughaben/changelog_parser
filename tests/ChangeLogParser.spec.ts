import * as fs from "fs";
import {PathOrFileDescriptor} from "fs";
import {ChangeLogParser} from "../src/ChangeLogParser";
import {ChangeLog, Line} from "../src/ChangeLog";
import {LineStateType} from "../src/LineStateTypes";

test('ChangeLogParser manual test', () => {
  const filePath: PathOrFileDescriptor = './tests/assets/CHANGELOG.md'
  const fileContent: string = fs.readFileSync(filePath, "utf8");

  const changeLogParser = new ChangeLogParser(fileContent);
  changeLogParser.parse();
  // changeLogParser.print();

  const expectedChangeLogs: ChangeLog[] = [
    new ChangeLog(
      'Changelog Title - Version 2.00',
      new Date('2021-12-20'),
      [
        new Line('Changelog description text line 1 Changelog description text line 2', LineStateType.DESCRIPTION_TEXT  ),
        new Line('Feature bullet 1', LineStateType.DESCRIPTION_BULLET  ),
        new Line('Feature bullet 2', LineStateType.DESCRIPTION_BULLET  ),
        new Line('Changelog summary text line', LineStateType.DESCRIPTION_TEXT)
      ]),
    new ChangeLog(
      'Changelog Title - Version 1.00',
      new Date('2021-10-10'),
      [
        new Line( 'Changelog description text line 1', LineStateType.DESCRIPTION_TEXT ),
        new Line( 'Feature bullet 1', LineStateType.DESCRIPTION_BULLET),
        new Line( 'Feature bullet 2', LineStateType.DESCRIPTION_BULLET),
        new Line( 'Feature bullet 3', LineStateType.DESCRIPTION_BULLET),
        new Line( 'Changelog summary text line 1 Changelog summary text line 2', LineStateType.DESCRIPTION_TEXT),
      ],
    )];
  // console.log(changeLogParser.getChangeLogs())

  expect(changeLogParser.changeLogs.length).toBe(2);

  changeLogParser.changeLogs.forEach((changeLog: ChangeLog, idx: number) => {
    expect(changeLog.title).toBe(expectedChangeLogs[idx].title);
    expect(changeLog.date).toStrictEqual(expectedChangeLogs[idx].date);
    changeLog.description.forEach((description: Line, idy: number) => {
      expect(description.line).toBe(expectedChangeLogs[idx].description[idy].line);
    });
  });
});
