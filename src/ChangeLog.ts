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
  date: Date;
  description: Line[];
}

export class ChangeLog implements ChangeLogInterface {
  title: string;
  date: Date;
  description: Line[];

  constructor(title: string, date: Date, description: Line[]) {
    this.title = title;
    this.date = date;
    this.description = description;
  }

  static build(props: ChangeLogInterface) {
    return new ChangeLog(props.title, props.date, props.description);
  }
}

export class ChangeLogBuilder {
  private readonly _changeLog: ChangeLogInterface;

  constructor() {
    this._changeLog = {
      title: "",
      date: new Date(),
      description: [],
    };
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

  build(): ChangeLog {
    return ChangeLog.build(this._changeLog);
  }
}
