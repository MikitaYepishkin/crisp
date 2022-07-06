export class PatternDataDto {
  public _id: string;

  public id: string;

  public customVars: {
    [key: string]: string | undefined;
  };

  public date: Date = new Date(Date.now());
}
