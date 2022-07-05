export class PageDto {
    public _id: string;
    public date: Date = new Date(Date.now());
    public name: string;
    public project: string;
    public description: string;
  }