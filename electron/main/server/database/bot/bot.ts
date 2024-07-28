const NeDB = require('nedb');
const path = require('path');

export const botDB = new NeDB({
  filename: path.join(__dirname, 'data/bot.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('botDB start', err);
  },
});

//全てを検索
export const getAllBot = (callback: any) => {
  botDB.find({}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

//カテゴリーの検索
export const getCategoryBot = (category: any, callback: any) => {
  botDB.find({category}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

//キーワードの検索
export const getInputBot = (input: any, callback: any) => {
  botDB.find({keywords: {$in: input}}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

//複合の検索
export const getCategoryInputBot = (category: any, input: any, callback: any) => {
  botDB.find({ category, keywords: {$in: input}}, (err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  })
}

export const addBotCreate = (
  uuid: string,
  category: any,
  question: any,
  answer: any,
  keywords: any,
  intent: any,
  entities: any,
  answerQuality: any,
  relatedFAQs: any,
  callback: any,
) => {
  const regDocs = {
    id: uuid,
    category,
    question,
    answer,
    keywords,
    intent,
    entities,
    answerQuality,
    relatedFAQs,
  };
  botDB.insert(regDocs, (er: any, doc: any) => {
    if (er) return callback(null);
  });
}