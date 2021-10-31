
import json11 from './../data/storeData/11.json'
import json12 from './../data/storeData/12.json'
import json13 from './../data/storeData/13.json'
import json14 from './../data/storeData/14.json'
import json15 from './../data/storeData/15.json'

const pinataFolderUri = 'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC'
const uriList = [
  'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/11.json',
  'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/12.json',
  'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/13.json',
  'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/14.json',
  'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/15.json',
]

export const getAvailableItemsInStore = () => {
  const availableItems = [{
    file: json11,
    uri: uriList[0],
  },
  {
    file: json12,
    uri: uriList[1],
  }, 
  {
    file: json13,
    uri: uriList[2],
  }, 
  {
    file: json14,
    uri: uriList[3],
  }, 
  {
    file: json15,
    uri: uriList[4],
  }]

  return availableItems
}
