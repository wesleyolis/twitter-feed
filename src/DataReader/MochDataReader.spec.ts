import {IDataReader} from '../DataReader/IDataReader';

export class MochDataReader implements IDataReader
{
    public constructor(private data: string)
    {

    }

    ReadAllData() : string 
    {
        return this.data;
    }
}