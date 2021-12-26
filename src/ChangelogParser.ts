import {ChangeLogFileReader} from "./ChangeLogFileReader";
import {
    NoneState,
    ChangeLogDateState,
    ChangeLogTitleState,
    FeatureDescriptionState,
    FeatureTitleState,
    LineState,
    LineStateType,
} from "./ChangeLogStates";
import {
    AddChangeLogDateAction,
    AddFeatureDescriptionAction,
    AddMoreFeatureDescriptionAction,
    AddNextFeatureDescriptionAction,
    FirstChangeLogAction,
    FirstFeatureForChangeLogAction, NewChangeLogAction,
    Action
} from "./ChangeLogTransitions";
import {ChangeLog, ChangeLogBuilder, Feature, FeatureBuilder} from "./ChangeLog";

export class ChangeLogParser {
    public changeLogs: ChangeLog[] = []
    public features: Feature[] = []
    public changeLogBuilder: ChangeLogBuilder = new ChangeLogBuilder()
    public featureBuilder: FeatureBuilder = new FeatureBuilder()

    private changeLogFileLines: Array<string>;
    private parserState: LineState = NoneState;
    public currentLine: string

    private possibleLineStates: LineState[] = [
        NoneState,
        ChangeLogTitleState,
        ChangeLogDateState,
        FeatureTitleState,
        FeatureDescriptionState
    ]

    private allowedTransitions: Action[] = [
        new FirstChangeLogAction(),
        new AddChangeLogDateAction(),
        new FirstFeatureForChangeLogAction(),
        new AddFeatureDescriptionAction(),
        new AddMoreFeatureDescriptionAction(),
        new AddNextFeatureDescriptionAction(),
        new NewChangeLogAction(),
    ];

    constructor(changelog_path: string = "./assets/CHANGELOG.md") {
        const changeLogFileReaer = new ChangeLogFileReader(changelog_path);
        this.changeLogFileLines = changeLogFileReaer.readLines();
    }

    parse() {
        let nextState: LineState;

        console.log("Parsing started");
        this.changeLogFileLines.forEach((line: string) => {
            this.currentLine = line;
            nextState = this.detectState(line);
            const maybeTransition = this.getTransition(nextState);
            maybeTransition.action(this);
            this.parserState = nextState;
        });

        console.log("Parsing finished. Adding final changelog now");
        this.finalize()
    }

    private finalize() {
        const lastFeature = this.featureBuilder.build()
        this.features.push(lastFeature)
        this.changeLogBuilder.features(this.features);
        this.features = []
        const lastChangeLog = this.changeLogBuilder.build()
        this.changeLogs.push(lastChangeLog)
    }

    private detectState(line: string): LineState {
        for (let state of this.possibleLineStates) {
            if (state.is(line)) {
                return state
            }
        }
        return NoneState
    }

    private getTransition(nextState: LineState): Action {
        for (let transition of this.allowedTransitions) {
            if (transition.inState === this.parserState && transition.outState === nextState) {
                return transition
            }
        }
        throw Error(`Transition for ${LineStateType[this.parserState.type]} -> ${LineStateType[nextState.type]} on line ${this.currentLine} not allowed - hence no action can be returned`);
    }

    checkState() {
        console.log(this.currentLine)
        console.log(this.parserState)
        console.log(this.changeLogs)
        console.log(this.features)
    }

    print() {
        console.log(this.changeLogFileLines);
        console.log(this.changeLogs);
        for(let changeLog of this.changeLogs) {
            console.log(changeLog.date);
            console.log(changeLog.title);
            console.log(changeLog.features);
        }
    }
}


const changeLogParser = new ChangeLogParser()
changeLogParser.parse()
changeLogParser.print()
console.log("bye")
