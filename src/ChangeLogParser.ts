import { FileContentSanitizer } from "./FileContentSanitizer";
import {
  NoneState,
  ChangeLogDateState,
  ChangeLogTitleState,
  DescriptionTextState, LineState, DescriptionBulletState, ChangeLogVersionState,
} from "./LineStates";
import {
  AddBulletAfterBulletAction,
  AddBulletAfterChangeLogDateAction,
  AddBulletAfterTextAction,
  AddChangeLogDateAction,
  AddChangeLogDateAfterVersionAction,
  AddChangeLogVersionAction, AddChangelogVersionAfterDateAction,
  AddDescriptionBulletAfterVersionAction, AddDescriptionTextAfterVersionAction,
  AddTextAfterBulletAction,
  AddTextAfterChangeLogDateAction,
  AddTextAfterTextAction,
  FirstChangeLogAction,
  NewChangeLogActionAfterBullet,
  NewChangeLogActionAfterText,
  TransitionAction,
} from "./LineTransitionActions";
import {
  ChangeLog,
  ChangeLogBuilder,
} from "./ChangeLog";
import {LineStateType} from "./LineStateTypes";

// FSM-like parser for simple markdown changelog files to ChangeLog[] containing Feature[]
export class ChangeLogParser {
  public changeLogs: ChangeLog[] = [];
  public changeLogBuilder: ChangeLogBuilder = new ChangeLogBuilder();

  private changeLogFileLines: Array<string> = [];
  private _parserState: LineState = NoneState;
  public currentLine: string = "";

  private possibleLineStates: LineState[] = [
    NoneState,
    ChangeLogTitleState,
    ChangeLogDateState,
    ChangeLogVersionState,
    DescriptionTextState,
    DescriptionBulletState
  ];

  private allowedTransitions: TransitionAction[] = [
    new FirstChangeLogAction(),
    new AddChangeLogDateAction(),
    new AddChangeLogVersionAction(),
    new AddChangeLogDateAfterVersionAction(),
    new AddChangelogVersionAfterDateAction(),
    new AddDescriptionTextAfterVersionAction(),
    new AddDescriptionBulletAfterVersionAction(),
    new AddTextAfterChangeLogDateAction(),
    new AddBulletAfterChangeLogDateAction(),
    new AddTextAfterTextAction(),
    new AddBulletAfterTextAction(),
    new AddTextAfterBulletAction(),
    new AddBulletAfterBulletAction(),
    new NewChangeLogActionAfterText(),
    new NewChangeLogActionAfterBullet(),
  ];

  constructor(changelog_filecontent: string) {
    this.changeLogFileLines = FileContentSanitizer.cleanLines(changelog_filecontent);
  }

  parse() {
    let nextState: LineState;
    for (let line of this.changeLogFileLines) {
      this.currentLine = line;
      nextState = this.detectState(line);
      const maybeTransition = this.getTransition(nextState);
      maybeTransition.action(this);
      this._parserState = nextState;
    }
    this.finalize();
  }

  private finalize() {
    const lastChangeLog = this.changeLogBuilder.build();
    this.changeLogs.push(lastChangeLog);
  }

  private detectState(line: string): LineState {
    for (let state of this.possibleLineStates) {
      if (state.is(line)) {
        return state;
      }
    }
    return NoneState;
  }

  private getTransition(nextState: LineState): TransitionAction {
    for (let transition of this.allowedTransitions) {
      if (
        transition.inState === this._parserState &&
        transition.outState === nextState
      ) {
        return transition;
      }
    }
    throw Error(
      `Transition for ${LineStateType[this._parserState.type]} -> ${
        LineStateType[nextState.type]
      } on line ${
        this.currentLine
      } not allowed - hence no action can be returned`
    );
  }

  getChangeLogs(): ChangeLog[] {
    return this.changeLogs;
  }

  checkState() {
    console.log(this.currentLine);
    console.log(this._parserState);
    console.log(this.changeLogs);
  }

  print() {
    console.log(this.changeLogFileLines);
    this.changeLogs.forEach((changelog: ChangeLog) => {
        console.log(changelog);
      }
    );
  }
}
