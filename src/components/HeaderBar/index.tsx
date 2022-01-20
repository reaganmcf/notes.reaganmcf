import React, { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useIntersection } from "./../../hooks"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

interface HeaderBarProps {
  title: string
  date: string
}

const HeaderBarInner: React.FC<HeaderBarProps> = ({ title, date }) => {
  return (
    <div className="w-full h-full flex items-center shadow bg-white bg-opacity-90">
      <div className="flex-none">
        <p className="text-xl py-4 pl-4 font-semibold">{title}</p>
        {/*<FontAwesomeIcon icon="" color="black" />*/}
      </div>
      <div className="flex-grow"></div>
      <div className="flex-none">
        <p className="pr-4 font-thin">{date}</p>
      </div>
    </div>
  )
}

const HeaderBar: React.FC<HeaderBarProps> = props => {
  const headerBarRef = useRef<HTMLDivElement>(null)

  const [stickyHeader, setStickyHeader] = useState(false)

  const inViewport = useIntersection(headerBarRef, "150px") // Trigger as soon as the element becomes visible

  useEffect(() => {
    setStickyHeader(!inViewport)
  }, [inViewport])

  return (
    <>
      <div
        ref={headerBarRef}
        className="w-full h-20"
        style={{
          visibility: stickyHeader ? "hidden" : "visible",
        }}
      >
        <HeaderBarInner {...props} />
      </div>

      <div
        className="fixed h-20 top-0 z-30 w-full"
        style={{
          visibility: stickyHeader ? "visible" : "hidden",
          transition: `all ${stickyHeader ? ".35s" : ".2s"} ${
            stickyHeader ? "cubic-bezier(.23,.1,.32,1)" : "ease-out"
          }`,
          transform: stickyHeader ? "none" : "translate(0, -100%)",
        }}
      >
        <HeaderBarInner {...props} />
      </div>
    </>
  )
}

export default HeaderBar
