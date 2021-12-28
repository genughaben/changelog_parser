import {
  ChangeLogDateState,
  ChangeLogTitleState,
  FeatureDescriptionState,
  FeatureTitleState,
  NoneState
} from "../src/LineStates";
import {
  AddChangeLogDateAction, AddFeatureDescriptionAction, AddMoreFeatureDescriptionAction, AddNextFeatureDescriptionAction,
  FirstChangeLogAction,
  FirstFeatureForChangeLogAction, NewChangeLogAction,
} from "../src/LineTransitionActions";
import {ChangeLogParser} from "../src/ChangeLogParser";
import {Feature} from "../src/ChangeLog";
import {ChangeLogBuilder} from "../src/ChangeLog";
import {ChangeLog, FeatureBuilder} from "../src/ChangeLog";


describe("LineTransitionActions states", () => {
  test('FirstChangeLogAction states', () => {
    const action = new FirstChangeLogAction();
    expect(action.inState).toBe(NoneState);
    expect(action.outState).toBe(ChangeLogTitleState);
  });

  test('AddChangeLogDateAction states', () => {
    const action = new AddChangeLogDateAction();
    expect(action.inState).toBe(ChangeLogTitleState);
    expect(action.outState).toBe(ChangeLogDateState);
  });

  test('FirstFeatureForChangeLogAction states', () => {
    const action = new FirstFeatureForChangeLogAction();
    expect(action.inState).toBe(ChangeLogDateState);
    expect(action.outState).toBe(FeatureTitleState);
  });

  test('AddFeatureDescriptionAction states', () => {
    const action = new AddFeatureDescriptionAction();
    expect(action.inState).toBe(FeatureTitleState);
    expect(action.outState).toBe(FeatureDescriptionState);
  });

  test('AddMoreFeatureDescriptionAction states', () => {
    const action = new AddMoreFeatureDescriptionAction();
    expect(action.inState).toBe(FeatureDescriptionState);
    expect(action.outState).toBe(FeatureDescriptionState);
  });

  test('AddNextFeatureDescriptionAction states', () => {
    const action = new AddNextFeatureDescriptionAction();
    expect(action.inState).toBe(FeatureDescriptionState);
    expect(action.outState).toBe(FeatureTitleState);
  });

  test('NewChangeLogAction states', () => {
    const action = new NewChangeLogAction();
    expect(action.inState).toBe(FeatureDescriptionState);
    expect(action.outState).toBe(ChangeLogTitleState);
  });
});

describe("LineTransitionActions actions", () => {
  let exampleParser: ChangeLogParser;
  beforeEach(() => {
    exampleParser = new ChangeLogParser("# CHANGELOGS");
  });

  test('FirstChangeLogAction action', () => {
    exampleParser["_parserState"] = NoneState;
    exampleParser.currentLine = '## Changelog Title - Version 2.00'

    const transition = new FirstChangeLogAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];
    expect(_changeLog.title).toBe("Changelog Title - Version 2.00");
  });

  test('AddChangeLogDateAction action', () => {
    exampleParser["_parserState"] = ChangeLogTitleState;
    exampleParser.currentLine = '### 2012-09-01'

    const transition = new AddChangeLogDateAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.date.toDateString();
    const expectedResult = new Date("2012-09-01").toDateString();

    expect(actualResult).toBe(expectedResult);
  });

  test('FirstFeatureForChangeLogAction action', () => {
    exampleParser["_parserState"] = ChangeLogDateState;
    exampleParser.currentLine = '#### Feature Title 1';

    const transition = new FirstFeatureForChangeLogAction();
    transition.action(exampleParser);
    const _feature = exampleParser.featureBuilder["_feature"];

    const actualResult = _feature.title
    const expectedResult = "Feature Title 1";

    expect(actualResult).toBe(expectedResult);
  });

  test('AddFeatureDescriptionAction action', () => {
    exampleParser["_parserState"] = FeatureTitleState;
    exampleParser.currentLine = 'Description Feature Text Line 1';

    const transition = new AddFeatureDescriptionAction();
    transition.action(exampleParser);
    const _feature = exampleParser.featureBuilder["_feature"];

    const actualResult = _feature.description
    const expectedResult = ["Description Feature Text Line 1"];

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test('AddMoreFeatureDescriptionAction action', () => {
    exampleParser["_parserState"] = FeatureDescriptionState;
    exampleParser.featureBuilder["_feature"]['description'].push("Description Feature Text Line 1");
    exampleParser.currentLine = 'Description Feature Text Line 2';

    const transition = new AddMoreFeatureDescriptionAction();
    transition.action(exampleParser);
    const _feature = exampleParser.featureBuilder["_feature"];

    const actualResult: string[] = _feature.description
    const expectedResult: string[] = [
      "Description Feature Text Line 1",
      "Description Feature Text Line 2"
    ];

    expect(actualResult).toStrictEqual(expectedResult);
  });


  test('AddNextFeatureDescriptionAction action', () => {
    exampleParser["_parserState"] = FeatureDescriptionState;
    exampleParser.featureBuilder["_feature"].title = "Feature Title 1";
    exampleParser.featureBuilder["_feature"].description = ["Feature 1 Description Line 1"];
    exampleParser.currentLine = '#### Feature 2 Title';

    const transition = new AddNextFeatureDescriptionAction();
    transition.action(exampleParser);
    const _feature = exampleParser.featureBuilder["_feature"];

    const actualResult: string = _feature.title
    const expectedResult: string = 'Feature 2 Title'

    expect(actualResult).toBe(expectedResult);
    expect(exampleParser.features.length).toBe(1);
    expect(exampleParser.features[0].title).toBe("Feature Title 1");
    expect(exampleParser.features[0].description).toStrictEqual(["Feature 1 Description Line 1"]);
  });

  test('NewChangeLogAction action', () => {
    exampleParser["_parserState"] = FeatureDescriptionState;

    const currentFeatureBuilder = new FeatureBuilder();
    currentFeatureBuilder.title("Feature Title 2");
    currentFeatureBuilder.description("Feature 2 Description Line 1");

    const currentChangeLogBuilder = new ChangeLogBuilder();
    currentChangeLogBuilder.title("Changelog 1 Title");
    currentChangeLogBuilder.date("2012-09-01");

    exampleParser.features = [new Feature("Feature Title 1", ["Feature 1 Description Line 1"])];
    exampleParser.featureBuilder = currentFeatureBuilder;
    exampleParser.changeLogBuilder = currentChangeLogBuilder;

    exampleParser.currentLine = '## Changelog 2 Title';
    const transition = new NewChangeLogAction();
    transition.action(exampleParser);

    const changeLogs: ChangeLog[] = exampleParser.changeLogs;
    const _changelog = exampleParser.changeLogBuilder["_changeLog"];

    expect(changeLogs.length).toBe(1);
    expect(changeLogs[0].features.length).toBe(2)
    expect(_changelog.title).toBe("Changelog 2 Title");
  });
});
