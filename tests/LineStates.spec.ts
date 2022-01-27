import {
  ChangeLogDateState,
  ChangeLogTitleState, ChangeLogVersionState, DescriptionBulletState,
  DescriptionTextState,
  NoneState
} from "../src/LineStates";

describe("LogStates is tests", () => {
  test('NoneState', () => {
    expect(NoneState.is("")).toBe(false)
    expect(NoneState.is("##")).toBe(false)
  });

  test('ChangeLogTitleState', () => {
    expect(ChangeLogTitleState.is("## Changelog 1.0")).toBe(true)
    expect(ChangeLogTitleState.is("###")).toBe(false)
  });

  test('ChangeLogDateState', () => {
    expect(ChangeLogDateState.is("## Changelog 1.0")).toBe(false)
    expect(ChangeLogDateState.is("### 1989-10-12")).toBe(true)
    expect(ChangeLogDateState.is("### 1989-10-12")).toBe(true)
  });

  test('ChangeLogVersion', () => {
    expect(ChangeLogVersionState.is("## Changelog 1.0")).toBe(false)
    expect(ChangeLogVersionState.is("### 1989-10-12")).toBe(false)
    expect(ChangeLogVersionState.is("### v2022.1.0")).toBe(true)
    expect(ChangeLogVersionState.is("### v2022.111.0")).toBe(true)
    expect(ChangeLogVersionState.is("### v3023.23.123123")).toBe(true)
  });

  test('DescriptionState', () => {
    expect(DescriptionTextState.is("## Changelog 1.0")).toBe(false)
    expect(DescriptionTextState.is("### 2099-03-21")).toBe(false)
    expect(DescriptionTextState.is("#### Feature 1")).toBe(false)
    expect(DescriptionTextState.is("This is some text")).toBe(true)
  });
});

describe("LogStates parse tests", () => {
  test('NoneState', () => {
    expect(NoneState.parse("")).toBe("")
    expect(NoneState.parse("##")).toBe("")
  });

  test('ChangeLogTitleState', () => {
    expect(ChangeLogTitleState.parse("## Changelog 1.0")).toBe("Changelog 1.0")
    expect(ChangeLogTitleState.parse("## Changelog #1.0")).toBe("Changelog #1.0")
    expect(ChangeLogTitleState.parse("##Changelog 1.0")).toBe("")
    expect(ChangeLogTitleState.parse("###")).toBe("")
    expect(ChangeLogTitleState.parse("- hello")).toBe("")
    expect(ChangeLogTitleState.parse("* hello")).toBe("")
  });

  test('ChangeLogDateState', () => {
    expect(ChangeLogDateState.parse("## Changelog 1.0")).toBe("")
    expect(ChangeLogDateState.parse("#### Feature Text")).toBe("")
    expect(ChangeLogDateState.parse("### 1989-10-12")).toBe("1989-10-12")
    expect(ChangeLogDateState.parse("### 2153-10-12")).toBe("2153-10-12")
    expect(ChangeLogDateState.parse("- hello")).toBe("")
    expect(ChangeLogDateState.parse("* hello")).toBe("")
  });

  test('DescriptionTextState', () => {
    expect(DescriptionTextState.parse("## Changelog 1.0")).toBe("")
    expect(DescriptionTextState.parse("### 2099-03-21")).toBe("")
    expect(DescriptionTextState.parse("#### Feature 1")).toBe("")
    expect(DescriptionTextState.parse("This #1 feature is some text")).toBe("This #1 feature is some text")
    expect(DescriptionTextState.parse("This is some text")).toBe("This is some text")
    expect(DescriptionTextState.parse("This is some text")).toBe("This is some text")
    expect(DescriptionTextState.parse("- this is a bullet point")).toBe("")
    expect(DescriptionTextState.parse("* this is a bullet point")).toBe("")
  });

  test('DescriptionBulletState', () => {
    expect(DescriptionBulletState.parse("## Changelog 1.0")).toBe("")
    expect(DescriptionBulletState.parse("### 2099-03-21")).toBe("")
    expect(DescriptionBulletState.parse("#### Feature 1")).toBe("")
    expect(DescriptionBulletState.parse("- Fea# ture ## 1")).toBe("Fea# ture ## 1")
    expect(DescriptionBulletState.parse("This is some text")).toBe("")
    expect(DescriptionBulletState.parse("- this is a bullet point with dash")).toBe("this is a bullet point with dash")
    expect(DescriptionBulletState.parse("* this is a bullet point with star")).toBe("this is a bullet point with star")
    expect(DescriptionBulletState.parse("* this is a bullet point with no distance")).toBe("this is a bullet point with no distance")
    expect(DescriptionBulletState.parse("*this is a bullet point with no distance")).toBe("")
  });
});

