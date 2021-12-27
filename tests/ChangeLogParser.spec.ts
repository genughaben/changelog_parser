import * as fs from "fs";
import { PathOrFileDescriptor } from "fs";
import {ChangeLogParser} from "../src/ChangeLogParser";
const filePath: PathOrFileDescriptor = './tests/assets/CHANGELOG.md'

test('ChangeLogParser manual test', () => {
  const fileContent: string = fs.readFileSync(filePath, "utf8");
  fs.close;

  const changeLogParser = new ChangeLogParser(fileContent);
  changeLogParser.parse();
  changeLogParser.print();
});
