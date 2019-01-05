// @todo
// - move parts to sep files and add script to build entire content
// - ge pages detection better than manifest domain (maybe by html lang attr)

/* dict */
const geo = {
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
}

/* optimizations */
function forEach(arr, func) {
  let length = arr.length
  if (length === 0) return 0
  let i = 0
  while(i < length) {
    func(arr[i])
    i++
  }
}

/* dom crawler */
function getTextFromNode(n) {
  let result = []
  if (!n) return result
  n = n.firstChild
  while (n !== null) {
    if (n.nodeType === 3) { // 3 - text node
      result.push(n)
    } else {
      result = result.concat(getTextFromNode(n)) // slow perf (without tail call opt.)
    }
    n = n.nextSibling
  }
  return result
}

function latinizeText(text) {
  if (!text) return text
  let latinText = ''
  let n = 0
  let length = text.length
  while(n < length) {
    latinText += geo[text[n]] || text[n]
    n++
  }
  return latinText
}

function latinizeNode(el) {
  el.textContent = latinizeText(el.textContent) // maybe in try/catch?
}

function convertDomNode(el) {
  forEach(getTextFromNode(el), latinizeNode)
}

/* observer */
function mutateRecord(mutationRecord) {
  if (mutationRecord.addedNodes.length === 0) return 0
  convertDomNode(mutationRecord.target)
}

function mutationWatcher(mutationsList) {
  forEach(mutationsList, mutateRecord) // slow perf (too many mutations)
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
