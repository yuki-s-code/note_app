export interface TASK {
  id: string;
  title: string;
  tasks: any;
  createdAt: string,
  updatedAt: string,
}

export interface NEWTASKTITLE {
  title: string;
  tasks: any;
}

export interface EDITEDTASKTITLE {
  _id: string;
  title: string;
  tasks: any;
}

export interface NEWTASKCONTENTS {
  id: any,
  contents: any,
  taskContents: any,
  startDate: any;
  user: any;
}

export interface EDITEDTASKCONTENTS {
  id: any,
  contents: any,
  taskContents: any,
  startDate: any;
  user: any;
}

export interface EDITEDTASKCONTENTSNUMBER {
  numId: any,
}

export interface TASKMODAL {
  open: any,
}
