import React from 'react'
import Select from 'react-select' 

const CustomSelect = ({option,placeholder,disabled,setSelectedOptions,selectedOptions,star,isSearchable,isMulti}) => {
    const handleSelect=(data)=>{
        setSelectedOptions(data);
    }
  return (
    <div style={{marginTop:"10px",marginBottom:"10px"}}>
        <Select 
            className='sel'
            options={option}
            placeholder={placeholder}
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={isSearchable}
            isMulti={isMulti}
            isDisabled={disabled}
        />
    </div>
  )
}

export default CustomSelect