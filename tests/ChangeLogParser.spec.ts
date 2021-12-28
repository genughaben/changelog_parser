import * as fs from "fs";
import { PathOrFileDescriptor } from "fs";
import {ChangeLogParser} from "../src/ChangeLogParser";

test('ChangeLogParser manual test', () => {
  const filePath: PathOrFileDescriptor = './tests/assets/CHANGELOG.md'
  const fileContent: string = fs.readFileSync(filePath, "utf8");

  const changeLogParser = new ChangeLogParser(fileContent);
  changeLogParser.parse();
  changeLogParser.print();
});
