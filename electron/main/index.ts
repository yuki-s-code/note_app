import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import cors from "cors"
import { join } from 'node:path'
import express from "express"
import bodyParser from 'body-parser'
import { addUser, checkToken, getMyProfile, getUser, login, updateUser } from './server/database/login/login';
import {
  getFolder,
  editedFolderContents,
  getAllFolder,
  newBlocks,
  selectParent,
  selectDelete,
  // getDrawData,
  // editedDraw,
  // createDraw,
  getAllSortFolder,
  getTree,
  addRootCreateFolder,
  addRootCreateNote,
  addCreateFolder,
  addCreateNote,
  updateTree,
  updateTreeIcon,
  getTreeId,
  updateTreeSort,
  trashInsert,
  getAllTrash,
  updateTreeImage,
  updateTreeBookMarked,
  getDataSheet,
  editedDataSheetContents,
  getExcalidraw,
  editedExcalidrawContents,
  addJournals,
} from './server/database/note/note';
import {
  boardFollow,
  addBoardComment,
  editedBoardComment,
  editedBoardContents,
  getAllBoard,
  getBoard,
  getBoardFavorite,
  newBoard,
  boardDeleteFollow,
  getAllBoardHashtag,
} from './server/database/board/board'
import { addTask, findAllTask, taskAdd, taskContentsUpdate, taskDelete, taskReplace, taskUpdate, titleUpdate } from './server/database/task/task'

import { update } from './update'
import { addBotCreate, getAllBot, getCategoryBot, getCategoryInputBot, getInputBot } from './server/database/bot/bot'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

let secondaryWindow;
function createSecondaryWindow() {
  secondaryWindow = new BrowserWindow({
    title: 'Second window',
    //@
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secondaryWindow.loadURL('http://localhost:5173/secondary'); // 2番目のウィンドウ用のURL

  secondaryWindow.on('closed', () => {
    secondaryWindow = null;
  });
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  ipcMain.on('open-secondary-window', () => {
    createSecondaryWindow();
  });
  // Apply electron-updater
  update(win)
}


const expressApp = express();

expressApp.use(express.json());

expressApp.use(bodyParser.urlencoded({ extended: true, limit: "100mb"  }));

const port = 8088;

expressApp.listen(port, () => {
  // eslint-disable-next-line prefer-template, prettier/prettier
  console.log('App server started: http://localhost:'+port)
});
expressApp.use(cors())
expressApp.get('/sample', (req: any, res: any, next) => {
  // eslint-disable-next-line no-path-concat, prefer-template
  res.sendFile(__dirname + '/index.html');
});

expressApp.get('/login', (req: any, res: any) => {
  const { userid, passwd } = req.query;
  login(userid, passwd, (err: any, token: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, token, msg: '認証できました' });
  });
});

expressApp.get('/get_user', (req: any, res: any) => {
  const { userid } = req.query;
  getMyProfile(userid, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, docs, msg: '認証できました' });
  });
});

// eslint-disable-next-line consistent-return
expressApp.post('/adduser', (req: any, res: any) => {
  const { userid, passwd } = req.body;
  if (userid === '' || passwd === '') {
    return res.json({ status: false, msg: 'パラメーターが空です' });
  }
  getUser(userid, (user: any) => {
    if (user) {
      return res.json({ status: false, msg: 'すでにユーザーがいます' });
    }
    addUser(userid, passwd, (token: any) => {
      if (!token) {
        res.json({ status: false, msg: 'DBのエラー' });
      }
      res.json({ status: true, token, msg: '登録できました' });
    });
  });
});

expressApp.post("/api/user_updated", (req, res) => {
  const { user } = req.query;
  updateUser(user, (err: any, token: any) => {
    if (err) {
      res.json({ status: false, msg: '認証エラー' });
      return;
    }
    res.json({ status: true, token, msg: '認証できました' });
  });
});

expressApp.get("/api/add_friend", (req, res) => {
  const { userid, token, friendid }: any = req.query
  checkToken(userid, token, (err: any, user: any) => {
    if (err) {
      res.json({ status: false, msg: "認証エラー" });
      return;
    }
    user.friends[friendid] = true;
    updateUser(user, (err: any) => {
      if (err) {
        res.json({ status: false, msg: "DBエラー" });
        return;
      }
      res.json({ status: true });
    });
  });
});

//---------------note----------------------------------------------------
expressApp.get("/get_folder_tree", (req: any, res: any) => {
  getTree((err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    const rootData: any = [];
    const rootObject: any = {};
    const complexNote = {
      root: {
        index: "root",
        canMove: true,
        isFolder: true,
        children: [],
        data: { title: "無題", icon: "📝", image: "", type: "" },
        canRename: true,
      },
    }
    
    let updatedTreeItems: any;

    if(docs.length) {
      docs.forEach((t: any) => {
        if (t.roots) {
          rootData.push(t.index);
        }
        rootObject[t.index] = {
          index: t.index,
          canMove: t.canMove,
          isFolder: t.isFolder,
          children: t.children,
          data: t.data,
          canRename: t.canRename,
          bookmarks: t.bookmarks,
        };
      });
      updatedTreeItems = {
        ...complexNote,
        ...rootObject,
        root: {
          ...complexNote.root,
          children: rootData,
        },
      };
    }
    res.json({ status: true, docs, updatedTreeItems, msg: '検索できました。' });
  })
})

expressApp.get('/get_folder_tree_id', (req: any, res: any) => {
  const { index } = req.query;
  getTreeId(index, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_folder', (req: any, res: any) => {
  const { id } = req.query;
  getFolder(id, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_data_sheet', (req: any, res: any) => {
  const { id } = req.query;
  console.log(id)
  getDataSheet(id, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_excalidraw', (req: any, res: any) => {
  const { id } = req.query;
  getExcalidraw(id, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_folder_drawer', (req: any, res: any) => {
  const { id } = req.query;
  getFolder(id, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_all_folder', (req: any, res: any) => {
  getAllFolder((err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_all_sort_folder', (req: any, res: any) => {
  const { page } = req.query;
  getAllSortFolder(page, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/update_tree_sort', (req: any, res: any) => {
  const { index, target, data, parent, fileTree } = req.body;
  updateTreeSort(index, target, data, parent, fileTree, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/trash_insert', (req: any, res: any) => {
  const { index } = req.body;
  trashInsert(index, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.get('/get_all_trash', (req: any, res: any) => {
  const { page } = req.body;
  getAllTrash(page, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/add_root_create_folder', (req: any, res: any) => {
  const { items, uuid, type } = req.body;
  const { data} = items
  addRootCreateFolder(
    uuid,
    data,
    type,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/add_root_create_note', (req: any, res: any) => {
  const { items, uuid, type } = req.body;
  console.log(req.body)
  const { data } = items
  addRootCreateNote(
    uuid,
    data,
    type,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      console.log(docs)
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/add_journals', (req: any, res: any) => {
  const { items, uuid, type, journalData, pageLinks } = req.body;
  const { data } = items
  addJournals(
    uuid,
    data,
    type,
    journalData,
    pageLinks,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/add_create_folder', (req: any, res: any) => {
  const { index, parentId, type } = req.body;
  addCreateFolder(
    index,
    parentId,
    type,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/add_create_note', (req: any, res: any) => {
  const { index, parentId, type } = req.body;
  addCreateNote(
    index,
    parentId,
    type,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/update_tree', (req: any, res: any) => {
  const { index, data } = req.body;
  updateTree(
    index,
    data,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/update_tree_icon', (req: any, res: any) => {
  const { index, data } = req.body;
  updateTreeIcon(
    index,
    data,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/update_tree_image', (req: any, res: any) => {
  const { index, data } = req.body;
  updateTreeImage(
    index,
    data,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/update_tree_bookmarks', (req: any, res: any) => {
  const { index, data, trueToFalse } = req.body;
  updateTreeBookMarked(
    index,
    data,
    trueToFalse,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/edited_folder_contents', (req: any, res: any) => {
  const { id, contents, pageLinks  } = req.body;
  editedFolderContents(id, contents, pageLinks, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/edited_data_sheet', (req: any, res: any) => {
  const { id, contents  } = req.body;
  editedDataSheetContents(id, contents, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/edited_excalidraw', (req: any, res: any) => {
  const { id, contents  } = req.body;
  editedExcalidrawContents(id, contents, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/select_parent', (req: any, res: any) => {
  const { id, parentId } = req.body;
  selectParent(id, parentId, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }
    res.json({ status: true, docs, msg: '検索できました。' });
  });
});

expressApp.post('/new_blocks', (req: any, res: any) => {
  const { id, contents, user, editorTitle, icon } = req.body;
  newBlocks(
    id,
    contents,
    user,
    editorTitle,
    icon,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '検索できました。' });
    }
  );
});

expressApp.post('/select_delete', (req: any, res: any) => {
  const { id } = req.body;
  selectDelete(id, (docs: any) => {
    if (!docs) {
      res.json({ status: false, msg: '削除に失敗しました' });
    }
    res.json({ status: true, docs, msg: '削除できました' });
  });
});

// expressApp.get('/get_note_draw', (req: any, res: any) => {
//   const { id } = req.query;
//   getDrawData(id, (err: any, docs: any) => {
//     if (err) {
//       res.json({ status: false, msg: '検索できませんでした' });
//     }
//     res.json({ status: true, docs, msg: '検索できました' });
//   })
// })

// expressApp.post('/create_draw', (req: any, res: any) => {
//   const {
//     id,
//     snapshot,
//   } = req.body;
//   const {
//     schema,
//     store,
//   } = snapshot
//   createDraw(
//     id,
//     schema,
//     store,
//     (err: any, docs: any) => {
//     if (err) {
//       res.json({ status: false, msg: '検索できませんでした' });
//       return;
//     }
//     res.json({ status: true, docs, msg: '検索できました。' });
//   });
// });

// expressApp.post('/edited_draw', (req: any, res: any) => {
//   const {
//     id,
//     snapshot,
//   } = req.body;
//   const {
//     schema,
//     store,
//   } = snapshot
//   editedDraw(
//     id,
//     schema,
//     store,
//     (err: any, docs: any) => {
//     if (err) {
//       res.json({ status: false, msg: '検索できませんでした' });
//       return;
//     }
//     res.json({ status: true, docs, msg: '検索できました。' });
//   });
// });

expressApp.get('/get_all_search', (req: any, res: any) => {
  getAllFolder((err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
      return;
    }

    const textObjects: any = [];
    // テキストを抽出する再帰関数
    const extractText = (item: any) => {
      let textContent = '';
    
      // contentがある場合、その中のtextを抽出
      if (item.content && item.content instanceof Array) {
        textContent += item.content.map((textItem: any) => {
          if (textItem.type === 'text' && textItem.text) {
            return textItem.text;
          }
          if (textItem.children && textItem.children instanceof Array) {
            return extractText(textItem); // 再帰的に子要素を処理
          }
          return '';
        }).join('');
      }
    
      // childrenがある場合、その中のtextを抽出
      if (item.children && item.children instanceof Array) {
        textContent += item.children.map((childItem: any) => {
          return extractText(childItem); // 再帰的に子要素を処理
        }).join('');
      }
    
      return textContent;
    };
    
    docs.forEach((item: any) => {
      if (item.contents && item.contents instanceof Array) {
        // contentsからテキストを抽出
        const textContent = item.contents.map((contentItem: any) => {
          if (contentItem.type === 'table') { // テーブルの場合
            if (contentItem.content && contentItem.content.rows instanceof Array) {
              // テーブル内の各セルからテキストを抽出
              return contentItem.content.rows.map((row: any) => {
                return row.cells.map((cell: any) => {
                  return cell.map((textItem: any) => {
                    if (textItem.type === 'text' && textItem.text) {
                      return textItem.text;
                    }
                  }).join('');
                }).join('');
              }).join('');
            }
          } else { // テーブル以外の場合
            return extractText(contentItem);
          }
        }).join('');
        textObjects.push({ id: item.id, contents: textContent, updatedAt: item.updatedAt });
      }
    });
    const textOb = textObjects.length ? textObjects: [{id:"1", contents:"なし"}]
    res.json({ status: true, textOb, docs, msg: '検索できました。' });
  });
});

//-----------board------------------------------------------------------
expressApp.get('/get_board', (req: any, res: any) => {
  const { id } = req.query;
  getBoard(id, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
    }
    res.json({ status: true, docs, msg: '検索できました' });
  });
})

expressApp.get('/get_all_board', (req: any, res: any) => {
  const { page } = req.query;
  getAllBoard(page, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
    }
    res.json({ status: true, docs, msg: '検索できました' });
  });
})

expressApp.get('/get_hashtag', (req: any, res: any) => {
  getAllBoardHashtag((err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
    }
    res.json({ status: true, docs, msg: '検索できました' });
  });
})

expressApp.get('/get_board_favorite', (req: any, res: any) => {
  const { page, user } = req.query;
  getBoardFavorite(page, user, (err: any, docs: any) => {
    if (err) {
      res.json({ status: false, msg: '検索できませんでした' });
    }
    res.json({ status: true, docs, msg: '検索できました' });
  });
})

expressApp.post('/new_board', (req: any, res: any) => {
  const {
    contents,
    user,
    tag,
  } = req.body;
  newBoard(
    contents,
    user,
    tag,
    (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '追加できませんでした' });
        return;
      }
      res.json({ status: true, docs, msg: '追加できました。' });
    });
  })

  expressApp.post('/add_board_comment', (req: any, res: any) => {
    const {
      idx,
      boardComment,
    } = req.body;
    addBoardComment(idx, boardComment, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })
  expressApp.post('/edited_board_comment', (req: any, res: any) => {
    const {
      idx,
      boardComment,
    } = req.body;
    editedBoardComment(idx, boardComment, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/edited_board_contents', (req: any, res: any) => {
    const {
      contents,
      id,
      tag,
    } = req.body;
    editedBoardContents(contents, id,tag, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/edited_board_comment', (req: any, res: any) => {
    const {
      contents,
      _id,
    } = req.body;
    editedBoardComment(contents, _id, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/board_follow', (req: any, res: any) => {
    const {
      boardId,
      user,
    } = req.body;
    boardFollow(boardId, user, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/board_delete_follow', (req: any, res: any) => {
    const {
      boardId,
      user,
    } = req.body;
    boardDeleteFollow(boardId, user, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.get('/get_all_task', (req: any, res: any) => {
    findAllTask((err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/create_task', (req: any, res: any) => {
    const {
      id,
      title,
      tasks,
    } = req.body;
    addTask(id, title, tasks, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/edited_task_title', (req: any, res: any) => {
    const {
      id,
      title,
    } = req.body;
    titleUpdate(id, title, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/add_task', (req: any, res: any) => {
    const {
      id,
      text,
    } = req.body;
    taskAdd(id, text, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/edited_task', (req: any, res: any) => {
    const {
      id,
      task,
    } = req.body;
    taskUpdate(id, task, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/replace_task', (req: any, res: any) => {
    const {
      id,
      replaceId,
      task,
      replaceTask,
    } = req.body;
    taskReplace(id, replaceId, task, replaceTask, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/task_delete', (req: any, res: any) => {
    const {
      id,
    } = req.body;
    taskDelete(id, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })
  expressApp.post('/edited_task_contents', (req: any, res: any) => {
    const {
      task,
      replaceData,
    } = req.body;
    taskContentsUpdate(task, replaceData, (err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  //bot--------------------------------------------

  expressApp.get('/get_all_bot', (req: any, res: any) => {
    getAllBot((err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.get('/get_category_bot', (req: any, res: any) => {
    const {
      category,
    } = req.body;
    getCategoryBot(category,(err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.get('/get_input_bot', (req: any, res: any) => {
    const {
      input,
    } = req.body;
    getInputBot(input,(err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.get('/get_category_input_bot', (req: any, res: any) => {
    const {
      category,
      input,
    } = req.body;
    getCategoryInputBot(category,input,(err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

  expressApp.post('/add_bot_create', (req: any, res: any) => {
    const {
      uuid,
      category,
      question,
      answer,
      keywords,
      intent,
      entities,
      answerQuality,
      relatedFAQs,
    } = req.body;
    addBotCreate(
      uuid,
      category,
      question,
      answer,
      keywords,
      intent,
      entities,
      answerQuality,
      relatedFAQs,(err: any, docs: any) => {
      if (err) {
        res.json({ status: false, msg: '検索できませんでした' });
        return
      }
      res.json({ status: true, docs, msg: '検索できました' });
    });
  })

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})