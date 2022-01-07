export enum LineStateType {
  NONE,
  CHANGELOG_TITLE,
  CHANGELOG_DATE,
  FEATURE_TITLE,
  FEATURE_DESCRIPTION,
  FEATURE_BULLET_DESCRIPTION,
}

interface LineStateInterface {
  type: LineStateType;
  is: (line: string) => boolean;
  parse: (line: string) => string;
}

export class LineState implements LineStateInterface {
  type: LineStateType;
  regex: RegExp;

  constructor(type: LineStateType, regex: RegExp) {
    this.type = type;
    this.regex = regex;
  }

  is(line: string): boolean {
    return this.regex.test(line);
  }

  parse(line: string): string{
    if (this.is(line)) {
      const matches = line.match(this.regex)
      if(matches && matches.length >= 4){
        if(matches[2].length > 0) {
          return matches[3];
        }
        throw new Error(`Missing empty space between line identifier and content: ${line}`);
      }
    }
    return "";
  }
}

export const NoneState = new LineState(LineStateType.NONE, /(?=a)b/);

export const ChangeLogTitleState = new LineState(
  LineStateType.CHANGELOG_TITLE,
  /^(##)(\s+)(.*)$/
);

export const ChangeLogDateState = new LineState(
  LineStateType.CHANGELOG_DATE,
  /^(###)(\s+)(\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01]))$/
);
export const FeatureTitleState = new LineState(
  LineStateType.FEATURE_TITLE,
  /(####)(\s+)(.*)/
);
export const FeatureDescriptionState = new LineState(
  LineStateType.FEATURE_DESCRIPTION,
  /^((?!(#)).)*$/ // does not match
);
FeatureDescriptionState.parse = (line: string) => {
  if (FeatureDescriptionState.is(line)) {
    return line;
  }
  return "";
};
export const FeatureBulletDescriptionState = new LineState(
  LineStateType.FEATURE_BULLET_DESCRIPTION,
  /^([*,-])(\s+)(.*)$/ // does not match
);
