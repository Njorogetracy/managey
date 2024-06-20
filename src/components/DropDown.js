import React from 'react';
import { Dropdown } from 'react-bootstrap';
import dropStyles from '../styles/DropDown.module.css';
import { useNavigate } from 'react-router-dom';

/**This reusable component handles the delete and edit icons */
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
ThreeDots.displayName = 'ThreeDots'; 

/**Functional component for the dropdown with edit and delete options */
export const DropDown = ({handleEdit, handleDelete}) => {
  return (
    <Dropdown className='ml-auto' drop='left'>
      <Dropdown.Toggle as={ThreeDots} >
      </Dropdown.Toggle>
      <Dropdown.Menu className='text-center' popperConfig={{ strategy: "fixed" }}>
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

export function ProfileEditDropdown({ id }) {
  const navigate = useNavigate();
  return (
    <Dropdown className='ml-auto' drop='left'>
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" />
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" />
          change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}