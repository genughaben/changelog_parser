export interface FeatureInterface {
  title: string;
  description: string[];
}

export interface ChangeLogInterface {
  title: string;
  date: Date;
  features: Feature[];
}

export class Feature implements FeatureInterface {
  title: string;
  description: string[];

  constructor(title: string, description: string[]) {
    this.title = title;
    this.description = description;
  }

  static build(props: FeatureInterface) {
    return new Feature(props.title, props.description);
  }
}

export class ChangeLog implements ChangeLogInterface {
  title: string;
  date: Date;
  features: Feature[];

  constructor(title: string, date: Date, features: Feature[]) {
    this.title = title;
    this.date = date;
    this.features = features;
  }

  static build(props: ChangeLogInterface) {
    return new ChangeLog(props.title, props.date, props.features);
  }
}

export class FeatureBuilder {
  private readonly _feature: FeatureInterface;

  constructor() {
    this._feature = {
      title: "",
      description: [],
    };
  }

  title(title: string): FeatureBuilder {
    this._feature.title = title;
    return this;
  }

  description(description: string): FeatureBuilder {
    this._feature.description.push(description);
    return this;
  }

  build(): Feature {
    return Feature.build(this._feature);
  }
}

export class ChangeLogBuilder {
  private readonly _changeLog: ChangeLogInterface;

  constructor() {
    this._changeLog = {
      title: "",
      date: new Date(),
      features: [],
    };
  }

  title(title: string): ChangeLogBuilder {
    this._changeLog.title = title;
    return this;
  }

  date(dateString: string): ChangeLogBuilder {
    this._changeLog.date = new Date(dateString);
    return this;
  }

  features(features: Feature[]): ChangeLogBuilder {
    this._changeLog.features = features;
    return this;
  }

  build(): ChangeLog {
    return ChangeLog.build(this._changeLog);
  }
}
