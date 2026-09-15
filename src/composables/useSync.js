import { ref, onMounted, onUnmounted } from 'vue'

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzrECCLO9FFrlpdrFzOkci-aotgPe-XHe12KRgj-0w_OITamdA8n_w9BzPFpeFgB7yT/exec'
const QUEUE_KEY = 'nbk156_queue'

export function useSync() {
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)

  const updateOnline = () => {
    isOnline.value = navigator.onLine
    if (isOnline.value) flushQueue()
  }

  onMounted(() => {
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnline)
    window.removeEventListener('offline', updateOnline)
  })

  const sendPayload = async (payload) => {
    if (!isOnline.value) {
      queueOffline(payload)
      return { ok: false, offline: true }
    }
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      return { ok: json.status === 'ok' }
    } catch (e) {
      queueOffline(payload)
      return { ok: false, offline: true }
    }
  }

  const queueOffline = (payload) => {
    try {
      const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
      q.push(payload)
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
    } catch (e) {}
  }

  const flushQueue = async () => {
    if (!navigator.onLine || isSyncing.value) return
    try {
      const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
      if (!q.length) return
      isSyncing.value = true
      const sent = []
      for (const item of q) {
        const r = await sendPayload(item)
        if (r.ok) sent.push(item)
      }
      const remain = q.filter(p => !sent.includes(p))
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remain))
      isSyncing.value = false
    } catch (e) {
      isSyncing.value = false
    }
  }

  return { isOnline, sendPayload, flushQueue }
}
