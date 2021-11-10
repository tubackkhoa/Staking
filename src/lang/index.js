const vi = {
  notInstallMetamask: 'Bạn chưa cài MetaMask, cài đặt ví tại: https://metamask.io/download.html',
  transactionFailed: `Transaction failed!`,
  pleaseWaiting: 'Làm ơn chờ, bạn chỉ có thể thực hiện 1 giao dịch trong 1 thời điểm!'
}

const en = {
  notInstallMetamask: 'You have not installed MetaMask, install the wallet at: https://metamask.io/download.html',
  transactionFailed: 'Transaction failed!',
  pleaseWaiting: 'Please wait, you can only make 1 transaction at a time!'
}

export const lang = (langCode = 'en') => {
  switch (langCode) {
    case 'vi':
      return vi;
    case 'en':
      return en;
    default:
      return en;
  }
}