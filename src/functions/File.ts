export const base64toBlob = (
  base64String: string,
  contentType: string = "application/pdf"
): Blob => {
  contentType = contentType || "";
  let sliceSize = 512;
  base64String = base64String.replace(/^[^,]+,/, "");
  base64String = base64String.replace(/\s/g, "");
  let byteCharacters = window.atob(base64String);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const fileToBase64 = (file: File): string | ArrayBuffer | null => {
  let reader = new FileReader();
  reader.onload = function () {
    return reader.result;
  };
  reader.readAsDataURL(file);
  return null;
};
