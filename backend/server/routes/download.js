const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../../pdf_dir', filename);
    
   
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

   
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).json({ error: 'Error downloading file' });
    });
});

module.exports = router;