import React, { useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { database, storage } from '../firebase';
import moment from 'moment';

const DBContext = React.createContext();

export const useDB = () => {
  return useContext(DBContext);
};

export const ROOT_FOLDER = {
  name: 'root',
  id: 'root',
  parentId: null,
  path: [],
};

export const DBProvider = ({ children }) => {
  const [currentFolder, setCurrentFolder] = useState(ROOT_FOLDER);
  const [childFolders, setChildFolders] = useState([]);
  const [childFiles, setChildFiles] = useState([]);
  const [name, setName] = useState(''); // used for modal form input
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMsg, setAlertMsg] = useState('');

  const { currentUser } = useAuth();

  const selectFolder = (folderId) => {
    if (folderId === 'root') {
      setCurrentFolder((prev) => ROOT_FOLDER);
      return;
    }

    childFolders.forEach((childFolder, i) => {
      if (childFolder.id === folderId) {
        setCurrentFolder((prev) => ({
          name: childFolder.name,
          id: childFolder.id,
          parentId: childFolder.parentId,
          path: childFolder.path,
        }));
        return;
      }
    });

    currentFolder.path.forEach((folder) => {
      if (folderId === folder.id) {
        database.folders
          .where('userId', '==', currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (doc.id === folderId) {
                setCurrentFolder({
                  id: doc.id,
                  ...doc.data(),
                });
              }
            });
          })
          .catch(() => {});
      }
    });
  };

  // Only used for deleting single file
  const deleteFile = (fileId) => {
    database.files
      .doc(fileId)
      .get()
      .then((snapshot) => {
        const fileName = snapshot.data().name;

        let folderPath = [];

        currentFolder.path.forEach((folder) => {
          if (folder.id !== 'root') {
            folderPath.push(folder.id);
          }
        });

        const filePath = `${folderPath.join('/')}/${
          currentFolder.id !== 'root' ? currentFolder.id : ''
        }/${fileName}`;

        storage
          .ref(`/files/${currentUser.uid}/${filePath}`)
          .delete()
          .then(() => {
            // Alert Success

            database.files
              .doc(fileId)
              .delete()
              .then((snapshot) => {
                getChildFiles();
                handleAlert('success', 'File successfully deleted');
                // alert success
              })
              .catch((error) => {
                // alert error
                handleAlert('error', 'Oops! Something went wrong');
              });
          })
          .catch((error) => {
            // alert error
            handleAlert('error', 'Oops! Something went wrong');
          });
      });
  };

  const deleteFolder = (folderId, parentFolders = []) => {
    if (parentFolders.length < 1) {
      parentFolders.push(folderId);
    }
    database.folders
      .doc(folderId)
      .delete()
      .then(() => {
        getChildFolders();
      })
      .catch((error) => {
        console.log(error);
      });

    // Delete any files from the database within the target folder
    database.files
      .where('parentId', '==', folderId)
      .where('userId', '==', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let folderPath = [];

          currentFolder.path.forEach((folder) => {
            if (folder.id !== 'root') {
              folderPath.push(folder.id);
            }
          });

          if (!parentFolders.includes(folderId)) {
            parentFolders.push(folderId);
          }

          const filePath = `${folderPath.join('/')}/${parentFolders.join(
            '/'
          )}/${doc.data().name}`;

          storage
            .ref(`/files/${currentUser.uid}/${filePath}`)
            .delete()
            .then(() => {
              doc.ref.delete();
              getChildFiles();
            })
            .catch((error) => {});
        });
      });

    database.folders
      .where('parentId', '==', folderId)
      .where('userId', '==', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (parentFolders[parentFolders.length - 1] === folderId) {
            parentFolders.push(doc.id);
          } else {
            parentFolders = parentFolders.slice(0, parentFolders.length - 1);
            parentFolders.push(doc.id);
          }

          deleteFolder(doc.id, parentFolders);
          getChildFolders();
        });
        handleAlert('success', 'Folder successfully deleted');
      });
  };

  const getChildFolders = () => {
    const childFolders = [];

    database.folders
      .where('parentId', '==', currentFolder.id)
      .where('userId', '==', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          childFolders.push({ id: doc.id, ...doc.data() });
        });
        setChildFolders(childFolders.slice());
      })
      .catch(() => {});
  };

  const getChildFiles = () => {
    const childFiles = [];

    database.files
      .where('parentId', '==', currentFolder.id)
      .where('userId', '==', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          childFiles.push({ id: doc.id, ...doc.data() });
        });
        setChildFiles(childFiles.slice());
      })
      .catch(() => {});
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format('MMMM Do, YYYY');
  };

  const downloadFile = (fileId) => {
    database.files
      .where('userId', '==', currentUser.uid)
      .where('parentId', '==', currentFolder.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id === fileId) window.open(doc.data().url);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renameFolder = (folderId, folderName) => {
    database.folders
      .doc(folderId)
      .update({
        name: folderName,
      })
      .then(() => {
        getChildFolders();
        handleAlert('success', 'Folder name updated');
      })
      .catch((error) => handleAlert('error', 'Oops! Something went wrong'));
  };

  const handleAlert = (type, message) => {
    setAlertType(type);
    setAlertMsg(message);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  };

  //======================== Begin Context Menu ========================

  const handleContextMenu = (e, setOpen) => {
    e.preventDefault();

    const menu = document.getElementById('context-menu');

    // Displays folder options when right-click a folder
    childFolders.forEach((childFolder) => {
      if (e.target.innerText === childFolder.name) {
        const folderOptions = document.getElementsByClassName('folder');
        for (let option of folderOptions) {
          option.classList.remove('hidden');
        }

        const fileOptions = document.getElementsByClassName('file');
        for (let option of fileOptions) {
          if (!option.classList.contains('folder')) {
            option.classList.add('hidden');
          }
        }
      }
    });

    // Displays file options when right-click a file
    childFiles.forEach((childFile) => {
      if (e.target.innerText === childFile.name) {
        const fileOptions = document.getElementsByClassName('file');
        for (let option of fileOptions) {
          option.classList.remove('hidden');
        }

        const folderOptions = document.getElementsByClassName('folder');
        for (let option of folderOptions) {
          if (!option.classList.contains('file')) {
            option.classList.add('hidden');
          }
        }
      }
    });

    // ============ Delete handler ============
    const handleDelete = () => {
      childFolders.forEach((item) => {
        if (e.target.innerText === item.name) {
          deleteFolder(item.id);
        }
      });

      childFiles.forEach((item) => {
        if (e.target.innerText === item.name) {
          deleteFile(item.id);
        }
      });

      const deleteBtn = document.getElementById('delete');
      deleteBtn.removeEventListener('click', handleDelete);
      deleteBtn.setAttribute('listener', 'false');
    };

    // ============ Rename handler ============
    const handleRename = (e, setOpen) => {
      setOpen(true);
      childFolders.forEach((childFolder) => {
        if (e.target.innerText === childFolder.name) {
          renameFolder(childFolder.id);
        }
      });

      const renameBtn = document.getElementById('rename');
      renameBtn.removeEventListener('click', handleRename);
      renameBtn.setAttribute('listener', 'false');
    };

    // ======================== Handle context menu event listeners ========================
    // ============ Delete ============
    const deleteBtn = document.getElementById('delete');
    if (deleteBtn.getAttribute('listener') === 'true') {
      const newDeleteBtn = deleteBtn.cloneNode(true); // Clone node to remove event listeners
      deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
      newDeleteBtn.addEventListener('click', handleDelete);
    }

    if (deleteBtn.getAttribute('listener') !== 'true') {
      deleteBtn.addEventListener('click', handleDelete);
      deleteBtn.setAttribute('listener', 'true');
    }

    // ============ Rename ============
    const renameBtn = document.getElementById('rename');
    if (renameBtn.getAttribute('listener') === 'true') {
      const newRenameBtn = renameBtn.cloneNode(true); // Clone node to remove event listeners
      renameBtn.parentNode.replaceChild(newRenameBtn, renameBtn);
      newRenameBtn.addEventListener('click', handleRename);
    }

    if (renameBtn.getAttribute('listener') !== 'true') {
      renameBtn.addEventListener('click', handleRename);
      renameBtn.setAttribute('listener', 'true');
    }

    menu.classList.remove('active');
    menu.style.top = e.pageY + 'px';
    menu.style.left = e.pageX + 'px';

    // Show animation every time context menu is opened
    setTimeout(() => {
      menu.classList.add('active');
    }, 0);

    // Hide context menu when clicking off menu
    window.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  };

  //======================== End Context Menu ========================

  const value = {
    currentFolder,
    getChildFolders,
    getChildFiles,
    childFiles,
    childFolders,
    selectFolder,
    formatTime,
    deleteFolder,
    deleteFile,
    downloadFile,
    renameFolder,
    name,
    setName,
    handleAlert,
    setAlert,
    alert,
    setAlertType,
    alertType,
    setAlertMsg,
    alertMsg,
    handleContextMenu,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};
