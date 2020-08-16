import React from "react";
import "./NotFound.css";
import { useHistory} from "react-router-dom";

export default function NotFound() {
  //Users shouldn't be able to access pages that would cause a 404 if using the extension normally, but
  //in case they end up somewhere they shouldn't, redirect to home
  const history = useHistory()
  return (
    <div className="NotFound">
      <h3>Error 404: Page not found</h3>
      {history.push("/")}
    </div>
  );
}