/*
 Copyright (C) 2021 Shruti Agarwal (mail2shruti.ag@gmail.com)

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
import InputContainer from "../../../components/Widgets/Input";
import Alert from "../../../components/Widgets/Alert";
import Button from "../../../components/Widgets/Button";
import CommonFields from "../../../components/Upload/CommonFields";
import { Spinner } from "react-bootstrap";
import { getAllFolders } from "../../../services/folders";
import { createUploadVCS, getId, scheduleJobs } from "../../../services/upload";

const UploadFromVcs = () => {
  const initialState = {
    folderId: 1,
    uploadDescription: "",
    public: "protected",
    ignoreScm: false,
    uploadType: "vcs",
    groupName: "",
  };
  const initialScanFileData = {
    analysis: {
      bucket: true,
      copyrightEmailAuthor: false,
      ecc: false,
      keyword: false,
      mime: false,
      monk: false,
      nomos: false,
      ojo: false,
      package: false,
    },
    decider: {
      nomosMonk: false,
      bulkReused: false,
      newScanner: false,
      ojoDecider: false,
    },
    reuse: {
      reuseUpload: 0,
      reuseGroup: "",
      reuseMain: false,
      reuseEnhanced: false,
    },
  };
  const initialFolderList = [
    {
      id: 1,
      name: "Software Repository",
      description: "Top Folder",
      parent: null,
    },
  ];
  const typeVcs = [
    { id: "git", type: "Git" },
    { id: "svn", type: "SVN" },
  ];

  const initialVcsData = {
    vcsType: "git",
    vcsUrl: "",
    vcsBranch: "",
    vcsName: "",
    vcsUsername: "",
    vcsPassword: "",
  };
  let uploadId;

  const [uploadVcsData, setUploadFileData] = useState(initialState);
  const [folderList, setFolderList] = useState(initialFolderList);
  const [scanFileData, setScanFileData] = useState(initialScanFileData);
  const [vcsData, setVcsData] = useState(initialVcsData);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createUploadVCS(uploadVcsData, vcsData)
      .then((res) => {
        setMessage({
          type: "success",
          text: `The Upload has been queued its upload Id is #${res.message}`,
        });
        scrollTo({ top: 0 });
        uploadId = res.message;
      })
      .then(() => getId(uploadId, 10))
      .then(() =>
        setTimeout(
          () =>
            scheduleJobs(uploadVcsData.folderId, uploadId, scanFileData)
              .then(() => {
                setMessage({
                  type: "success",
                  text: "Analysis for the file is scheduled.",
                });
                scrollTo({ top: 0 });
                setUploadFileData(initialState);
                setScanFileData(initialScanFileData);
              })
              .catch((error) => {
                setMessage({
                  type: "danger",
                  text: error.message,
                });
                scrollTo({ top: 0 });
              }),
          200000
        )
      )
      .catch((error) => {
        setMessage({
          type: "danger",
          text: error.message,
        });
        scrollTo({ top: 0 });
      })
      .finally(() => {
        setLoading(false);
        setShowMessage(true);
      });
  };
  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setUploadFileData({
        ...uploadVcsData,
        [e.target.name]: e.target.checked,
      });
    } else if (e.target.type === "file") {
      setUploadFileData({
        ...uploadVcsData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setUploadFileData({
        ...uploadVcsData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleScanChange = (e) => {
    const name = e.target.name;
    if (
      Object.keys(scanFileData.analysis).find((analysis) => analysis === name)
    ) {
      setScanFileData({
        ...scanFileData,
        analysis: {
          ...scanFileData.analysis,
          [e.target.name]: e.target.checked,
        },
      });
    } else if (
      Object.keys(scanFileData.decider).find((decider) => decider === name)
    ) {
      setScanFileData({
        ...scanFileData,
        decider: {
          ...scanFileData.decider,
          [e.target.name]: e.target.checked,
        },
      });
    } else {
      setScanFileData({
        ...scanFileData,
        reuse: {
          ...scanFileData.reuse,
          [e.target.name]: e.target.checked,
        },
      });
    }
  };
  const handleVcsChange = (e) => {
    setVcsData({
      ...vcsData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    getAllFolders()
      .then((res) => {
        setFolderList(res);
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
          message={message.text}
          setShow={setShowMessage}
        />
      )}
      <div className="main-container my-3">
        <div className="row">
          <div className="col-lg-8 col-md-12 col-sm-12 col-12">
            <h3 className="font-size-main-heading">
              Upload From Version Control System
            </h3>
            <p className="font-demi my-3">
              To manage your own group permissions go into Admin &gt; Groups
              &gt; Manage Group Users. To manage permissions for this one
              upload, go to Admin &gt; Upload Permissions.
            </p>
            <p>
              You can upload source code from a version control system; one risk
              is that FOSSology will store your username/password of a
              repository to database, also run checkout source code from command
              line with username and password explicitly.
            </p>
            <form className="my-3">
              <InputContainer
                type="select"
                name="folderId"
                id="upload-folder-id"
                onChange={(e) => handleChange(e)}
                options={folderList}
                property="name"
                value={folderList?.id}
              >
                Select the folder for storing the uploaded files:
              </InputContainer>
              <InputContainer
                type="select"
                name="vcsType"
                id="upload-vcs-type"
                onChange={(e) => handleVcsChange(e)}
                options={typeVcs}
                property="type"
              >
                Select the type of version control system:
              </InputContainer>
              <InputContainer
                type="text"
                name="vcsUrl"
                id="upload-vcs-url-repo"
                onChange={(e) => handleVcsChange(e)}
                value={vcsData.vcsUrl}
              >
                Enter the URL of the repo:
              </InputContainer>
              <div className="font-size-small">
                Note: The URL can begin with HTTP://, HTTPS:// . When do git
                upload, if https url fails, please try http URL.
              </div>
              <InputContainer
                type="text"
                name="vcsBranch"
                id="upload-vcs-branch"
                onChange={(e) => handleVcsChange(e)}
                value={vcsData.vcsBranch}
              >
                (Optional for Git) Branch name:
              </InputContainer>
              <InputContainer
                type="text"
                name="vcsUsername"
                id="upload-vcs-username"
                onChange={(e) => handleVcsChange(e)}
                value={vcsData.vcsUsername}
              >
                (Optional) Username:
              </InputContainer>
              <InputContainer
                type="text"
                name="vcsPassword"
                id="upload-vcs-branch"
                onChange={(e) => handleVcsChange(e)}
                value={vcsData.vcsPassword}
              >
                (Optional) Password:
              </InputContainer>
              <InputContainer
                type="text"
                name="vcsName"
                id="upload-vcs-name"
                onChange={(e) => handleVcsChange(e)}
                value={vcsData.vcsName}
              >
                (Optional) Enter a viewable name for this file (directory):
              </InputContainer>
              <div className="font-size-small">
                Note: If no name is provided, then the uploaded file (directory)
                name will be used.
              </div>
              <div className="my-2">
                <label htmlFor="upload" className="font-demi font-15">
                  (Optional) Enter a description of this file:
                </label>
                <textarea
                  name="uploadDescription"
                  className="form-control"
                  value={uploadVcsData.uploadDescription}
                  id="upload-file-description"
                  rows="3"
                  onChange={(e) => handleChange(e)}
                ></textarea>
              </div>
              <CommonFields
                accessLevel={uploadVcsData.public}
                ignoreScm={uploadVcsData.ignoreScm}
                analysis={scanFileData.analysis}
                decider={scanFileData.decider}
                reuse={scanFileData.reuse}
                handleChange={handleChange}
                handleScanChange={handleScanChange}
              />
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
                  "Upload"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFromVcs;
