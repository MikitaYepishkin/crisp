export class ProjectDto {
    public _id = '';
    public date: Date = new Date(Date.now());
    public name = '';
    public framework = '';
    public description = '';
    public isDefault = false;
}
