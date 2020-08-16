import React from "react";
import "./NotFound.css";
import { useHistory} from "react-router-dom";

export default function NotFound() {
  const history = useHistory()
  return (
    <div className="NotFound">
      <h3>Error 404: Page not found</h3>
      {history.push("/")}
    </div>
  );
}