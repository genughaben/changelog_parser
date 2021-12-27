"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LineStates_1 = require("../src/LineStates");
describe("ChangeLogStates is tests", function () {
    test('NoneState', function () {
        expect(LineStates_1.NoneState.is("")).toBe(false);
        expect(LineStates_1.NoneState.is("##")).toBe(false);
    });
    test('ChangeLogTitleState', function () {
        expect(LineStates_1.ChangeLogTitleState.is("## Changelog 1.0")).toBe(true);
        expect(LineStates_1.ChangeLogTitleState.is("###")).toBe(false);
    });
    test('ChangeLogDateState', function () {
        expect(LineStates_1.ChangeLogDateState.is("## Changelog 1.0")).toBe(false);
        expect(LineStates_1.ChangeLogDateState.is("### 1989-10-12")).toBe(true);
        expect(LineStates_1.ChangeLogDateState.is("### 1989-10-12")).toBe(true);
    });
    test('FeatureTitleState', function () {
        expect(LineStates_1.FeatureTitleState.is("## Changelog 1.0")).toBe(false);
        expect(LineStates_1.FeatureTitleState.is("#### Feature 1")).toBe(true);
    });
    test('FeatureDescriptionState', function () {
        expect(LineStates_1.FeatureDescriptionState.is("## Changelog 1.0")).toBe(false);
        expect(LineStates_1.FeatureDescriptionState.is("### 2099-03-21")).toBe(false);
        expect(LineStates_1.FeatureDescriptionState.is("#### Feature 1")).toBe(false);
        expect(LineStates_1.FeatureDescriptionState.is("This is some text")).toBe(true);
    });
});
describe("ChangeLogStates parse tests", function () {
    test('NoneState', function () {
        expect(LineStates_1.NoneState.parse("")).toBe(null);
        expect(LineStates_1.NoneState.parse("##")).toBe(null);
    });
    test('ChangeLogTitleState', function () {
        expect(LineStates_1.ChangeLogTitleState.parse("## Changelog 1.0")).toBe("Changelog 1.0");
        expect(LineStates_1.ChangeLogTitleState.parse("###")).toBe(null);
    });
    test('ChangeLogDateState', function () {
        expect(LineStates_1.ChangeLogDateState.parse("## Changelog 1.0")).toBe(null);
        expect(LineStates_1.ChangeLogDateState.parse("### 1989-10-12")).toBe("1989-10-12");
        expect(LineStates_1.ChangeLogDateState.parse("### 2153-10-12")).toBe("2153-10-12");
    });
    test('FeatureTitleState', function () {
        expect(LineStates_1.FeatureTitleState.parse("## Changelog 1.0")).toBe(null);
        expect(LineStates_1.FeatureTitleState.parse("#### Feature 1")).toBe("Feature 1");
    });
    test('FeatureDescriptionState', function () {
        expect(LineStates_1.FeatureDescriptionState.parse("## Changelog 1.0")).toBe(null);
        expect(LineStates_1.FeatureDescriptionState.parse("### 2099-03-21")).toBe(null);
        expect(LineStates_1.FeatureDescriptionState.parse("#### Feature 1")).toBe(null);
        expect(LineStates_1.FeatureDescriptionState.parse("This is some text")).toBe("This is some text");
        expect(LineStates_1.FeatureDescriptionState.parse("- this is a bullet point")).toBe("- this is a bullet point");
    });
});
