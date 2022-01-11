import {
  ChangeLogDateState,
  ChangeLogTitleState,
  DescriptionBulletState,
  DescriptionTextState,
  NoneState
} from "../src/LineStates";
import {
  AddBulletAfterBulletAction,
  AddBulletAfterChangeLogDateAction,
  AddBulletAfterTextAction,
  AddChangeLogDateAction,
  AddTextAfterBulletAction,
  AddTextAfterChangeLogDateAction,
  AddTextAfterTextAction,
  FirstChangeLogAction,
  NewChangeLogActionAfterBullet,
  NewChangeLogActionAfterText,
} from "../src/LineTransitionActions";
import {ChangeLogParser} from "../src/ChangeLogParser";
import {ChangeLog, ChangeLogBuilder, Line} from "../src/ChangeLog";
import {LineStateType} from "../src/LineStateTypes";


describe("LineTransitionActions", () => {
  test('AddBulletAfterBulletAction: states', () => {
    const action = new AddBulletAfterBulletAction()
    expect(action.inState).toBe(DescriptionBulletState);
    expect(action.outState).toBe(DescriptionBulletState);
  })

  test('AddBulletAfterChangeLogDateAction: states', () => {
    const action = new AddBulletAfterChangeLogDateAction()
    expect(action.inState).toBe(ChangeLogDateState);
    expect(action.outState).toBe(DescriptionBulletState);
  })

  test('AddBulletAfterTextAction: states', () => {
     const action = new AddBulletAfterTextAction()
    expect(action.inState).toBe(DescriptionTextState);
    expect(action.outState).toBe(DescriptionBulletState);
  })

  test('AddChangeLogDateAction: states', () => {
     const action = new AddChangeLogDateAction()
    expect(action.inState).toBe(ChangeLogTitleState);
    expect(action.outState).toBe(ChangeLogDateState);
  })

  test('AddTextAfterBulletAction: states', () => {
    const action = new AddTextAfterBulletAction()
    expect(action.inState).toBe(DescriptionBulletState);
    expect(action.outState).toBe(DescriptionTextState);
  })

  test('AddTextAfterChangeLogDateAction: states', () => {
    const action = new AddTextAfterChangeLogDateAction()
    expect(action.inState).toBe(ChangeLogDateState);
    expect(action.outState).toBe(DescriptionTextState);
  })

  test('AddTextAfterTextAction: states', () => {
    const action = new AddTextAfterTextAction()
    expect(action.inState).toBe(DescriptionTextState);
    expect(action.outState).toBe(DescriptionTextState);
  })

 test('FirstChangeLogAction: states', () => {
   const action = new FirstChangeLogAction()
   expect(action.inState).toBe(NoneState);
   expect(action.outState).toBe(ChangeLogTitleState);
 })

 test('NewChangeLogActionAfterBullet: states', () => {
   const action = new NewChangeLogActionAfterBullet()
   expect(action.inState).toBe(DescriptionBulletState);
   expect(action.outState).toBe(ChangeLogTitleState);
 })

 test('NewChangeLogActionAfterText: states', () => {
   const action = new NewChangeLogActionAfterText()
   expect(action.inState).toBe(DescriptionTextState);
   expect(action.outState).toBe(ChangeLogTitleState);
 })
})


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

  test("AddBulletAfterChangeLogDateAction", () => {
    exampleParser["_parserState"] = ChangeLogDateState;
    exampleParser.currentLine = '- starting with a bullet'

    const transition = new AddBulletAfterChangeLogDateAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("starting with a bullet", LineStateType.DESCRIPTION_BULLET);

    expect(actualResult).toStrictEqual(expectedResult);
  });

  test("AddTextAfterChangeLogDateAction", () => {
    exampleParser["_parserState"] = ChangeLogDateState;
    exampleParser.currentLine = 'starting with a text'

    const transition = new AddTextAfterChangeLogDateAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("starting with a text", LineStateType.DESCRIPTION_TEXT);

    expect(actualResult).toStrictEqual(expectedResult);
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

  test("AddBulletAfterBulletAction", () => {
    exampleParser["_parserState"] = DescriptionBulletState;
    exampleParser.currentLine = '* bullet'

    const transition = new AddBulletAfterBulletAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("bullet", LineStateType.DESCRIPTION_BULLET);

    expect(actualResult).toStrictEqual(expectedResult);
  })

  test("AddTextAfterBulletAction", () => {
    exampleParser["_parserState"] = DescriptionBulletState;
    exampleParser.currentLine = 'text'

    const transition = new AddTextAfterBulletAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("text", LineStateType.DESCRIPTION_TEXT);

    expect(actualResult).toStrictEqual(expectedResult);
  })

  test("AddTextAfterTextAction", () => {
    exampleParser["_parserState"] = DescriptionTextState;
    exampleParser.currentLine = 'text'
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];
    _changeLog.description = [new Line("previous text", LineStateType.DESCRIPTION_TEXT)];

    const transition = new AddTextAfterTextAction();
    transition.action(exampleParser);

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("previous text text", LineStateType.DESCRIPTION_TEXT);

    expect(actualResult).toStrictEqual(expectedResult);
  })

  test("AddBulletAfterTextAction", () => {
    exampleParser["_parserState"] = DescriptionTextState;
    exampleParser.currentLine = '- text'

    const transition = new AddBulletAfterTextAction();
    transition.action(exampleParser);
    const _changeLog = exampleParser.changeLogBuilder["_changeLog"];

    const actualResult = _changeLog.description.at(-1)
    const expectedResult = new Line("text", LineStateType.DESCRIPTION_BULLET);

    expect(actualResult).toStrictEqual(expectedResult);
  })


  // ### finished so far

  test('NewChangeLogActionAfterText action', () => {
    exampleParser["_parserState"] = DescriptionTextState;

    const currentChangeLogBuilder = new ChangeLogBuilder();
    currentChangeLogBuilder.title("Changelog 1 Title");
    currentChangeLogBuilder.date("2012-09-01");
    currentChangeLogBuilder.addDescription(new Line("Description 1", LineStateType.DESCRIPTION_TEXT));

    exampleParser.changeLogBuilder = currentChangeLogBuilder;

    exampleParser.currentLine = '## Changelog 2 Title';
    const transition = new NewChangeLogActionAfterText();
    transition.action(exampleParser);

    const changeLogs: ChangeLog[] = exampleParser.changeLogs;
    const _changelog = exampleParser.changeLogBuilder["_changeLog"];

    expect(changeLogs.length).toBe(1);
    expect(changeLogs[0].description.length).toBe(1)
    expect(_changelog.title).toBe("Changelog 2 Title");
  });

  test('NewChangeLogActionAfterBullet action', () => {
    exampleParser["_parserState"] = DescriptionBulletState;

    const currentChangeLogBuilder = new ChangeLogBuilder();
    currentChangeLogBuilder.title("Changelog 1 Title");
    currentChangeLogBuilder.date("2012-09-01");
    currentChangeLogBuilder.addDescription(new Line("- Feature Text", LineStateType.DESCRIPTION_BULLET));

    exampleParser.changeLogBuilder = currentChangeLogBuilder;

    exampleParser.currentLine = '## Changelog 2 Title';
    const transition = new NewChangeLogActionAfterText();
    transition.action(exampleParser);

    const changeLogs: ChangeLog[] = exampleParser.changeLogs;
    const _changelog = exampleParser.changeLogBuilder["_changeLog"];

    expect(changeLogs.length).toBe(1);
    expect(changeLogs[0].description.length).toBe(1)
    expect(_changelog.title).toBe("Changelog 2 Title");
  });
});
