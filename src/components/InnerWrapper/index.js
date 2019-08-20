import React from "react"
const InnerWrapper = ({ children }) => {
  return (
    <div className="inner-wrapper">
      <div className="content-wrapper container">
        {children}
      </div>
    </div>
  )
}

export default InnerWrapper;