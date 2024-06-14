import React from 'react';
import { Dropdown } from 'react-bootstrap';
import dropStyles from '../styles/DropDown.module.css';


const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-ellipsis-vertical"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));


export const DropDown = ({handleEdit, handleDelete}) => {
  return (
    <Dropdown className='ml-auto' drop='left'>
      <Dropdown.Toggle as={ThreeDots} >
      </Dropdown.Toggle>
      <Dropdown.Menu className='text-center'>
        <Dropdown.Item className={dropStyles.DropdownItem}
          onClick={handleEdit}
          aria-label='edit'
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </Dropdown.Item>
        <Dropdown.Item className={dropStyles.DropdownItem}
          onClick={handleDelete}
          aria-label='delete'
        >
          <i className="fa-solid fa-trash"></i>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
};