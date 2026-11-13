import { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { getEmployees } from "./EmpoyeeApi"; // your existing API function

export default function EmployeeSearch({ value, onChange, error, helperText }) {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!inputValue.trim()) {
            setOptions([]);
            return;
        }
        // debounce: wait 300ms after the user stops typing
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getEmployees({ fullName: inputValue, page: 1, pageSize: 10 });
                setOptions(res.data ?? res.items ?? []); // adjust to your response shape
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer); // cancel the previous timer on each keystroke
    }, [inputValue]);

    return (
        <Autocomplete
            options={options}
            value={value}                                   // the selected employee object (or null)
            onChange={(e, newValue) => onChange(newValue)}  // newValue is the employee object or null
            inputValue={inputValue}
            onInputChange={(e, newInput) => setInputValue(newInput)}
            getOptionLabel={(o) => o.FullName ?? ""}
            isOptionEqualToValue={(o, v) => o.Id === v.Id}
            filterOptions={(x) => x}   // the server already filtered, so skip client filtering
            loading={loading}
            noOptionsText="No employees found"
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Employee Name"
                    required
                    name="employeeId"

                />
            )}
        />
    );
}