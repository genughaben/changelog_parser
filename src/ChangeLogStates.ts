export enum LineStateType {
  NONE,
  CHANGELOG_TITLE,
  CHANGELOG_DATE,
  FEATURE_TITLE,
  FEATURE_DESCRIPTION
}

interface LineStateInterface {
  type: LineStateType,
  is: (line: string) => boolean
  parse: (line: string) => string
}

export class LineState implements LineStateInterface {
  type: LineStateType
  regex: RegExp

  constructor(type: LineStateType, regex: RegExp) {
    this.type = type
    this.regex = regex
  }

  is(line: string): boolean {
    return this.regex.test(line);
  }
  parse(line: string) {
    return line.match(this.regex)[2];
  }

}

export const NoneState = new LineState(
  LineStateType.NONE,
  /(?=a)b/
);

export const ChangeLogTitleState = new LineState(
  LineStateType.CHANGELOG_TITLE,
  /^(## )(.*)$/
);

export const ChangeLogDateState = new LineState(
  LineStateType.CHANGELOG_DATE,
  /^(### )(\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01]))$/
);
export const FeatureTitleState = new LineState(
  LineStateType.FEATURE_TITLE,
  /(#### )(.*)/
);
export const FeatureDescriptionState = new LineState(
  LineStateType.FEATURE_DESCRIPTION,
  /^((?!(#)).)*$/  // does not match
);
FeatureDescriptionState.parse = (line: string) => { return line }
