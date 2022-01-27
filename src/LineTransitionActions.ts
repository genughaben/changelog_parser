import {
  LineState,
  ChangeLogDateState,
  ChangeLogTitleState,
  DescriptionTextState,
  NoneState, DescriptionBulletState, ChangeLogVersionState,
} from "./LineStates";
import {ChangeLogBuilder, Line} from "./ChangeLog";
import { ChangeLogParser } from "./ChangeLogParser";
import {LineStateType} from "./LineStateTypes";

export abstract class TransitionAction {
  public abstract inState: LineState;
  public abstract outState: LineState;

  print() {
    console.log(
      `${LineStateType[this.inState.type]} -> ${
        LineStateType[this.outState.type]
      }`
    );
  }

  action(parser: ChangeLogParser): void {}
}

export class FirstChangeLogAction extends TransitionAction {
  public inState: LineState = NoneState;
  public outState: LineState = ChangeLogTitleState;

  action(parser: ChangeLogParser): void {
    parser.changeLogBuilder.title(this.outState.parse(parser.currentLine));
  }
}

export class AddChangeLogDateAction extends TransitionAction {
  public inState: LineState = ChangeLogTitleState;
  public outState: LineState = ChangeLogDateState;

  action(parser: ChangeLogParser) {
    parser.changeLogBuilder.date(this.outState.parse(parser.currentLine));
  }
}

export class AddChangeLogVersionAction extends TransitionAction {
  public inState: LineState = ChangeLogTitleState;
  public outState: LineState = ChangeLogVersionState;

  action(parser: ChangeLogParser) {
    parser.changeLogBuilder.version(this.outState.parse(parser.currentLine));
  }
}

export class AddChangeLogDateAfterVersionAction extends TransitionAction {
  public inState: LineState = ChangeLogVersionState;
  public outState: LineState = ChangeLogDateState;

  action(parser: ChangeLogParser) {
    parser.changeLogBuilder.date(this.outState.parse(parser.currentLine));
  }
}

export class AddChangelogVersionAfterDateAction extends TransitionAction {
  public inState: LineState = ChangeLogDateState;
  public outState: LineState = ChangeLogVersionState;

  action(parser: ChangeLogParser) {
    parser.changeLogBuilder.date(this.outState.parse(parser.currentLine));
  }
}

export class AddDescriptionTextAfterVersionAction extends TransitionAction {
  public inState: LineState = ChangeLogVersionState;
  public outState: LineState = DescriptionTextState

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddDescriptionBulletAfterVersionAction extends TransitionAction {
  public inState: LineState = ChangeLogVersionState;
  public outState: LineState = DescriptionBulletState

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddTextAfterChangeLogDateAction extends TransitionAction {
  public inState: LineState = ChangeLogDateState;
  public outState: LineState = DescriptionTextState;

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddBulletAfterChangeLogDateAction extends TransitionAction {
  public inState: LineState = ChangeLogDateState;
  public outState: LineState = DescriptionBulletState;

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddTextAfterTextAction extends TransitionAction {
  public inState: LineState = DescriptionTextState;
  public outState: LineState = DescriptionTextState;

  action(parser: ChangeLogParser) {
    const textToAppend = this.outState.parse(parser.currentLine);
    parser.changeLogBuilder.appendTextToLastLine(textToAppend);
  }
}

export class AddBulletAfterTextAction extends TransitionAction {
  public inState: LineState = DescriptionTextState;
  public outState: LineState = DescriptionBulletState;

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddTextAfterBulletAction extends TransitionAction {
  public inState: LineState = DescriptionBulletState;
  public outState: LineState = DescriptionTextState;

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class AddBulletAfterBulletAction extends TransitionAction {
  public inState: LineState = DescriptionBulletState;
  public outState: LineState = DescriptionBulletState;

  action(parser: ChangeLogParser) {
    const line = new Line(this.outState.parse(parser.currentLine), this.outState.type );
    parser.changeLogBuilder.addDescription(line);
  }
}

export class NewChangeLogActionAfterText extends TransitionAction {
  public inState: LineState = DescriptionTextState;
  public outState: LineState = ChangeLogTitleState;

  action(parser: ChangeLogParser) {
    // add new feature to change log, build changelog and push to changeLogs[]
    const newChangeLog = parser.changeLogBuilder.build();
    parser.changeLogs.push(newChangeLog);

    // reset builders
    parser.changeLogBuilder = new ChangeLogBuilder();

    // set changelog title
    parser.changeLogBuilder.title(this.outState.parse(parser.currentLine));
  }
}

export class NewChangeLogActionAfterBullet extends TransitionAction {
  public inState: LineState = DescriptionBulletState;
  public outState: LineState = ChangeLogTitleState;

  action(parser: ChangeLogParser) {
    // add new feature to change log, build changelog and push to changeLogs[]
    const newChangeLog = parser.changeLogBuilder.build();
    parser.changeLogs.push(newChangeLog);

    // reset builder
    parser.changeLogBuilder = new ChangeLogBuilder();

    // set changelog title
    parser.changeLogBuilder.title(this.outState.parse(parser.currentLine));
  }
}
