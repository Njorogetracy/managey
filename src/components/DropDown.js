import React from 'react';
import { Dropdown } from 'react-bootstrap';
import dropStyles from '../styles/DropDown.module.css';
import { useNavigate } from 'react-router-dom';

/**Reusable three-dots trigger — circular hit area with hover state */
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <span
    ref={ref}
    className={dropStyles.Trigger}
    role="button"
    tabIndex={0}
    aria-label="more actions"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <i className="fa-solid fa-ellipsis-vertical" />
  </span>
));
ThreeDots.displayName = 'ThreeDots';

/**Functional component for the dropdown with edit and delete options */
export const DropDown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu
        className={dropStyles.Menu}
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={dropStyles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i className="fa-solid fa-pen-to-square" />
          <span>Edit</span>
        </Dropdown.Item>
        <Dropdown.Item
          className={`${dropStyles.DropdownItem} ${dropStyles.Delete}`}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className="fa-solid fa-trash" />
          <span>Delete</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export function ProfileEditDropdown({ id }) {
  const navigate = useNavigate();
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className={dropStyles.Menu}>
        <Dropdown.Item
          className={dropStyles.DropdownItem}
          onClick={() => navigate(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" />
          <span>Edit profile</span>
        </Dropdown.Item>
        <Dropdown.Item
          className={dropStyles.DropdownItem}
          onClick={() => navigate(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" />
          <span>Change username</span>
        </Dropdown.Item>
        <Dropdown.Item
          className={dropStyles.DropdownItem}
          onClick={() => navigate(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" />
          <span>Change password</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
