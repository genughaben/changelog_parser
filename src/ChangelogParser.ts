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
    private parserState: LineState
    public currentLine: string


    checkState() {
        console.log(this.currentLine)
        console.log(this.parserState)
        console.log(this.changeLogs)
        console.log(this.features)
    }


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
        const firstLine = this.changeLogFileLines.pop();
        this.parserState = this.detectState(firstLine);
    }

    private detectState(line: string): LineState {
        for (let state of this.possibleLineStates) {
            if (state.is(line)) {
                return state
            }
        }
        return NoneState
    }

    parse() {
        let nextState: LineState;

        // for (let line of this.changeLogFileLines) {
        //     nextState = this.detectState(line);
        //     const transition = this.allowedTransitions.find(transition => transition.is(this.parserState, nextState));
        //     if (transition) {
        //         transition.do(this, line);
        //     }
        //     this.parserState = nextState;
        // }

        // maybe move actions to states and simplify transitions to simple List of generic Transition(from, to) instances
        // currentTransition = this.getAction(nextState);
        // currentTransition.handle(this);

        console.log("Parsing started");
        console.log(this.changeLogFileLines);
        this.changeLogFileLines.forEach((line: string) => {
            this.currentLine = line;
            nextState = this.detectState(line);
            const maybeTransition = this.getTransition(nextState);
            console.log(LineStateType[maybeTransition.outState.type]);
            maybeTransition.action(this);
            // if (this.isActionAllowed(nextState)) {
            //     this.currentAction(this)
            // }
            this.parserState = nextState;
        });
    }

    print() {
        // console.log(this.changeLogFileLines);
        // console.log(this.parserState);
        console.log(this.changeLogs);
        for(let changeLog of this.changeLogs) {
            console.log(changeLog.date);
            console.log(changeLog.title);
            console.log(changeLog.features);
        }
    }

    getTransition(nextState: LineState): Action {
        for (let transition of this.allowedTransitions) {
            if (transition.inState === this.parserState && transition.outState === nextState) {
                return transition
            }
        }
        throw Error(`Transition for ${LineStateType[this.parserState.type]} -> ${LineStateType[nextState.type]} on line ${this.currentLine} not allowed - hence no action can be returned`);
    }
}


const changeLogParser = new ChangeLogParser()
changeLogParser.parse()
changeLogParser.print()
console.log("bye")
