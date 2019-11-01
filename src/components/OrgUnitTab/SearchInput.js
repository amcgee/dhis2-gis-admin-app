import React, { useState, useEffect } from 'react'
import { InputField } from '@dhis2/ui-core'

export const SearchInput = ({ onChange }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, 100)
        return () => {
            clearTimeout(timeout)
        }
    }, [onChange, value])

    return <InputField
        label="Search"
        name="search"
        value={value}
        placeholder="Search..."
        onChange={e => setValue(e.target.value)}
    />
}