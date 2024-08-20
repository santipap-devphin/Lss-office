import { Reducer } from "react";
import { Contact } from "../models/store/contact.model";

export enum ContactActionType {
  Replace = "RPC",
  Add = "ADD",
  Disable = "DIS",
}

export type ContactAction = {
  type: ContactActionType;
  payload: Contact | Contact[] | null;
};

export const ContactReducer: Reducer<Contact[] | null, ContactAction> = (
  state: Contact[] | null,
  action
) => {
  switch (action.type) {
    case ContactActionType.Replace: {
      return [...(action.payload as Contact[])];
    }

    case ContactActionType.Add: {
      return [...(state as Contact[]), { ...action.payload }] as Contact[];
    }

    case ContactActionType.Disable: {
      let contacts = [...(state as Contact[])] as Contact[];
      const contact = action.payload as Contact;
      const index = contacts.findIndex((el) => el.CODE === contact.CODE);
      if (contact.CODE.startsWith("NEW-")) {
        contacts.splice(index, 1);
      } else {
        contacts[index] = {
          ...contact,
          ENABLE: "N",
          DEL: "Y",
        };
      }
      return [...contacts] as Contact[];
    }

    default: {
      throw Error("Invalid action for contact's reducer!");
    }
  }
};
