import BaseRepository from "./BaseRepository";

export interface UploadFileResponse {
    url: string;
}

export class FileRepository extends BaseRepository {
    async uploadPublicFile(file: File, folder: string): Promise<Result<UploadFileResponse>> {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("folder", folder);  

        return this.sfetch("POST", "/api/file/upload/public-file/", {
            body: formdata,
        });
    }

    async uploadPrivateFile(file: File, folder: string): Promise<Result<UploadFileResponse>> {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("folder", folder);  

        return this.sfetch("POST", "/api/file/upload/private-file/", {
            body: formdata,
        });
    }
}