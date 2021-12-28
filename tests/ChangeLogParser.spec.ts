import * as fs from "fs";
import { PathOrFileDescriptor } from "fs";
import {ChangeLogParser} from "../src/ChangeLogParser";
import {ChangeLog, Feature} from "../src/ChangeLog";

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

  expect(changeLogParser.changeLogs.length).toBe(2);

  changeLogParser.changeLogs.forEach((changeLog: ChangeLog, idx: number) => {
    expect(changeLog.title).toBe(expectedChangeLogs[idx].title);
    expect(changeLog.date).toStrictEqual(expectedChangeLogs[idx].date);
    changeLog.features.forEach((feature: Feature, idy: number) => {
      expect(feature.title).toBe(expectedChangeLogs[idx].features[idy].title);
      expect(feature.description).toStrictEqual(expectedChangeLogs[idx].features[idy].description);
    })

  });
});
