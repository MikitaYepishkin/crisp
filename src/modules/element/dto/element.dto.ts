import { PatternDataEntityWithId } from "src/modules/pattern/pattern-data.entity ";
import { PatternEntityWithId } from "src/modules/pattern/pattern.entity";
import { SelectorEntityWithId } from "src/modules/selector/selector.entity";

export class ElementDto {
    public _id: string;
    public date: Date = new Date(Date.now());
    public name: string;
    public description: string;
    public page: string;
    public selectors: SelectorEntityWithId | {};
    public pageObjectPattern: PatternEntityWithId | null;
    public actionPatterns: any[];
    public parentElement: string;
}
  