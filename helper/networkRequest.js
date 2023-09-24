import Constants from 'expo-constants';

const { baseURL } = Constants.manifest.extra;

/**
 * Uploading media files to a given url
 * @param uri
 * @param type
 * @returns {Promise<*|Response>}
 */
export default async function uploadMedia(uri, type, fileName = 'file') {
  const formData = new FormData();
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const name = `${fileName}.${fileType}`;
  formData.append('file', {
    uri,
    name,
    type: `${type}/${fileType}`,
  });
  formData.append('fileName', name);
  formData.append('type', fileType);

  const url = `${baseURL}users/dps`;
  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    body: formData,
    redirect: 'follow',
  };

  let response = await fetch(url, params);
  response = await response.json();
  return response;
}
