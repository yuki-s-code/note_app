// const { app } = require('electron');
const NeDB = require('nedb');
const path = require('path');

export const noteTreeDB = new NeDB({
  filename: path.join(__dirname, 'data/notetree.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('noteTreeDB start', err);
  },
});

export const noteFolderDB = new NeDB({
  filename: path.join(__dirname, 'data/notefolder.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('noteFolderDB start', err);
  },
});

export const noteDataSheetDB = new NeDB({
  filename: path.join(__dirname, 'data/notedatasheet.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('noteDataSheetDB start', err);
  },
});

export const noteExcalidrawDB = new NeDB({
  filename: path.join(__dirname, 'data/noteexcalidraw.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('noteExcalidraw start', err);
  },
});

export const noteTrashDB = new NeDB({
  filename: path.join(__dirname, 'data/notetrash.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('noteTrashDB start', err);
  },
});

// export const noteFolderDB = new NeDB({
//   filename: "note/notefolder.db",
//   timestampData: true,
//   autoload: true,
//   onload: (err: any) => {
//   console.log('noteFolderDB start', err);
//   },
// })

// export const noteTreeDB = new NeDB({
//   filename: "note/notetree.db",
//   timestampData: true,
//   autoload: true,
//   onload: (err: any) => {
//   console.log('noteTreeDB start', err);
//   },
// })

export const getTree = (callback: any) => {
  noteTreeDB.find({}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

export const getTreeId = (index: any, callback: any) => {
  noteTreeDB.find({index}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

export const getFolder = (id: string, callback: any) => {
  noteFolderDB.find({ id }, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getDataSheet = (id: string, callback: any) => {
  noteDataSheetDB.find({ id }, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getExcalidraw = (id: string, callback: any) => {
  noteExcalidrawDB.find({ id }, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getAllFolder = (callback: any) => {
  noteFolderDB.find({}).sort({updatedAt: -1}).exec((err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const getAllSortFolder = (page: number, callback: any) => {
  noteFolderDB.find({}).sort({updatedAt: -1}).skip(0).limit(page).exec((err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
};

export const getParentFolder = (
  parentId: any,
  value: any,
  callback: any,
  ) => {
    const title = RegExp(value,"g")
    noteFolderDB.find({parent: parentId, title}, (err: any, docs: any) => {
      if (err) return callback(err, null);
        callback(null, docs);
    });
  };

export const getMyParentFolder = (
  myParentId: any,
  callback: any,
  ) => {
    noteFolderDB.find({id: myParentId},(er: any, docs: any) => {
      if(er) return callback(er, null);
      callback(null, docs);
    });
  };

export const addRootCreateFolder = (
  uuid: string,
  data: any,
  type: any,
  callback: any,
) => {
  const regDoc = {
    index: uuid,
    canMove: true,
    isFolder: true,
    children: [],
    data: {
      title: data.title,
      icon: data.icon,
      image: data.image,
      type,
    },
    canRename: true,
    roots: true,
    bookmarks: [],
  };
  const regDocs = {
    id: uuid,
    contents: {},
    pageLinks: [],
    user: "all",
  };
  noteTreeDB.insert(regDoc, (er: any, doc: any) => {
    if (er) return callback(null);
    noteFolderDB.insert(regDocs, (err: any, newDoc: any) => {
      if(err) return callback(null)
      callback(newDoc);
    })
    });
}

export const addRootCreateNote = (
  uuid: string,
  data: any,
  type: any,
  callback: any,
) => {
  const regDoc = {
    index: uuid,
    canMove: true,
    isFolder: false,
    children: [],
    data: {
      title: data.title,
      icon: data.icon,
      image: data.image,
      type,
    },
    canRename: true,
    roots: true,
    bookmarks: [],
  };
  const regDocs = {
    id: uuid,
    contents: {},
    pageLinks: [],
    user: "all",
  };
  noteTreeDB.insert(regDoc, (er: any, doc: any) => {
    if (er) return callback(null);
    if(type == "note") {
      noteFolderDB.insert(regDocs, (err: any, newDoc: any) => {
        if(err) return callback(null)
        callback(newDoc);
      })
    } else if (type == "sheet") {
      noteDataSheetDB.insert(regDocs, (err: any, newDoc: any) => {
        if(err) return callback(null)
        callback(newDoc);
      })
    } else if (type =="excalidraw"){
      noteExcalidrawDB.insert(regDocs, (err: any, newDoc: any) => {
        if(err) return callback(null)
        callback(newDoc);
      })
    } else if (type == "journals") {
      noteFolderDB.insert(regDocs, (err: any, newDoc: any) => {
        if(err) return callback(null)
        callback(newDoc);
      })
    } else {
      console.log("type: error")
    }
  });
}


export const addJournals = (
  uuid: string,
  data: any,
  type: any,
  journalData: any,
  pageLinks: any,
  callback: any,
) => {
  const regDoc = {
    index: uuid,
    canMove: true,
    isFolder: false,
    children: [],
    data: {
      title: uuid,
      icon: data.icon,
      image: data.image,
      type,
    },
    canRename: true,
    roots: true,
    bookmarks: [],
  };
  const regDocs = {
    id: uuid,
    contents: journalData,
    pageLinks:[],
    user: "all",
  };
  const {added, removed} = pageLinks
  noteTreeDB.update({index: uuid}, regDoc, {upsert: true}, (er: any, doc: any) => {
    if (er) return callback(null);
    noteFolderDB.update({id: uuid}, regDocs, {upsert: true}, (err: any, newDoc: any) => {
      if(err) return callback(null)
        if(added.length) {
          added.forEach((i: any) => {
            noteFolderDB.update(
              { id: i },
              { $push: { pageLinks: uuid}},
              {},
              (addErr: any, addNewDoc: any) => {
              if(err) return callback(null)
            })
          })
        }
        if(removed.length) {
          removed.forEach((i: any) => {
            noteFolderDB.update(
              { id: i },
              { $pull: { pageLinks: uuid}},
              {},
              (addErr: any, addNewDoc: any) => {
              if(err) return callback(null)
            })
          })
        }
      callback(newDoc);
    })
  });
}

export const addCreateFolder = (
  index: string,
  parentId: string,
  type: any,
  callback: any,
) => {
  const regDoc = {
    index,
    canMove: true,
    isFolder: true,
    children: [],
    data: {
      title: "無題",
      icon: "📓",
      image: '',
      type,
    },
    canRename: true,
    roots: false,
    bookmarks: [],
  };
  const regDocs = {
    id: index,
    contents: {},
    pageLinks: [],
    user: "all",
  };
  noteTreeDB.update(
    { index: parentId },
    { $push: { children: index } },
    {},
    (er: any, newd: any) => {
      if (er) return callback(null);
      noteTreeDB.insert(regDoc, (errr: any, newDocs: any) => {
        if (errr) return callback(null);
        noteFolderDB.insert(regDocs, (err: any, newDoc: any) => {
          if(err) return callback(null)
          callback(newDoc);
        })
      })
  });
}

export const addCreateNote = (
  index: string,
  parentId: string,
  type: any,
  callback: any,
) => {
  const regDoc = {
    index,
    canMove: true,
    isFolder: false,
    children: [],
    data: {
      title: "無題",
      icon: "📝",
      image: '',
      type,
    },
    canRename: true,
    roots: false,
    bookmarks: [],
  };
  const regDocs = {
    id: index,
    contents: {},
    pageLinks: [],
    user: "all",
  };
  noteTreeDB.update(
    { index: parentId },
    { $push: { children: index } },
    {},
    (er: any, newd: any) => {
      if (er) return callback(null);
      noteTreeDB.insert(regDoc, (errr: any, newDocs: any) => {
        if (errr) return callback(null);
        if(type == "note") {
          noteFolderDB.insert(regDocs, (err: any, newDoc: any) => {
            if(err) return callback(null)
            callback(newDoc);
          })
        } else if (type == "sheet") {
          noteDataSheetDB.insert(regDocs, (err: any, newDoc: any) => {
            if(err) return callback(null)
            callback(newDoc);
          })
        } else if (type == "excalidraw") {
          noteExcalidrawDB.insert(regDocs, (err: any, newDoc: any) => {
            if(err) return callback(null)
            callback(newDoc);
          })
        } else {
          console.log("type: error")
        }
      })
  });
}

export const updateTree = (
  index: string,
  data: any,
  callback: any,
) => {
  noteTreeDB.update({ index }, { $set: { "data.title": data } }, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
}

export const updateTreeIcon = (
  index: string,
  data: any,
  callback: any,
) => {
  noteTreeDB.update({ index }, { $set: { "data.icon": data } }, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
}

export const updateTreeImage = (
  index: string,
  data: any,
  callback: any,
) => {
  noteTreeDB.update({ index }, { $set: { "data.image": data } }, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
}

export const updateTreeBookMarked = (
  index: string,
  data: any,
  trueToFalse: any,
  callback: any,
) => {
  if(trueToFalse) {
    noteTreeDB.update({ index }, { $push: { bookmarks: data } }, {}, (err: any, newdoc: any) => {
      if (err) return callback(null);
      callback(newdoc);
    });
  } else {
    noteTreeDB.update({ index }, { $pull: { bookmarks: data } }, {}, (err: any, newdoc: any) => {
      if (err) return callback(null);
      callback(newdoc);
    });
  }
}

export const updateTreeSort = (
  index: any,
  target: string,
  data: any,
  parent: string,
  fileTree: any,
  callback: any) => {
  Object.keys(fileTree).map((key: any) => {
    if(key=="root") {
      data.forEach((d: any) => {
        noteTreeDB.update(
          { index: d },
          { $set: { "roots": false } },
          {},
          (err: any, newdoc: any) => {
          if (err) return callback(null);
        })
      })
    } else {
      noteTreeDB.update(
        { index: key },
        { $pull: { "children": { $in : fileTree[key] }}},
        {},
        (errr: any, news: any) => {
        if(errr) return callback(null)
      })
    }
  })
  if(target == "root") {
    data.forEach((d: any) => {
      noteTreeDB.update(
        { index: d },
        { $set: { "roots": true } },
        {},
        (err: any, newdoc: any) => {
        if (err) return callback(null);
        callback(newdoc);
      })
    })
  } else {
    noteTreeDB.update(
      { index: target },
      { $push: { "children": { $each: data } } },
      {},
      (err: any, newdoc: any) => {
      if (err) return callback(null);
      callback(newdoc);
    })
  }
}

export const trashInsert = (index: string, callback: any) => {
  noteTreeDB.find({ index }, (err: any, docs: any) => {
    if (err) return callback(err, null);
    noteTrashDB.insert(docs, (error: any, newdocs: any) => {
      if(error) return callback(error, null);
    })
    noteTreeDB.remove({ index }, (er: any, deletedocs: any) => {
      if (er) return callback(er, null);
      callback(deletedocs);
    })
  });
};

export const getAllTrash = (page: number, callback: any) => {
  noteTrashDB.find({}).sort({updatedAt: -1}).skip(0).limit(page).exec((err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
};

//----------------------------------------------------------------------------------

export const editedFolderContents = (id: any, contents: any, pageLinks: any ,callback: any) => {
  const {added, removed} = pageLinks
  const update = {
    $set: { contents },
  };
  noteFolderDB.update(
    { id },
    update,
    {},
    (err: any, newdoc: any) => {
    if (err) return callback(null);
    if(added.length) {
      added.forEach((i: any) => {
        noteFolderDB.update(
          { id: i },
          { $push: { pageLinks: id}},
          {},
          (addErr: any, addNewDoc: any) => {
          if(err) return callback(null)
        })
      })
    }
    if(removed.length) {
      removed.forEach((i: any) => {
        noteFolderDB.update(
          { id: i },
          { $pull: { pageLinks: id}},
          {},
          (addErr: any, addNewDoc: any) => {
          if(err) return callback(null)
        })
      })
    }
    callback(newdoc);
  });
};

export const editedDataSheetContents = (id: any, contents: any, callback: any) => {
  const update = {
    $set: { contents },
  };
  noteDataSheetDB.update({ id }, update, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
};

export const editedExcalidrawContents = (id: any, contents: any, callback: any) => {
  const update = {
    $set: { contents },
  };
  noteExcalidrawDB.update({ id }, update, {}, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
};

export const newBlocks = (
  id: string,
  contents: any,
  user: string,
  editorTitle: any,
  icon: any,
  callback: any
) => {
  const regDoc = {
    id,
    contents,
    user,
  };
  const update = {
    $set: {"data.title": editorTitle, "data.icon": icon}
  };
  noteFolderDB.insert(regDoc, (err: any, newdocs: any) => {
    if (err) return callback(null);
    noteTreeDB.update({index: id}, update, {}, (errs: any, newdoc: any) => {
      if (errs) return callback(null)
      callback(newdoc)
    })
  });
};

export const selectParent = (id: any, parentId: any, callback: any) => {
  noteFolderDB.update(
    { id },
    { $set: { parent: parentId } },
    {},
    (err: any, newdoc: any) => {
      if (err) return callback(null);
      callback(newdoc);
    }
  );
};

export const selectDelete = (id: any, callback: any) => {
  noteTreeDB.remove({index: id}, (er: any, docs: any) => {
    if (er) return callback(null);
    noteFolderDB.remove({ id }, (err: any, n: any) => {
      if (err) return callback(null);
      callback(n);
    });
  })
};

// export const getDrawData = (
//   id: string,
//   callback: any) => {
//     noteDrawDB.find({ id }, (err: any, docs: any) => {
//       if (err) return callback(err, null);
//       callback(null, docs);
//     });
// };

// export const editedDraw = (
//   id: string,
//   schema: any,
//   store: any,
//   callback: any) => {
//   const update = {
//     $set: { schema, store },
//   };
//   noteDrawDB.update({ id }, update, {}, (err: any, newdoc: any) => {
//     if (err) return callback(null);
//     callback(newdoc);
//   });
// };

// export const createDraw = (
//   id: string,
//   schema: any,
//   store: any,
//   callback: any) => {
//     const regDoc = {
//       id,
//       schema,
//       store
//     };
//   noteDrawDB.insert(regDoc, (err: any, newdoc: any) => {
//     if (err) return callback(null);
//     callback(newdoc);
//   });
// };
