export class FileContentSanitizer {

  public static splitLines(fileContent: string): string[] {
    return fileContent.split("\n");
  }

  public static removeEmptyLines(fileLines: string[]): string[] {
    return fileLines.filter((line) => line.trim().length > 0);
  }

  public static removeChangelogsTitleLine(fileLines: string[]): string[] {
    const changeLogsTitleLine: string | undefined = fileLines.shift();
    if (
      changeLogsTitleLine === undefined ||
      !changeLogsTitleLine.match(/# CHANGELOGS/)
    ) {
      throw new Error("Missing Changelogs file title string");
    }
    return fileLines;
  }

  public static trim(fileLines: string[]): string[] {
    return fileLines.map((line) => line.trim());
  }

  public static cleanLines(fileContent: string): string[] {
    const fileLines: string[] = FileContentSanitizer.splitLines(fileContent);
    const noEmptySpacesLines = FileContentSanitizer.trim(fileLines);
    const noEmptyLines = FileContentSanitizer.removeEmptyLines(noEmptySpacesLines);
    return FileContentSanitizer.removeChangelogsTitleLine(noEmptyLines);
  }
}
