const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

async function initializeDatabase(mongoUrl, dbName) {
    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        
       
        await db.collection('pdfs').dropIndexes();
        
       
        await db.collection('pdfs').createIndex({
            'metadata.title': 'text',
            'metadata.file_name': 'text',
            'content': 'text'
        }, {
            weights: {
                'metadata.title': 10,
                'metadata.file_name': 8,
                'content': 5
            },
            name: "pdf_search_index"
        });

      
        const extractedDataPath = path.join(__dirname, '../../pdf_processor/extracted_data.json');
        if (fs.existsSync(extractedDataPath)) {
            const extractedData = JSON.parse(fs.readFileSync(extractedDataPath, 'utf8'));
            
           
            await db.collection('pdfs').deleteMany({});
            
           
            await db.collection('pdfs').insertMany(extractedData);
            console.log('Data indexed successfully');
        }
        
        return db;
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

module.exports = initializeDatabase;