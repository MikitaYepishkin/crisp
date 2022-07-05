export class PatternDto {
    public _id: string;
    public date: Date = new Date(Date.now());
    public type: string;
    public framework: string;
    public name: string;
    public script: string;
}
