'use server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
// env var values here are copied from service account credentials generated by google
// see "Authentication" section in docs for more info
email: process.env.CLIENT_EMAIL,
key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
scopes: ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive.file'],
});

let sheetId = "1pfSgkV-wULcjfIccusXJVHmG8J0IqcvB2idCMayDPcM"


export async function getCloserData(closer:string) { 
    try{
        
        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0];
        let allRows =(await sheet.getRows())
        .filter((item) => {
            if(item.toObject().Closer === closer){ return item.toObject()}}).flat()
        const rows = allRows.flatMap((item, index) => {
            if(item.toObject().Closer === closer){ 
                return {...item.toObject(), Id:index+2, columnId:null}
            }
        });
        
 
        return { data: rows };
    }
    catch(error){
        console.log(error.message)
    }
}

export async function getAllClosers() {
    try{

        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]
        const rows = (await sheet.getCellsInRange('H2:H')).flatMap((item) => {
            return item
        });
        

        return { data: [...new Set(rows)] };
    }
    catch(error){
        console.log(error.message)
    }
}

export async function updateClientStatus(object) { 
    try{

        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets

        const newRow = await sheet.addRow(object);
        const sheet = doc.loadCells("*")
        console.log(sheet);
        
        // await doc.updateProperties({ title: 'renamed doc' });

        return { data: doc.title };
    }
    catch(error){
        console.log(error.message)
    }
}