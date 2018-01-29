import {IDataReader} from './IDataReader'
import * as fs from 'fs';

export class FileDataReader implements IDataReader
{    
    public constructor(private fileName : string)
    {    
    }

    public ReadAllData() : string
    {
        let data : string = "";

        return fs.readFileSync(this.fileName, {encoding: 'ascii', flag: 'r'})
    }
}