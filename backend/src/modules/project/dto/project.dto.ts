export class ProjectDto {
    public _id: string = '';
    public date: Date = new Date(Date.now());
    public name: string = '';
    public framework: string = '';
    public description: string = '';
    public isDefault: Boolean = false;
}
