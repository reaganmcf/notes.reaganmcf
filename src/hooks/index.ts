import { useState, useEffect } from "react"

export const useIntersection = (
  element: React.MutableRefObject<any>,
  rootMargin = "0px"
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    element && observer.observe(element.current)

    return () => observer.unobserve(element.current)
  }, [])

  return isVisible
}
