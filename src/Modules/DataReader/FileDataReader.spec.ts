import {FileDataReader} from './FileDataReader'
import { expect } from 'chai';
import 'mocha';
import { ENOENT } from 'constants';

    it("file not found", () =>
    {
        let fileDataReader = new FileDataReader("./this file shouldn't be found.txt");

        expect(() => {let data = fileDataReader.ReadAllData()}).to.throw('ENOENT');    
    });

    it("file found and reads sucessfully", () =>
    {
        let fileDataReader = new FileDataReader("./src/Modules/DataReader/FileDataReaderTest.txt");
        
        let data = fileDataReader.ReadAllData();

        expect(data).to.eq("Test,\r\nText that should be read.\r\n");
    });
