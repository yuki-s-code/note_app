//routes/services/bots.ts

import express from 'express';
import { addBotCreate, addIntent, deleteBot, deleteIntent, getAllBot, getAllBotCategory, getAllIntents, getBotAllMessages, getIntentsByCategory, insertBotCategory, updateCategoryBot, updateIntent, updateQABot } from '../database/bot/bot';
const { NlpManager } = require('node-nlp');
import PQueue from 'p-queue';

const expressApp = express.Router();


  //bot--------------------------------------------

// すべてのボットを取得
expressApp.get('/get_all_bot', async (req: any, res: any) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // ページ番号とリミットの検証
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      res.status(400).json({ status: false, msg: '無効なページ番号またはリミットです。' });
      return;
    }

    const data = await getAllBot(pageNum, limitNum);
    res.json({ status: true, data, msg: '検索できました' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

// すべてのボットカテゴリーを取得
expressApp.get('/get_all_bot_category', async (req: any, res: any) => {
  try {
    const docs = await getAllBotCategory();
    res.json({ status: true, docs, msg: '検索できました' });
  } catch (err: any) {
    res.json({ status: false, msg: '検索できませんでした', error: err.message });
  }
});

// トレーニングキューの初期化
const queue = new PQueue({ concurrency: 1 });
// NLP Managerの初期化
const manager = new NlpManager({
  languages: ['ja'],
  nlu: { useNoneIntent: true },
  tokenizer: {
    ja: {
      useBest: true,
      decomposeCompound: true,
    },
  },forceNER: true });

  // トレーニング関数をキューに追加
const addToTrainingQueue = async () => {
  await queue.add(async () => {
    await manager.train();
    await manager.save();
    console.log('NLP Manager がトレーニングされました。');
  });
};

// サーバー起動時にNLPモデルをトレーニング
const initializeNLP = async () => {
  try {
    // インテントと回答をデータベースから取得
    const intents = await getAllIntents();
    const bots = await getBotAllMessages();
    // インテントと回答をNLP Managerに追加
    intents.forEach(intent => {
      // インテントに関連するBotを取得
      const relatedBots = bots.filter(bot => bot.intentId === intent.id);
      console.log("943:relatedBots",relatedBots)
      relatedBots.forEach(bot => {
        bot.questions.forEach(question => {
          manager.addDocument('ja', question, intent.name);
        });
        manager.addAnswer('ja', intent.name, bot.answer);
      });
    });

    // モデルをトレーニング
    await manager.train();
    manager.save();
    console.log('NLP Manager がトレーニングされました。');
  } catch (error) {
    console.error('NLP Manager の初期化に失敗しました:', error);
  }
};

// サーバー起動時にNLPを初期化
initializeNLP();


// 新しいボットを追加
expressApp.post('/add_bot_create', async (req: any, res: any) => {
  try {
    const {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    } = req.body;
    const botData = {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords: keywords || [],
      relatedFAQs: relatedFAQs || [],
    };
    const newBot = await addBotCreate(botData);
    // 新しいデータをNLP Managerに追加
    questions.forEach((question: string) => {
      manager.addDocument('ja', question, intentId);
    });
    manager.addAnswer('ja', intentId, answer);
    // モデルを再トレーニング
    await addToTrainingQueue();

    res.json({ status: true, docs: newBot, msg: 'ボットが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'ボットの作成に失敗しました。', error: err.message });
  }
});

// ボットを更新
expressApp.post('/update_qa_bot', async (req: any, res: any) => {
  try {
    const {
      id,
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    } = req.body;
    const updateData = {
      category,
      intentId,
      questions,
      answer,
      keywords,
      relatedFAQs,
    };
    const numAffected = await updateQABot(id, updateData);
    // 既存のインテントと回答を削除
    manager.removeIntent(intentId);
    // 新しいデータを追加
    questions.forEach((question: string) => {
      manager.addDocument('ja', question, intentId);
    });
    manager.addAnswer('ja', intentId, answer);
    // モデルを再トレーニング
    await addToTrainingQueue();

    res.json({ status: true, numAffected, msg: 'ボットが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'ボットの更新に失敗しました。', error: err.message });
  }
});

// 手動でトレーニングをトリガーするエンドポイント
expressApp.post('/train_nlp', async (req: any, res: any) => {
  try {
    await addToTrainingQueue();
    res.json({ status: true, msg: 'NLP Manager のトレーニングを開始しました。' });
  } catch (err: any) {
    console.error('NLP Manager のトレーニングに失敗しました:', err);
    res.status(500).json({ status: false, msg: 'NLP Manager のトレーニングに失敗しました。', error: err.message });
  }
});

// 新しいカテゴリーを追加
expressApp.post('/insert_bot_category', async (req: any, res: any) => {
  try {
    const {
      id,
      category,
      color,
    } = req.body;
    const categoryData = {
      id,
      category,
      color,
    };
    const newCategory = await insertBotCategory(categoryData);
    res.json({ status: true, docs: newCategory, msg: 'カテゴリーが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'カテゴリーの作成に失敗しました。', error: err.message });
  }
});

// カテゴリーを更新
expressApp.post('/update_bot_category', async (req: any, res: any) => {
  try {
    const {
      id,
      category,
      color,
    } = req.body;
    const updateData = {
      category,
      color,
    };
    const numAffected = await updateCategoryBot(id, updateData);
    res.json({ status: true, numAffected, msg: 'カテゴリーが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'カテゴリーの更新に失敗しました。', error: err.message });
  }
});

// すべてのインテントを取得
expressApp.get('/get_all_intents', async (req: any, res: any) => {
  try {
    const intents = await getAllIntents();
    res.json({ status: true, intents, msg: 'インテントを取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの取得に失敗しました。', error: err.message });
  }
});

// カテゴリーIDに基づいてインテントを取得
expressApp.get('/get_intents_by_category', async (req: any, res: any) => {
  try {
    const { categoryId } = req.params;
    const intents = await getIntentsByCategory(categoryId);
    res.json({ status: true, intents, msg: 'インテントを取得しました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの取得に失敗しました。', error: err.message });
  }
});

// 新しいインテントを追加
expressApp.post('/add_intent', async (req: any, res: any) => {
  try {
    const { id, name, categoryId, description } = req.body;

    const intentData = {
      id,
      name,
      categoryId,
      description,
    };

    const newIntent = await addIntent(intentData);
    res.json({ status: true, intent: newIntent, msg: 'インテントが作成されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの作成に失敗しました。', error: err.message });
  }
});

// インテントを削除
expressApp.delete('/delete_intent/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const numRemoved = await deleteIntent(id);
    if (numRemoved > 0) {
      res.json({ status: true, msg: 'インテントが削除されました。' });
    } else {
      res.json({ status: false, msg: '指定されたインテントが見つかりませんでした。' });
    }
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの削除に失敗しました。', error: err.message });
  }
});
// インテントを更新
expressApp.post('/update_intent', async (req: any, res: any) => {
  try {
    const { id, name, categoryId, description } = req.body;

    const updateData = {
      name,
      categoryId,
      description,
    };

    const numAffected = await updateIntent(id, updateData);
    res.json({ status: true, numAffected, msg: 'インテントが更新されました。' });
  } catch (err: any) {
    res.json({ status: false, msg: 'インテントの更新に失敗しました。', error: err.message });
  }
});

// ボットを削除
expressApp.delete('/delete_bot/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // ボット情報を取得
    const bot: any = await deleteBot(id);
    if (!bot) {
      res.status(404).json({ status: false, message: 'Botが見つかりませんでした。' });
      return;
    }

    // ボットをデータベースから削除
    const numRemoved = await deleteBot(id);

    if (numRemoved > 0) {
      // NLP Managerからインテントを削除
      manager.removeIntent(bot.intentId);

      // モデルを再トレーニング
      await manager.train();
      manager.save();

      res.status(200).json({ status: true, message: 'Botが削除されました。' });
    } else {
      res.status(404).json({ status: false, message: 'Botが見つかりませんでした。' });
    }
  } catch (error) {
    console.error('Botの削除に失敗しました:', error);
    res.status(500).json({ status: false, message: 'Botの削除に失敗しました。' });
  }
});

// /get_bot_message エンドポイントの追加
expressApp.get('/api/get_bot_message', async (req, res) => {
  const userMessage = req.query.userMessage as string;
  console.log(userMessage)
  if (!userMessage) {
    return res.status(400).json({ status: false, msg: 'ユーザーメッセージが提供されていません。' });
  }

  try {

    // ユーザーメッセージを正規化
    const normalizedMessage = userMessage.trim();
    const response = await manager.process('ja', normalizedMessage);
     // デバッグ情報をログに出力
    console.log('NLP Response:', response);
    // 複数のフォールバック回答候補を定義
    const fallbackResponses = [
      '申し訳ありませんが、よく理解できませんでした。もう少し詳しく教えていただけますか？',
      'すみません、その質問にはお答えできません。別の質問を試してみてください。',
      'ちょっと分かりませんでした。別の言い方で教えていただけますか？',
      'お手数ですが、もう一度質問していただけますか？',
      'その件についてはよく分かりません。別の質問をお願いします。'
    ];

    let botAnswer: string;

    if (response.intent && response.score > 0.50) { // 信頼度の閾値を設定
      botAnswer = response.answer || '申し訳ありませんが、その質問にはお答えできません。';
    } else {
      // フォールバック回答からランダムに選択
      const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
      botAnswer = fallbackResponses[randomIndex];
    }

    res.json({
      status: true,
      answer: botAnswer,
      intent: response.intent,
      score: response.score,
    });
  } catch (error) {
    console.error('Botメッセージの取得に失敗しました:', error);
    res.status(500).json({ status: false, msg: 'Botメッセージの取得に失敗しました。' });
  }
});

export default expressApp;
