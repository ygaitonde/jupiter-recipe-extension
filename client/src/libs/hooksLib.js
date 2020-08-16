import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);
  //Simplify hooks for input fields for Auth
  return [
    fields,
    function(event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
}