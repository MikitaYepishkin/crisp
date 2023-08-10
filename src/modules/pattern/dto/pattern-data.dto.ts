import { TCustomVars } from "../customVars.type";

export class PatternDataDto {
  public _id: string;

  public id: string;

  public customVars: TCustomVars;

  public date: Date = new Date(Date.now());
}
