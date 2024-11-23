import React from "react";

const AppHeading = () => {
  return (
    <>
      <div className="app-name-container">
        <h1 className="app-name">
          {process.env.REACT_APP_NAME}{" "}
          <span className="app-version">
            {process.env.REACT_APP_VERSION
              ? `- ${process.env.REACT_APP_VERSION}`
              : ""}
          </span>
        </h1>
      </div>
      {process.env.REACT_APP_FOR && <div className="app-for">{process.env.REACT_APP_ONEX} - {process.env.REACT_APP_FOR}</div>}
    </>
  );
};

export default AppHeading;
