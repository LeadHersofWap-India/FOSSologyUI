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

import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import InputContainer from "../../../../components/Widgets/Input";
import Alert from "../../../../components/Widgets/Alert";
import Button from "../../../../components/Widgets/Button";
import { createGroup } from "../../../../services/groups";

const GroupCreate = () => {
  const initialMessage = {
    type: "success",
    text: "",
  };
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createGroup(groupName)
      .then(() => {
        setMessage({
          type: "success",
          text: "Successfully created the group",
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
  };
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
        <h1 className="font-size-main-heading">Add Group</h1>
        <br />
        <div className="row">
          <div className="col-12 col-lg-8">
            <form>
              <InputContainer
                type="text"
                name="name"
                id="admin-group-add-name"
                onChange={handleChange}
                placeholder="Group name"
                value={groupName}
              >
                Enter the groupname:
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
                  "Add"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCreate;
