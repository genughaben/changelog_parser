import {LineStateType } from "./LineStateTypes";

export interface  LineInterface {
  type: LineStateType
  line: string;
}

export class Line implements LineInterface {
  line: string;
  type: LineStateType;

  constructor(line: string, type: LineStateType = LineStateType.DESCRIPTION_TEXT) {
    this.line = line;
    this.type = type;
  }

  toString(): string {
    return this.line;
  }
  print() {
    console.log(`${this.type}: ${this.line}`);
  }
}

export interface ChangeLogInterface {
  title: string;
  version: string | null;
  date: Date | null;
  description: Line[];
}

export class ChangeLog implements ChangeLogInterface {
  title: string;
  version: string | null;
  date: Date | null;
  description: Line[];

  constructor(title: string, version: string | null = null, date: Date | null = null, description: Line[]) {
    this.title = title;
    this.version = version;
    this.date = date;
    this.description = description;
  }

  static build(props: ChangeLogInterface) {
    return new ChangeLog(props.title, props.version, props.date, props.description);
  }
}

export class ChangeLogBuilder {
  private readonly _changeLog: ChangeLogInterface;

  constructor() {
    this._changeLog = {
      title: "",
      version : null,
      date: null,
      description: [],
    };
  }

  version(version: string): ChangeLogBuilder {
    this._changeLog.version = version;
    return this;
  }

  title(title: string): ChangeLogBuilder {
    this._changeLog.title = title;
    return this;
  }

  date(dateString: string): ChangeLogBuilder {
    this._changeLog.date = new Date(dateString);
    return this;
  }

  addDescription(description: Line): ChangeLogBuilder {
    this._changeLog.description.push(description);
    return this;
  }

  description(description: Line[]): ChangeLogBuilder {
    this._changeLog.description = description;
    return this;
  }

  appendTextToLastLine(text: string): ChangeLogBuilder {
    const lastLine = this._changeLog.description[this._changeLog.description.length - 1];
    lastLine.line += " " + text;
    return this;
  }
  build(): ChangeLog {
    return ChangeLog.build(this._changeLog);
  }
}
