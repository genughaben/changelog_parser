export interface Feature {
  title: string
  description: string[]
}

export interface ChangeLog {
  title: string;
  date: Date;
  features: Feature[];
}

export class FeatureBuilder {
  private readonly _feature: Feature;

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
    return this._feature;
  }
}


export class ChangeLogBuilder {
  private readonly _changeLog: ChangeLog;

  constructor() {
    this._changeLog = {
      title: "",
      date: new Date(),
      features: []
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
    return this._changeLog;
  }
}
