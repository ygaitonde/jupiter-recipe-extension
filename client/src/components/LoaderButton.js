import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className='',
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`${className} LoaderButton`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
      {props.children}
    </Button>
  );
}