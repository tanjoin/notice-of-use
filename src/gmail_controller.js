class GmailController {
  static get GMAIL_BASE_URL() {
    return "https://mail.google.com/mail/u/0/#inbox";
  }

  static createUrl(id) {
    return `${GmailController.GMAIL_BASE_URL}/${id}`;
  }
};
