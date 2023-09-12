declare namespace Api {
  type EmailParams = {
    toEmail: string;
    subject: string;
    content: string;
  };
  type GroupEmailParams = {
    clientName: string;
    emails: string[];
    title: string;
    content: string;
    type: 'html' | 'text';
    onDownloadProgress?: (progressEvent: any) => void
  };
}
