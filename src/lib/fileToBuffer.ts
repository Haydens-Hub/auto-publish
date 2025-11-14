
//format for all files to be stored in database
export interface FileBuffer {
  data: Buffer;
  filename: string;
  contentType: string;
  format: "buffer";
}



//Helper function to convert a file to a buffer
// Vital for file uploads to the database
export async function fileToBuffer(file: File): Promise<FileBuffer> {
  //creates an ArrayBuffer from the file and then converts it to a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  //then returns the filebuffer object
    return {
    data: buffer,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    format: "buffer",
    };


}