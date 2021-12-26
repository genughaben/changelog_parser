import {
  LineState,
  ChangeLogDateState,
  ChangeLogTitleState,
  FeatureDescriptionState,
  FeatureTitleState,
  NoneState, LineStateType
} from "./ChangeLogStates";
import {ChangeLogBuilder, FeatureBuilder} from "./ChangeLog";
import {ChangeLogParser} from "./ChangelogParser";


export abstract class Action {
  public abstract inState: LineState;
  public abstract outState: LineState;

  print() {
    console.log(`${LineStateType[this.inState.type]} -> ${LineStateType[this.outState.type]}`);
  }

  action(parser: ChangeLogParser): void {};
}

export class FirstChangeLogAction extends Action {
  public inState: LineState = NoneState;
  public outState: LineState = ChangeLogTitleState;

  action(parser: ChangeLogParser): void {
    parser.changeLogBuilder.title(this.outState.parse(parser.currentLine));
  }
}

export class AddChangeLogDateAction extends Action {
  public inState: LineState = ChangeLogTitleState;
  public outState: LineState = ChangeLogDateState;

  action(parser: ChangeLogParser){
    parser.changeLogBuilder.date(this.outState.parse(parser.currentLine));
  }
}

export class FirstFeatureForChangeLogAction extends Action {
  public inState: LineState = ChangeLogDateState;
  public outState: LineState = FeatureTitleState;

  action(parser: ChangeLogParser){
    parser.featureBuilder.title(this.outState.parse(parser.currentLine));
  }
}

export class AddFeatureDescriptionAction extends Action {
  public inState: LineState = FeatureTitleState;
  public outState: LineState = FeatureDescriptionState;

  action(parser: ChangeLogParser){
    parser.featureBuilder.description(this.outState.parse(parser.currentLine));
  }
}

export class AddMoreFeatureDescriptionAction extends Action {
  public inState: LineState = FeatureDescriptionState;
  public outState: LineState = FeatureDescriptionState;

  action(parser: ChangeLogParser){
    parser.featureBuilder.description(this.outState.parse(parser.currentLine));
  }
}

export class AddNextFeatureDescriptionAction extends Action {
  public inState: LineState = FeatureDescriptionState;
  public outState: LineState = FeatureTitleState;

  action(parser: ChangeLogParser){
    // finalize feature and push to features[]
    const newFeature = parser.featureBuilder.build()
    parser.features.push(newFeature);

    // reset builder
    parser.featureBuilder = new FeatureBuilder();

    // add new features title
    parser.featureBuilder.title(this.outState.parse(parser.currentLine));
  }
}

export class NewChangeLogAction extends Action {
  public inState: LineState = FeatureDescriptionState;
  public outState: LineState = ChangeLogTitleState;

  action(parser: ChangeLogParser){
    // finalize feature and push to features[]
    const newFeature = parser.featureBuilder.build();
    parser.features.push(newFeature);

    // add new feature to change log, build changelog and push to changeLogs[]
    parser.changeLogBuilder.features(parser.features)
    const newChangeLog = parser.changeLogBuilder.build();
    parser.changeLogs.push(newChangeLog);

    // reset builders and features array
    parser.changeLogBuilder = new ChangeLogBuilder();
    parser.featureBuilder = new FeatureBuilder();
    parser.features = []

    // set changelog title
    parser.changeLogBuilder.title(this.outState.parse(parser.currentLine));
  }
}
