const vi = {
  notInstallMetamask: 'Bạn chưa cài MetaMask, cài đặt ví tại: https://metamask.io/download.html',
}

const en = {
  notInstallMetamask: 'Bạn chưa cài MetaMask, cài đặt ví tại: https://metamask.io/download.html',
}

const lang = (langCode = 'vi') => {
  switch (langCode) {
    case 'vi':
      return vi;
    case 'en':
      return en;
    default:
      return en;
  }
}