/*
 Copyright (C) 2021 Aman Dwivedi (aman.dwivedi5@gmail.com)

 SPDX-License-Identifier: GPL-2.0

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 version 2 as published by the Free Software Foundation.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import InputContainer from "../../../../components/Widgets/Input";
import Alert from "../../../../components/Widgets/Alert";
import Button from "../../../../components/Widgets/Button";
import { getAllUsersName, deleteUser } from "../../../../services/users";

const DeleteUser = () => {
  const initialDeleteUserData = {
    id: 0,
    confirm: false,
  };
  const initialUsersList = [
    {
      id: 0,
      name: "string",
    },
  ];
  const initialMessage = {
    type: "success",
    text: "",
  };
  const [deleteUserData, setDeleteUserData] = useState(initialDeleteUserData);
  const [usersList, setUsersList] = useState(initialUsersList);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const { id, confirm } = deleteUserData;

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setDeleteUserData({
        ...deleteUserData,
        [e.target.name]: e.target.checked,
      });
    } else {
      setDeleteUserData({
        ...deleteUserData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirm) {
      setLoading(true);
      deleteUser(id)
        .then(() => {
          setMessage({
            type: "success",
            text: "Successfully deleted the user",
          });
        })
        .then(() => {
          getAllUsersName().then((res) => {
            setUsersList(res);
          });
        })
        .catch((error) => {
          setMessage({
            type: "danger",
            text: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
          setShowMessage(true);
        });
    } else {
      setMessage({
        type: "danger",
        text: "Deletion not confirmed",
      });
      setShowMessage(true);
    }
  };

  useEffect(() => {
    getAllUsersName()
      .then((res) => {
        setUsersList(res);
      })
      .catch((error) => {
        setMessage({
          type: "danger",
          text: error.message,
        });
        setShowMessage(true);
      });
  }, []);
  return (
    <>
      {showMessage && (
        <Alert
          type={message.type}
          setShow={setShowMessage}
          message={message.text}
        />
      )}
      <div className="main-container my-3">
        <h1 className="font-size-main-heading">Delete A User</h1>
        <br />
        <div className="row">
          <div className="col-12 col-lg-8">
            <p>
              Deleting a user removes the user entry from the FOSSology system.
              The user's name, account information, and password will be
              permanently removed. (There is no 'undo' to this delete.)
              <br />
              To delete a user, enter the following information:
            </p>

            <form>
              <InputContainer
                type="select"
                name="id"
                id="admin-users-delete-id"
                onChange={handleChange}
                options={usersList}
                value={id}
                property="name"
              >
                Select the user to delete:
              </InputContainer>
              <InputContainer
                type="checkbox"
                checked={confirm}
                name="confirm"
                id="admin-users-delete-confirm"
                onChange={handleChange}
              >
                Confirm user deletion
              </InputContainer>
              <Button type="submit" onClick={handleSubmit} className="mt-4">
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Delete"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
