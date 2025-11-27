export const getDriveLinks = (url: string) => {
  const match = url.match(/\/d\/(.*?)\//);
  if (!match) return { viewUrl: url, downloadUrl: url };
  const id = match[1];
  return {
    viewUrl: `https://drive.google.com/file/d/${id}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
  };
};
