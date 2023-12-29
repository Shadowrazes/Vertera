export async function FilelUpload(req, res) {
    const basePath = './uploads/';
    const publicPrefix = '/files/';
    const allowedExtension = [
        'png', 'jpg', 'jpeg', 'webp', 'mp4', 'webm', 'gif', 'pdf', 'txt', 'rtf', 'doc', 'docx',
        'zip', 'rar', 'tar', '7zip', 'mp3'
    ];
    
    try {
        if (!req.files) {
            res.status(400).send({ message: 'There are no files in the request' });
            return;
        }

        if (!req.files.fileFields) {
            res.status(400).send({ message: 'Incorrect field key' });
            return;
        }
        
        const data = [];
        const isOneFile = !Array.isArray(req.files.fileFields);

        for (const key in req.files.fileFields) {
            const file = !isOneFile ? req.files.fileFields[key] : req.files.fileFields;
            const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    
            if (!allowedExtension.includes(extension)) {
                res.status(400).send({ message: `Incorrect file type`});
                return;
            }

            if(isOneFile) break;
        }

        for (const key in req.files.fileFields) {
            const file = !isOneFile ? req.files.fileFields[key] : req.files.fileFields;
            const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    
            const date = new Date();
            const strDate = date.toISOString().split('T')[0];
            const filePath = `${strDate}/` + file.md5 + '.' + extension;
            file.mv(basePath + filePath);
    
            data.push({
                name: publicPrefix + filePath,
                oldName: file.name,
                extension,
                mimetype: file.mimetype,
                size: file.size
            });

            if(isOneFile) break;
        }
    
        res.status(200).send({ message: 'Success', data });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}