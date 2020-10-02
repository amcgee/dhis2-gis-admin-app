import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

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

    return (
        <InputField
            name="search"
            value={value}
            placeholder={i18n.t('Search...')}
            onChange={({ value }) => setValue(value)}
        />
    )
}

SearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
}
