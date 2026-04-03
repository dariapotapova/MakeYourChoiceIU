interface SearchInputProps {
    id?: string;
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function SearchInput({ id = 'search-input', label, value, placeholder, onChange }: SearchInputProps) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id = {id} value={value} placeholder = {placeholder}
                   onChange={(event) => onChange(event.target.value)} />
        </div>
    );
}