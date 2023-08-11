import { PatternDataDto } from 'src/modules/pattern/dto/pattern-data.dto';
import { PatternDataEntityWithId } from 'src/modules/pattern/pattern-data.entity ';
import { PatternEntityWithId } from 'src/modules/pattern/pattern.entity';
import { SelectorEntityWithId } from 'src/modules/selector/selector.entity';
import { ElementPatternDataDto } from './element-pattern-data.dto';

type emptyObject = {};

export class ElementDto {
  public _id: string;
  public date: Date = new Date(Date.now());
  public name: string;
  public description: string;
  public page: string;
  public selectors: SelectorEntityWithId | emptyObject;
  public pageObjectPattern: string | null;
  public actionPatterns: ElementPatternDataDto[];
  public parentElement: string;
}
