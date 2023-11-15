export async function FilelUpload(req, res) {
    const basePath = './uploads/';
    const publicPrefix = '/files/';
    const allowedExtension = ['png', 'jpg', 'jpeg', 'mp4'];
    
    try {
        if (!req.files) {
            res.status(400).send({ message: 'There are no files in the request' });
            return;
        }

        if (!req.body.ticketId) {
            res.status(400).send({ message: 'No ticket id' });
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
            const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
    
            if (!allowedExtension.includes(extension)) {
                delete file.data;
                res.status(400).send({ message: `.${extension} files are not allowed`, file });
                return;
            }
    
            const filePath = `${req.body.ticketId}/` + file.md5 + '.' + extension;
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
    
        res.status(200).send({ message: 'all files are uploaded', data });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}