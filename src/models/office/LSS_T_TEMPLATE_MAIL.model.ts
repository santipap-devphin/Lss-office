export interface LSS_T_TEMPLATE_MAIL {
  id?: any;
  CODE: string;
  NAME: string;
  SUBJECT: string;
  BODY: string;
  CC: string;
  REPLY: string;
  DESCIPTION: string;
  ENABLE: string;
  DEL?: string;
  CREATE_USER?: string;
  UPDATE_USER?: string;
  FROM: string;
  TO: string;
  BCC: string;
  SEND_REPEAT: string;

  UPDATED_DATE?: Date;
  CREATED_DATE?: Date;
}
