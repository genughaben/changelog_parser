import * as fs from "fs";
import {PathOrFileDescriptor} from "fs";

export class ChangeLogFileReader {
  public filePath: PathOrFileDescriptor;
  private fileLines: string[];

  constructor(filePath: PathOrFileDescriptor = "./assets/CHANGELOG.md") {
    this.filePath = filePath;
  }

  private readFile(): void {
    const fileContent: string = fs.readFileSync(this.filePath, "utf8")
    fs.close;
    this.fileLines = fileContent.split("\n");
  }

  private removeEmptyLines(): void {
    this.fileLines = this.fileLines.filter(line => line.trim().length > 0);
  }

  private removeChangelogsTitleLine(): void {
    const changeLogsTitleLine: string = this.fileLines.shift()
    if(!changeLogsTitleLine.match(/# CHANGELOGS/)){
      throw new Error("Missing Changelogs file title string")
    }
  }

  private trim(): void {
    this.fileLines.map((line) => line.trim());
  }

  public readLines(): Array<string> {
    this.readFile();
    this.removeEmptyLines();
    this.removeChangelogsTitleLine();
    this.trim();
    return this.fileLines;
  }
}
