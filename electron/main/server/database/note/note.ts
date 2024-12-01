// server/database/note/note.ts

import NeDB from 'nedb';
import path from 'path';

// インターフェース定義
export interface NoteTree {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: {
    title: string;
    icon: string;
    image: string;
    type: string;
  };
  canRename: boolean;
  roots: boolean;
  bookmarks: string[];
}

export interface NoteFolder {
  id: string;
  title: string;
  contents: any;
  pageLinks: string[];
  user: string;
  parent?: string;
}

export interface NoteDataSheet {
  id: string;
  contents: any;
  pageLinks: string[];
  user: string;
}

export interface NoteTrash {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: {
    title: string;
    icon: string;
    image: string;
    type: string;
  };
  canRename: boolean;
  roots: boolean;
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

// オプション型の定義
type UpdateOptions = {
  multi?: boolean;
  upsert?: boolean;
  returnUpdatedDocs?: boolean;
};

type RemoveOptions = {
  multi?: boolean;
};

// データベース初期化関数
function initializeDB<T>(filename: string): NeDB<T> {
  return new NeDB<T>({
    filename: path.join(__dirname, filename).replace('app.asar', 'app.asar.unpacked'),
    autoload: true,
    timestampData: true,
    onload: (err: any) => {
      console.log(`${filename} loaded`, err ? `Error: ${err}` : 'Success');
    },
  });
}

// データベースの初期化
export const noteTreeDB = initializeDB<NoteTree>('data/notetree.db');
export const noteFolderDB = initializeDB<NoteFolder>('data/notefolder.db');
export const noteDataSheetDB = initializeDB<NoteDataSheet>('data/notedatasheet.db');
export const noteTrashDB = initializeDB<NoteTrash>('data/notetrash.db');

// NeDB のメソッドを Promise 化
function promisifyNeDB<T>(db: NeDB<T>) {
  return {
    find: (query: any, options: any = {}): Promise<T[]> => {
      return new Promise((resolve, reject) => {
        let cursor = db.find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);
        cursor.exec((err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    },
    findOne: (query: any): Promise<T | null> => {
      return new Promise((resolve, reject) => {
        db.findOne(query, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
    },
    insert: ((doc: any): Promise<T | T[]> => {
      return new Promise((resolve, reject) => {
        db.insert(doc, (err: any, newDoc: T | T[]) => {
          if (err) reject(err);
          else resolve(newDoc);
        });
      });
    }) as {
      (doc: T): Promise<T>;
      (doc: T[]): Promise<T[]>;
    },
    update: (query: any, update: any, options: UpdateOptions = {}): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numAffected) => {
          if (err) reject(err);
          else resolve(numAffected);
        });
      });
    },
    remove: (query: any, options: RemoveOptions = {}): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
    },
    count: (query: any): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.count(query, (err, count) => {
          if (err) reject(err);
          else resolve(count);
        });
      });
    },
  };
}

// プロミス化した DB 操作オブジェクト
const noteTreeDBAsync = promisifyNeDB<NoteTree>(noteTreeDB);
const noteFolderDBAsync = promisifyNeDB<NoteFolder>(noteFolderDB);
const noteDataSheetDBAsync = promisifyNeDB<NoteDataSheet>(noteDataSheetDB);
const noteTrashDBAsync = promisifyNeDB<NoteTrash>(noteTrashDB);

// データ取得関数

export const getTree = async (): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({});
};

export const getTreeId = async (index: string): Promise<NoteTree[]> => {
  return await noteTreeDBAsync.find({ index });
};

export const getFolder = async (id: string): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({ id });
};

export const getDataSheet = async (id: string): Promise<NoteDataSheet[]> => {
  return await noteDataSheetDBAsync.find({ id });
};

export const getAllFolder = async (): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({}, { sort: { updatedAt: -1 } });
};

export const getAllSortFolder = async (limit: number): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({}, { sort: { updatedAt: -1 }, limit });
};

export const getParentFolder = async (parentId: string, value: string): Promise<NoteTree[]> => {
  const titleRegex = new RegExp(value, "g");
  return await noteTreeDBAsync.find({
    "data.title": titleRegex,
    parent: parentId,
  });
};

export const getMyParentFolder = async (myParentId: string): Promise<NoteFolder[]> => {
  return await noteFolderDBAsync.find({ id: myParentId });
};

// フォルダおよびノートの作成関数

export const addRootCreateFolder = async (
  uuid: string,
  data: { title: string; icon: string; image: string },
  type: string
): Promise<NoteFolder | null> => {
  try {
    const regDoc: NoteTree = {
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

    const regDocs: NoteFolder = {
      id: uuid,
      title: data.title,
      contents: {},
      pageLinks: [],
      user: "all",
    };

    await noteTreeDBAsync.insert(regDoc);
    const newDoc = await noteFolderDBAsync.insert(regDocs); // newDoc: NoteFolder
    return newDoc;
  } catch (error) {
    console.error("Error in addRootCreateFolder:", error);
    return null;
  }
};

export const addRootCreateNote = async (
  uuid: string,
  data: { title: string; icon: string; image: string },
  type: string
): Promise<NoteFolder | NoteDataSheet  | null> => {
  try {
    const regDoc: NoteTree = {
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

    await noteTreeDBAsync.insert(regDoc);

    let newDoc: NoteFolder | NoteDataSheet  | null = null;

    switch (type) {
      case "note":
      case "journals":
        newDoc = await noteFolderDBAsync.insert({
          id: uuid,
          title: data.title,
          contents: {},
          pageLinks: [],
          user: "all",
        }) as NoteFolder;
        break;
      case "sheet":
        newDoc = await noteDataSheetDBAsync.insert({
          id: uuid,
          contents: {},
          pageLinks: [],
          user: "all",
        }) as NoteDataSheet;
        break;
      default:
        console.error("Invalid type provided in addRootCreateNote");
        break;
    }

    return newDoc;
  } catch (error) {
    console.error("Error in addRootCreateNote:", error);
    return null;
  }
};

export const addJournals = async (
  uuid: string,
  data: { icon: string; image: string },
  type: string,
  journalData: any,
  pageLinks: { added: string[]; removed: string[] }
): Promise<NoteFolder | null> => {
  const { added, removed } = pageLinks;
  try {
    const regDoc: Partial<NoteTree> = {
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

    const regDocs: NoteFolder = {
      id: uuid,
      title: uuid,
      contents: journalData,
      pageLinks: [],
      user: "all",
    };

    await noteTreeDBAsync.update({ index: uuid }, regDoc, { upsert: true });
    await noteFolderDBAsync.update({ id: uuid }, regDocs, { upsert: true });

    // Handle pageLinks additions
    if (added.length) {
      const addPromises = added.map((id) =>
        noteFolderDBAsync.update({ id }, { $push: { pageLinks: uuid } }, {})
      );
      await Promise.all(addPromises);
    }

    // Handle pageLinks removals
    if (removed.length) {
      const removePromises = removed.map((id) =>
        noteFolderDBAsync.update({ id }, { $pull: { pageLinks: uuid } }, {})
      );
      await Promise.all(removePromises);
    }

    return regDocs;
  } catch (error) {
    console.error("Error in addJournals:", error);
    return null;
  }
};

export const addCreateFolder = async (
  index: string,
  parentId: string,
  type: string
): Promise<NoteFolder | null> => {
  try {
    const regDoc: NoteTree = {
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

    const regDocs: NoteFolder = {
      id: index,
      title: "無題",
      contents: {},
      pageLinks: [],
      user: "all",
      parent: parentId,
    };

    await noteTreeDBAsync.update({ index: parentId }, { $push: { children: index } }, {});
    await noteTreeDBAsync.insert(regDoc);
    await noteFolderDBAsync.insert(regDocs);
    return regDocs;
  } catch (error) {
    console.error("Error in addCreateFolder:", error);
    return null;
  }
};

export const addCreateNote = async (
  index: string,
  parentId: string,
  type: string
): Promise<NoteFolder | NoteDataSheet  | null> => {
  try {
    const icon = type === "note" ? "📝" : type === "excalidraw" ? "✏️" : "📄";

    const regDoc: NoteTree = {
      index,
      canMove: true,
      isFolder: false,
      children: [],
      data: {
        title: "無題",
        icon,
        image: '',
        type,
      },
      canRename: true,
      roots: false,
      bookmarks: [],
    };

    await noteTreeDBAsync.update({ index: parentId }, { $push: { children: index } }, {});
    await noteTreeDBAsync.insert(regDoc);

    let newDoc: NoteFolder | NoteDataSheet  | null = null;

    switch (type) {
      case "note":
        newDoc = await noteFolderDBAsync.insert({
          id: index,
          title: "無題",
          contents: {},
          pageLinks: [],
          user: "all",
          parent: parentId,
        }) as NoteFolder;
        break;
      case "sheet":
        newDoc = await noteDataSheetDBAsync.insert({
          id: index,
          contents: {},
          pageLinks: [],
          user: "all",
        }) as NoteDataSheet;
        break;
      default:
        console.error("Invalid type provided in addCreateNote");
        break;
    }

    return newDoc;
  } catch (error) {
    console.error("Error in addCreateNote:", error);
    return null;
  }
};

// ツリーの更新関数

export const updateTree = async (
  index: string,
  title: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.title": title } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTree:", error);
    return null;
  }
};

export const updateTreeIcon = async (
  index: string,
  icon: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.icon": icon } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeIcon:", error);
    return null;
  }
};

export const updateTreeImage = async (
  index: string,
  image: string
): Promise<number | null> => {
  try {
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.image": image } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeImage:", error);
    return null;
  }
};

export const updateTreeBookMarked = async (
  index: string,
  data: string,
  trueToFalse: boolean
): Promise<number | null> => {
  try {
    if (trueToFalse) {
      const numAffected = await noteTreeDBAsync.update(
        { index },
        { $push: { bookmarks: data } },
        {}
      );
      return numAffected;
    } else {
      const numAffected = await noteTreeDBAsync.update(
        { index },
        { $pull: { bookmarks: data } },
        {}
      );
      return numAffected;
    }
  } catch (error) {
    console.error("Error in updateTreeBookMarked:", error);
    return null;
  }
};

export const updateTreeType = async (
  index: string,
  type: string
): Promise<number | null> => {
  try {
    const typeItem = type == "folder"?true:false
    const numAffected = await noteTreeDBAsync.update(
      { index },
      { $set: { "data.type": type, isFolder:typeItem } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in updateTreeImage:", error);
    return null;
  }
};

// ツリーソートの更新関数
export const updateTreeSort = async (
  target: string,
  data: string[],
  fileTree: Record<string, string[]>
): Promise<{ success: boolean }> => {
  try {
    // すべての既存のツリーを更新
    const updatePromises = Object.keys(fileTree).map(async (key) => {
      if (key === "root") {
        return Promise.all(
          fileTree[key].map(async (d) => {
            return noteTreeDBAsync.update(
              { index: d },
              { $set: { roots: false } },
              {}
            );
          })
        );
      }
      return Promise.all(
        fileTree[key].map(async (childIndex) => {
          return noteTreeDBAsync.update(
            { index: key },
            { $pull: { children: childIndex } },
            {}
          );
        })
      );
    });

    await Promise.all(updatePromises);

    // ターゲットにアイテムを追加
    if (target === "root") {
      await Promise.all(
        data.map(async (d) => {
          return noteTreeDBAsync.update(
            { index: d },
            { $set: { roots: true } },
            {}
          );
        })
      );
    } else {
      await noteTreeDBAsync.update(
        { index: target },
        { $push: { children: { $each: data } } },
        {}
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateTreeSort:", error);
    return { success: false };
  }
};

// ゴミ箱関連関数

export const trashInsert = async (index: string): Promise<number | null> => {
  try {
    const docs: any = await noteTreeDBAsync.find({ index });
    if (docs.length === 0) return null;

    await noteTrashDBAsync.insert(docs);
    const numRemoved = await noteTreeDBAsync.remove({ index }, {});
    return numRemoved;
  } catch (error) {
    console.error("Error in trashInsert:", error);
    return null;
  }
};

export const getAllTrash = async (limit: number): Promise<NoteTrash[]> => {
  return await noteTrashDBAsync.find({}, { sort: { updatedAt: -1 }, limit });
};

// コンテンツ編集関数

export const editedFolderContents = async (
  id: string,
  contents: any,
  pageLinks: { added: string[]; removed: string[] }
): Promise<number | null> => {
  const { added, removed } = pageLinks;
  try {
    const update = { $set: { contents } };
    const numAffected = await noteFolderDBAsync.update({ id }, update, {});

    // Handle pageLinks additions
    if (added.length) {
      const addPromises = added.map((linkId) =>
        noteFolderDBAsync.update(
          { id: linkId },
          { $push: { pageLinks: id } },
          {}
        )
      );
      await Promise.all(addPromises);
    }

    // Handle pageLinks removals
    if (removed.length) {
      const removePromises = removed.map((linkId) =>
        noteFolderDBAsync.update(
          { id: linkId },
          { $pull: { pageLinks: id } },
          {}
        )
      );
      await Promise.all(removePromises);
    }

    return numAffected;
  } catch (error) {
    console.error("Error in editedFolderContents:", error);
    return null;
  }
};

export const editedDataSheetContents = async (
  id: string,
  contents: any
): Promise<number | null> => {
  try {
    const update = { $set: { contents } };
    const numAffected = await noteDataSheetDBAsync.update({ id }, update, {});
    return numAffected;
  } catch (error) {
    console.error("Error in editedDataSheetContents:", error);
    return null;
  }
};

// 新しいブロックの作成
export const newBlocks = async (
  id: string,
  contents: any,
  user: string,
  editorTitle: string,
  icon: string
): Promise<number | null> => {
  try {
    const regDoc: NoteFolder = {
      id,
      title: editorTitle,
      contents,
      pageLinks: [],
      user,
    };

    await noteFolderDBAsync.insert(regDoc);
    const numAffected = await noteTreeDBAsync.update(
      { index: id },
      { $set: { "data.title": editorTitle, "data.icon": icon } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in newBlocks:", error);
    return null;
  }
};

// 親フォルダの選択
export const selectParent = async (id: string, parentId: string): Promise<number | null> => {
  try {
    const numAffected = await noteFolderDBAsync.update(
      { id },
      { $set: { parent: parentId } },
      {}
    );
    return numAffected;
  } catch (error) {
    console.error("Error in selectParent:", error);
    return null;
  }
};

// フォルダの削除
export const selectDelete = async (id: string): Promise<number | null> => {
  try {
    await noteTreeDBAsync.remove({ index: id }, {});
    const numRemovedFolder = await noteFolderDBAsync.remove({ id }, {});
    return numRemovedFolder;
  } catch (error) {
    console.error("Error in selectDelete:", error);
    return null;
  }
};