// src/utils/ruleEngine.js
export function formatReferenceItem(item) {
    if (!item) return ''
    
    switch (item.type) {
      case 'order':
        return `${item.name || ''}：${item.content || ''}`
      case 'lab':
        return `${item.itemName || ''} ${item.value || ''}${item.unit || ''}`
      case 'imaging':
        return `${item.modality || ''}：${item.finding || ''}`
      case 'template':
        return item.name || ''
      default:
        return item.content || JSON.stringify(item)
    }
  }