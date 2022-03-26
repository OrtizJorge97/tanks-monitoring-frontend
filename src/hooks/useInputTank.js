import { useState } from "react";

export default function useInputTank(initialValue) {
    const [value, setValue] = useState(initialValue);

    const bind = {
        value: null,
        onChange: (e) => {
            setValue(e.target.value);
        }
    }

    return [value, bind];
}