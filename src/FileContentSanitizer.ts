export class FileContentSanitizer {
  private fileLines: string[];

  constructor(fileContent: string) {
    this.fileLines = fileContent.split("\n");
  }

  private removeEmptyLines(): void {
    this.fileLines = this.fileLines.filter((line) => line.trim().length > 0);
  }

  private removeChangelogsTitleLine(): void {
    const changeLogsTitleLine: string | undefined = this.fileLines.shift();
    if (
      changeLogsTitleLine === undefined ||
      !changeLogsTitleLine.match(/# CHANGELOGS/)
    ) {
      throw new Error("Missing Changelogs file title string");
    }
  }

  private trim(): void {
    this.fileLines.map((line) => line.trim());
  }

  public readLines(): Array<string> {
    this.removeEmptyLines();
    this.removeChangelogsTitleLine();
    this.trim();
    return this.fileLines;
  }
}
