// server/database/bot/bot.ts

import NeDB from 'nedb';
import path from 'path';

// 型定義
export interface Bot {
  id: string;
  category: string[]; // カテゴリーのIDまたは名前の配列
  intentId: string; // 関連するインテントのID
  questions: string[];
  answer: string;
  keywords: string[];
  relatedFAQs: string[];
}

export interface Category {
  id: string;
  category: string; // カテゴリー名
  color: string; // カラー情報
}

export interface Intent {
  id: string;
  name: string; // インテント名
  categoryId: string; // 関連するカテゴリーのID
  description?: string; // インテントの説明（任意）
}

// bot.ts に以下の関数を追加
export const getIntentById = async (id: string): Promise<Intent | null> => {
  const intent = await intentDBAsync.findOne({ id });
  return intent;
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
export const botDB = initializeDB<Bot>('data/bot.db');
export const botCategoryDB = initializeDB<Category>('data/botCategory.db');
export const intentDB = initializeDB<Intent>('data/intent.db');

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
    insert: (doc: T): Promise<T> => {
      return new Promise((resolve, reject) => {
        db.insert(doc, (err, newDoc) => {
          if (err) reject(err);
          else resolve(newDoc);
        });
      });
    },
    update: (query: any, update: any, options: any = {}): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numAffected) => {
          if (err) reject(err);
          else resolve(numAffected);
        });
      });
    },
    remove: (query: any, options: any = {}): Promise<number> => {
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
const botDBAsync = promisifyNeDB<Bot>(botDB);
const botCategoryDBAsync = promisifyNeDB<Category>(botCategoryDB);
const intentDBAsync = promisifyNeDB<Intent>(intentDB);

// すべてのボットをページネーション対応で取得
export const getAllBot = async (
  page: number,
  limit: number
): Promise<{ docs: Bot[]; total: number; page: number; totalPages: number }> => {
  const skip = (page - 1) * limit;
  const total = await botDBAsync.count({});

  const docs = await botDBAsync.find({}, { skip, limit });
  const totalPages = Math.ceil(total / limit);
  return { docs, total, page, totalPages };
};

// 新しいボットを追加
export const addBotCreate = async (botData: Bot): Promise<Bot> => {
  const newBot = await botDBAsync.insert(botData);
  return newBot;
};

// QAボットを更新
export const updateQABot = async (
  id: string,
  updateData: Partial<Bot>
): Promise<number> => {
  const numAffected = await botDBAsync.update({ id }, { $set: updateData }, {});
  return numAffected;
};

// 新しいカテゴリーを追加
export const insertBotCategory = async (categoryData: Category): Promise<Category> => {
  const existingCategory = await botCategoryDBAsync.findOne({ category: categoryData.category });
  if (existingCategory) {
    throw new Error('このカテゴリーはすでに存在します');
  }
  const newCategory = await botCategoryDBAsync.insert(categoryData);
  return newCategory;
};

// カテゴリーを更新
export const updateCategoryBot = async (
  id: string,
  updateData: Partial<Category>
): Promise<number> => {
  const numAffected = await botCategoryDBAsync.update({ id }, { $set: updateData }, {});
  return numAffected;
};

// すべてのカテゴリーを取得
export const getAllBotCategory = async (): Promise<Category[]> => {
  const categories = await botCategoryDBAsync.find({});
  return categories;
};

// すべてのインテントを取得
export const getAllIntents = async (): Promise<Intent[]> => {
  const intents = await intentDBAsync.find({});
  return intents;
};

// 新しいインテントを追加
export const addIntent = async (intentData: Intent): Promise<Intent> => {
  const existingIntent = await intentDBAsync.findOne({ id: intentData.id });
  if (existingIntent) {
    throw new Error('このインテントIDは既に存在します。');
  }
  const newIntent = await intentDBAsync.insert(intentData);
  return newIntent;
};

// インテントを削除
export const deleteIntent = async (id: string): Promise<number> => {
  const numRemoved = await intentDBAsync.remove({ id }, {});
  return numRemoved;
};

// **追加: カテゴリーIDに基づいてインテントを取得**
export const getIntentsByCategory = async (categoryId: string): Promise<Intent[]> => {
  const intents = await intentDBAsync.find({ categoryId });
  return intents;
};

// インテントを更新
export const updateIntent = async (
  id: string,
  updateData: Partial<Intent>
): Promise<number> => {
  const numAffected = await intentDBAsync.update({ id }, { $set: updateData }, {});
  return numAffected;
};


// Botを削除する関数を追加
export const deleteBot = async (id: string): Promise<number> => {
  const numRemoved = await botDBAsync.remove({ id }, {}); // オプションとして {} を使用
  return numRemoved;
};


// Promiseベースで再実装
export const getBotAllMessages = async (): Promise<Bot[]> => {
  const docs = await botDBAsync.find({});
  return docs;
};
