import React from "react"
export default ({ children }) => {
  return (
    <div className="inner-wrapper">
      <div className="content-wrapper container">
        {children}
      </div>
    </div>
  )
}