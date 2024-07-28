import NeDB from 'nedb';
import path from 'path';

export const taskDB = new NeDB({
  filename: path.join(__dirname, 'data/task.db').replace('app.asar', 'app.asar.unpacked'),
  timestampData: true,
  autoload: true,
  onload: (err: any) => {
    console.log('taskDB start', err);
  },
});

export const findAllTask = (callback: any) => {
  taskDB.find({}).sort({ createdAt: 1 }).exec((err: any, docs: any) => {
    if (err) return callback(err, null);
    callback(null, docs);
  });
};

export const addTask = (
  id: any,
  title: any,
  tasks: any,
  callback: any
) => {
  const regDoc = { title, tasks };
  taskDB.insert(regDoc, (err: any, newdoc: any) => {
    if (err) return callback(null);
    callback(newdoc);
  });
};

export const titleUpdate = (id: any, title: any, callback: any) => {
  taskDB.update(
    { _id: id },
    { $set: { title } },
    {},
    (err: any, n: any) => {
      if (err) return callback(null);
      console.log(n)
      callback(n);
    }
  );
};

export const taskAdd = (id: any, task: any, callback: any) => {
  taskDB.update({ _id: id },
    { $push: { tasks: task } },
    {},
    (err: any, n: any) => {
      if (err) return callback(null);
    callback(n);
  });
};

export const taskUpdate = (id: any, task: any, callback: any) => {
  taskDB.update({ _id: id },
    { $set: { tasks: task } },
    {},
    (err: any, n: any) => {
      if (err) return callback(null);
    callback(n);
  });
};

export const taskReplace = (
  id: any,
  replaceId: any,
  task: any,
  replaceTask: any,
  callback: any
  ) => {
  taskDB.update(
    { _id: id },
    {$set: {tasks: replaceTask}},
    {},
    (err: any, n: any) => {
      if (err) return callback(null);
      taskDB.update(
        {_id: replaceId },
        {$set: {tasks: task}},
        {},
        (er: any, docs: any) => {
          if (er) return callback(null);
          callback(docs)
        }
      )
    }
  )
}

export const taskDelete = (id: any, callback: any) => {
  taskDB.remove({ _id: id }, (err: any, n: any) => {
    if (err) return callback(null);
    callback(n);
  });
};

export const taskContentsUpdate = (task: any, replaceData: any, callback: any) => {
  taskDB.update({ "tasks.id": task.id },
    { $set: { tasks: replaceData } },
    {},
    (err: any, n: any) => {
      console.log(err, n)
      if (err) return callback(null);
    callback(n);
  });
};