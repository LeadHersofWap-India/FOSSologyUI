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

import {
  getAllFoldersApi,
  getSingleFolderApi,
  createFolderApi,
  deleteFolderApi,
  editFolderApi,
  moveCopyFolderApi,
} from "../api/folders";

export function getAllFolders() {
  return getAllFoldersApi().then((res) => {
    return res;
  });
}

export function getSingleFolder(id) {
  return getSingleFolderApi(id).then((res) => {
    return res;
  });
}

export function deleteFolder({ id }) {
  return deleteFolderApi(id).then((res) => {
    return res;
  });
}

export function createFolder({ parentFolder, folderName, folderDescription }) {
  return createFolderApi(parentFolder, folderName, folderDescription).then(
    (res) => {
      return res;
    }
  );
}

export function editFolder({ name, description, id }) {
  return editFolderApi(name, description, id).then((res) => {
    return res;
  });
}

export function moveFolder({ parent, id }) {
  return moveCopyFolderApi(parent, id, "move").then((res) => {
    return res;
  });
}

export function copyFolder({ parent, id }) {
  return moveCopyFolderApi(parent, id, "copy").then((res) => {
    return res;
  });
}
