import {
  ChangeLogDateState,
  ChangeLogTitleState,
  FeatureDescriptionState,
  FeatureTitleState,
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

  test('FeatureTitleState', () => {
    expect(FeatureTitleState.is("## Changelog 1.0")).toBe(false)
    expect(FeatureTitleState.is("#### Feature 1")).toBe(true)
  });

  test('FeatureDescriptionState', () => {
    expect(FeatureDescriptionState.is("## Changelog 1.0")).toBe(false)
    expect(FeatureDescriptionState.is("### 2099-03-21")).toBe(false)
    expect(FeatureDescriptionState.is("#### Feature 1")).toBe(false)
    expect(FeatureDescriptionState.is("This is some text")).toBe(true)
  });
});

describe("LogStates parse tests", () => {
  test('NoneState', () => {
    expect(NoneState.parse("")).toBe("")
    expect(NoneState.parse("##")).toBe("")
  });

  test('ChangeLogTitleState', () => {
    expect(ChangeLogTitleState.parse("## Changelog 1.0")).toBe("Changelog 1.0")
    expect(ChangeLogTitleState.parse("###")).toBe("")
  });

  test('ChangeLogDateState', () => {
    expect(ChangeLogDateState.parse("## Changelog 1.0")).toBe("")
    expect(ChangeLogDateState.parse("### 1989-10-12")).toBe("1989-10-12")
    expect(ChangeLogDateState.parse("### 2153-10-12")).toBe("2153-10-12")
  });

  test('FeatureTitleState', () => {
    expect(FeatureTitleState.parse("## Changelog 1.0")).toBe("")
    expect(FeatureTitleState.parse("#### Feature 1")).toBe("Feature 1")
  });

  test('FeatureDescriptionState', () => {
    expect(FeatureDescriptionState.parse("## Changelog 1.0")).toBe("")
    expect(FeatureDescriptionState.parse("### 2099-03-21")).toBe("")
    expect(FeatureDescriptionState.parse("#### Feature 1")).toBe("")
    expect(FeatureDescriptionState.parse("This is some text")).toBe("This is some text")
    expect(FeatureDescriptionState.parse("- this is a bullet point")).toBe("- this is a bullet point")
  });
});

