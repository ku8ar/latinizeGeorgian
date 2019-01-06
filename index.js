// @todo
// - move parts to sep files and add script to build entire content
// - ge pages detection better than manifest domain (maybe by html lang attr)

/* dict */
const geo = new Map(Object.entries({ // v8
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  ჱ: 'ey', // old
  თ: 'tʼ',
  ი: 'i',
  კ: 'k',
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ჲ: 'ai', // old
  ო: 'o',
  პ: 'p',
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: 't',
  ჳ: 'w', // old
  უ: 'u',
  ფ: 'pʼ',
  ქ: 'q',
  ღ: 'gh',
  ყ: 'kʼ',
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: 'tsʼ',
  ჭ: 'chʼ',
  ხ: 'kh',
  ჴ: 'hʼ', // old
  ჯ: 'j',
  ჰ: 'h',
  ჵ: 'h' // old
}))

/* utils */
function forEach(arr, func) { // faster version of fast.js
  let length = arr.length
  if (length === 0) return 0
  let i = 0
  while(i < length) {
    func(arr[i++])
  }
}

/* parser */
function latinizeText(text) {
  let length = text.length
  if (length === 0) return text
  let latinText = ''
  let n = 0
  let tmp = undefined
  while(n < length) {
    tmp = text[n++]
    latinText += geo.get(tmp) || tmp
  }
  return latinText
}

/* dom crawler */
function getTextNodes(n) {
  let result = []
  if (n === undefined) return result
  n = n.firstChild
  while (n !== null) {
    if (n.nodeType === 3) { // 3 - text node
      result.push(n)
    } else {
      result = result.concat(getTextNodes(n)) // slow perf (without tail call opt.)
    }
    n = n.nextSibling
  }
  return result
}

function latinizeNode(el) {
  el.textContent = latinizeText(el.textContent)
}

function convertDomNode(el) {
  forEach(getTextNodes(el), latinizeNode)
}

/* observer */
function mutateRecord(mutationRecord) {
  forEach(mutationRecord.addedNodes, convertDomNode)
  // convertDomNode(mutationRecord.target) // slower but more accurate
}

function mutationWatcher(mutationsList) {
  forEach(mutationsList, mutateRecord)
}

function initWatcher() {
  const observer = new MutationObserver(mutationWatcher)
  observer.observe(document.body, {childList: true, subtree: true})
}

/* rest of page */
function convertDocumentTitle() {
  document.title = latinizeText(document.title)
}

/* run */
document.addEventListener('DOMContentLoaded', () => {
    convertDomNode(document.body)
    convertDocumentTitle()
    initWatcher()
})
