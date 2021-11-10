const vi = {
  notInstallMetamask: 'Bạn chưa cài MetaMask, cài đặt ví tại: https://metamask.io/download.html',
  transactionFailed: `Transaction failed!`,
  pleaseWaiting: 'Làm ơn chờ, bạn chỉ có thể thực hiện 1 giao dịch trong 1 thời điểm!',
  accessToCorrectNetwork: 'Cần truy cập đúng mạng BSC Testnet để có thể sử dụng được các tính năng của chợ!',
  nefusingConnectNetwork: 'Từ chối chuyển đúng mạng sẽ khiến bạn không thể sử dụng các chức năng của marketplace!',
  transferRequestSent: `Đã gửi yêu cầu chuyển mạng, vui lòng kiểm tra danh sách yêu cầu ở ví metamask của bạn!`,
}

const en = {
  notInstallMetamask: 'You have not installed MetaMask, install the wallet at: https://metamask.io/download.html',
  transactionFailed: 'Transaction failed!',
  pleaseWaiting: 'Please wait, you can only make 1 transaction at a time!',
  accessToCorrectNetwork: 'Access to the correct BSC Testnet network is required to use the market features!',
  nefusingConnectNetwork: 'Refusing to switch to the correct network will prevent you from using the marketplace functions!',
  transferRequestSent: 'Transfer request sent, please check request list in your metamask wallet!',
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