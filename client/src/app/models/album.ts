export class Album{
  constructor(
    public _id: string,
    public title: string,
    public description: string,
    public year: number,
    public artist: string,
    public image: string
  ){}
}
