// app/providers.js
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init('phc_HshA9mCBW0nIJ5yB2XFlPjMNbeWL3aaVxMoTjHn2iU6', {
    api_host: 'https://us.i.posthog.com',
  })
}

export function PHProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}