import { useCallback } from 'react'

export default function ImageWithFallback({ src, alt = '', className = '', fallbackSrc = '/images/hero-placeholder.svg', ...rest }){
  const onError = useCallback((e) => {
    const target = e.currentTarget
    if (target.dataset.fallbackApplied === 'true') return
    target.dataset.fallbackApplied = 'true'
    target.src = fallbackSrc
  }, [fallbackSrc])

  return (
    <img src={src} alt={alt} onError={onError} className={className} loading="lazy" decoding="async" {...rest} />
  )
}
