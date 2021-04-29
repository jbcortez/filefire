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
  const [menuTarget, setMenuTarget] = useState('');
  const [openRename, setOpenRename] = useState(false);
  const [openURL, setOpenURL] = useState(false);
  const [URL, setURL] = useState('');

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

  const openFile = (fileId) => {
    childFiles.forEach((childFile) => {
      if (fileId === childFile.id) {
        window.open(childFile.url);
      }
    });
  };

  const handleOpen = (menuTarget) => {
    childFolders.forEach((childFolder) => {
      if (menuTarget === childFolder.name) {
        selectFolder(childFolder.id);
      }
    });

    childFiles.forEach((childFile) => {
      if (menuTarget === childFile.name) {
        openFile(childFile.id);
      }
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

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    childFolders.forEach((childFolder) => {
      if (menuTarget === childFolder.name) {
        renameFolder(childFolder.id, name);
        setOpenRename(false);
        setName('');
      }
    });
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
  const handleDelete = (menuTarget) => {
    childFolders.forEach((item) => {
      if (menuTarget === item.name) {
        deleteFolder(item.id);
      }
    });

    childFiles.forEach((item) => {
      if (menuTarget === item.name) {
        deleteFile(item.id);
      }
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuTarget(e.target.innerText);

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

    const menu = document.getElementById('context-menu');
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

  const getURL = (menuTarget) => {
    childFiles.forEach((childFile) => {
      if (menuTarget === childFile.name) {
        setURL(childFile.url);
      }
    });
  };

  const downloadFile = (url, menuTarget) => {
    const link = document.createElement('a');
    link.download = menuTarget;
    link.href = url;
    link.click();
  };

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
    openFile,
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
    menuTarget,
    handleRenameSubmit,
    handleDelete,
    openRename,
    setOpenRename,
    handleOpen,
    openURL,
    setOpenURL,
    getURL,
    setURL,
    URL,
    downloadFile,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};
