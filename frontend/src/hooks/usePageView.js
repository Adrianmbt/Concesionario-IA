import { useEffect } from 'react'
import axios from 'axios'

const SESSION_ID = sessionStorage.getItem('sid') || (() => {
  const id = crypto.randomUUID()
  sessionStorage.setItem('sid', id)
  return id
})()

export function usePageView(page, vehicleId = null) {
  useEffect(() => {
    axios.post('/api/analytics/pageview', {
      page,
      vehicle_id: vehicleId || undefined,
      session_id: SESSION_ID,
    }).catch(() => {})
  }, [page, vehicleId])
}

export { SESSION_ID }
