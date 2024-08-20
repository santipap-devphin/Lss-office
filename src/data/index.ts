import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { apiUrlBase, redirectToken } from "../configs/urls";
import { User } from "../models/user/user.model";

import "@sweetalert2/theme-minimal/minimal.scss";
import { CRRDetail } from "../models/store/crr-detail.model";
import { DocumentNonLife } from "../models/store/document-non-life.model";
import { DocumentLife } from "../models/store/document-life.model";
import { AccountData } from "../models/data/account-data.model";
import { DataResponse } from "../models/common/data-response.model";
import { DocType } from "../models/data/doctype.model";
import { Account } from "../models/store/account.model";
import { ReceiptResponse } from "../models/data/receipt-response.model";
import { CompareProcessView } from "../models/data/compare-process-view.model";
import { LoginData } from "../models/data/login-data.model";
import { LSS_V_LSSIA020 } from "../models/office/LSS_V_LSSIA020.model";
import { Loader } from "../functions/Loader";
import { LSS_V_LSSIRA01 } from "../models/office/LSS_V_LSSIRA01.model";
import { LSS_V_LSSIRA02 } from "../models/office/LSS_V_LSSIRA02.model";
import { LSS_V_LSSIRA03 } from "../models/office/LSS_V_LSSIRA03.model";
import { LSS_V_LSSIRA04 } from "../models/office/LSS_V_LSSIRA04.model";
import { FileBrowserSchema } from "../models/schemas/filebrowser/file-browser-schema.model";
import { Attachment } from "../models/schemas/filebrowser/attachment.model";
import { base64toBlob } from "../functions/File";
import { LSS_T_GROUP_STAFF } from "../models/office/LSS_T_GROUP_STAFF.model";
import { LSS_T_POSITION } from "../models/office/LSS_T_POSITION.model";
import { LSS_T_SECTION } from "../models/office/LSS_T_SECTION.model";
import { LSS_V_LSSIRA05 } from "../models/office/LSS_V_LSSIRA05.model";
import { LSS_T_FUNCTION } from "../models/office/LSS_T_FUNCTION.model";
import { LSS_T_MENU } from "../models/office/LSS_T_MENU.model";
import { LSS_V_LSSIRA06 } from "../models/office/LSS_V_LSSIRA06.model";
import { LSS_V_LSSIRA07 } from "../models/office/LSS_V_LSSIRA07.model";
import { LSS_T_ERROR_GROUP } from "../models/office/LSS_T_ERROR_GROUP.model";
import { LSS_V_LSSIRA08 } from "../models/office/LSS_V_LSSIRA08.model";
import { LSS_T_TRANSACTION } from "../models/office/LSS_T_TRANSACTION.model";
import { LSS_V_LSSIRA09 } from "../models/office/LSS_V_LSSIRA09.model";
import { LSS_V_LSSIRA10 } from "../models/office/LSS_V_LSSIRA10.model";
import { LSS_T_ACCOUNT } from "../models/office/LSS_T_ACCOUNT.model";
import { LSS_T_STATE } from "../models/office/LSS_T_STATE.model";
import { LSS_T_TEMPLATE_MAIL } from "../models/office/LSS_T_TEMPLATE_MAIL.model";
import { LSS_V_LSSIR010 } from "./../models/office/LSS_V_LSSIR010.model";
import { IR016 } from "../models/office/IR016.model";
import { LSS_V_LSSIR019 } from "../models/office/LSS_V_LSSIR019.model";
import { LSS_T_COMPANY } from "../models/office/LSS_T_COMPANY.model";
import { LSS_T_PREFIX } from "../models/office/LSS_T_PREFIX.model";
import { COMPANY } from "../models/office/COMPANY.model";
import { getLocalStorage } from "../functions/LocalStorage";
import { ExtractPayload } from "../functions/ExtractPayload";
import { data } from "autoprefixer";
import { DR_REPORT_PARAMETER, LSS_T_DR_FIELD, LSS_T_DYNAMIC_REPORT } from "../models/office/LSS_T_DYNAMIC_REPORT.model";
import { LSS_T_TOOLTIP } from "../models/office/LSS_T_TOOLTIP.model";

const loader = new Loader();

const axios = Axios.create();

axios.interceptors.request.use<AxiosRequestConfig>(
  (config: AxiosRequestConfig) => {
    loader.show();
    const usr = getLocalStorage<User>("__refreshToken");
    if (usr) {
      config.headers = {
        "X-AUTH-TOKEN": `Bearer ${usr.authToken}`,
        Authorization: `Bearer ${redirectToken}`,
      } as AxiosRequestHeaders;
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${redirectToken}`,
    };

    return config;
  },
  (err) => {
    loader.close();
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    loader.close();
    return Promise.resolve(res instanceof AxiosError ? res.response : res);
  },
  (err) => {
    loader.close();
    if (err.response?.status === 401 || err.response?.status === 403) {
      const usr = getLocalStorage<User>("__refreshToken");
      if (usr) {
        try {
          const ep = new ExtractPayload(usr.authToken as string);

          if (ep.has("sid")) {
            let form = new FormData();
            form.append("SID", ep.get("sid") as string);
            fetch(`${apiUrlBase}/user/confirm-unlock-login`, {
              method: "POST",
              body: form,
            });
          }

          localStorage.clear();
          window.location.reload();
        } catch { }
      }

      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(err instanceof AxiosError ? err.response : err);
  }
);

export function getCommon(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/data/common`)
      .then((res) => resolve(res.data))
      .catch((err: AxiosError) => reject(err));
  });
}

export function getCommonCom(): Promise<DataResponse> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/data/common`)
      .then((res) => resolve(res.data.companies))
      .catch((err: AxiosError) => reject(err));
  });
}
export function registerAccount(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/user/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getDocTypes(code: string): Promise<DocType[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/data/doc-types?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getCertificate(type: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/files/CerList`, {
        type,
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function uploadfiles(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/files/uploadfile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getAccountData(token: string): Promise<AccountData> {
  return new Promise((resolve, reject) => {
    axios
      .get<AccountData>(`${apiUrlBase}/dashboard/account-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function loginAccount(
  userName: string,
  password: string
): Promise<LoginData> {
  return new Promise((resolve, reject) => {
    axios
      .post<LoginData>(`${apiUrlBase}/user/login`, { userName, password })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function loginAccountOic(
  userName: string,
  password: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/user/loginOic`, { userName, password })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function createDocument(
  code: string
): Promise<DocumentLife | DocumentNonLife> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/document/create`, {
        Code: code,
      })
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export function getCrrData(quarterCode: string): Promise<CRRDetail> {
  return new Promise((resolve, reject) => {
    axios
      .post<CRRDetail>(`${apiUrlBase}/document/get-crr-detail`, {
        QuaterCode: quarterCode,
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getDocumentContacts(docNo: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/document/get-contacts?no=${docNo}`)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export function saveDraft(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/document/save-draft`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function IR030ListPayin(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Payin/IR030ListPayin`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getPayinList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Payin/Payinlist`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getPayinListAll(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Payin/PayinlistAll`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getPayinListAllSearch(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Payin/PayinlistAllSearch`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function fnPin(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Files/fnPinOIC`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export const GetProfileAll = (): Promise<Account[]> => {
  return new Promise((resolve, reject) => {
    axios
      .post<Account[]>(`${apiUrlBase}/Account/GetProfileAll`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

export const getCompareCrr = (): Promise<CompareProcessView[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get<CompareProcessView[]>(`${apiUrlBase}/CompareCrr/CompareCrr`)
      .then((res) => {
        resolve(
          res.data.map((x) => {
            return { ...x, CHECKED: false };
          })
        );
      })
      .catch((err) => reject(err));
  });
};

export const getCompareCrrAll = (): Promise<CompareProcessView[]> => {
  return new Promise((resolve, reject) => {
    axios
      .post<CompareProcessView[]>(`${apiUrlBase}/CompareCrr/CompareCrrAll`)
      .then((res) => {
        resolve(
          res.data.map((x) => {
            return { ...x, CHECKED: false };
          })
        );
      })
      .catch((err) => reject(err));
  });
};

export const getCompareCrrWhere = (
  para: any
): Promise<CompareProcessView[]> => {
  return new Promise((resolve, reject) => {
    axios
      .post<CompareProcessView[]>(
        `${apiUrlBase}/CompareCrr/CompareCrrWhere`,
        para
      )
      .then((res) => {
        resolve(
          res.data.map((x) => {
            return { ...x, CHECKED: false };
          })
        );
      })
      .catch((err) => reject(err));
  });
};

export function getReceipt(code: string): Promise<ReceiptResponse[]> {
  return new Promise((resolve, reject) => {
    axios
      .get<ReceiptResponse[]>(`${apiUrlBase}/document/get-receipt/CODE=${code}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getDocumentList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post<CompareProcessView[]>(`${apiUrlBase}/CompareCrr/DocumentList`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function DocumentListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/CompareCrr/DocumentListWhere`,
        para
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssITA01SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/AccountRequest/AccountRequestSearch`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA01List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/AccountRequest/AccountRequestList`, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

// nod add LssITA22 | AO5
export function LssITA02List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA02/LssITA02List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA02Search(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA02/LssITA02Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA01Approved(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Office/Account/approve`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA01NotApproved(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Office/Account/NotApprove`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA02ApproveAuto(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA02/LssITA02ApproveAuto`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA02Approved(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA02/LssITA02Approved`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA02NotApproved(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA02/LssITA02NotApproved`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

//   End A02 Start A05

export function LssITA05List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export async function getPdf(url: string): Promise<Blob> {
  const res = await axios.get<Blob>(url, { responseType: "blob" });
  return await res.data;
}

export function LssITA05Save(data: any): Promise<any> {
  console.log(data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05Save`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05Search(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05Edit(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA05/LssITA05Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05seq(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LSSITA05Seq`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}


export function LssITA05uploadfiles(data: any): Promise<any> {
  //console.log(data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/files/ANOUNCEuploadfile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05uploadfileDelete(code: any): Promise<any> {
  console.log(data);
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiUrlBase}/files/ANOUNCEuploadfileDelete?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05files(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Files/LssITA05files`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssITA05Delete(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA05Seq(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05Seq`, null, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

// end 05

export function LssITA22(code: string): Promise<LSS_T_TEMPLATE_MAIL> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_TEMPLATE_MAIL>(`${apiUrlBase}/LssITA22?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA22List(data: any): Promise<LSS_T_TEMPLATE_MAIL[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_TEMPLATE_MAIL[]>(
        `${apiUrlBase}/LssITA22/LssITA22List`,
        data ?? {}
      )
      .then((res) => resolve(res.data.map((el, i) => ({ ...el, id: i }))))
      .catch((err) => reject(err));
  });
}

export function LssITA22Save(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA22/LssITA22Save`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA22Search(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA22/LssITA22Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA22Edit(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA22/LssITA22Edit`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA22Delete(code: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiUrlBase}/LssITA22/LssITA22Delete?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
// nod add LssITA22

/**
 *
 * LSSDocType
 */
export function LSSDocTypeSaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSDocType/LSSDocTypeSave`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSDocTypeSearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSDocType/LSSDocTypeSearch`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSDocTypeEditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LSSDocType/LSSDocTypeEdit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSDocTypeDeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSDocType/LSSDocTypeDelete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSDocTypeListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSDocType/LSSDocTypeList`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 *
 * END LSSDocType
 */
/**
 *
 * LssITA23
 */
export function LssITA23SaveAPI(data: any): Promise<any> {
  //console.log(data);
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA23/LssITA23Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA23SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA23/LssITA23Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA23EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA23/LssITA23Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA23DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA23/LssITA23Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA23ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA23/LssITA23List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 *
 * END LssITA23
 */

/**
 *
 * LssITA24
 */
export function LssITA24SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA24/LssITA24Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA24SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA24/LssITA24Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA24EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA24/LssITA24Edit`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA24DeleteAPI(code: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiUrlBase}/LssITA24/LssITA24Delete?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA24ListAPI(): Promise<LSS_T_STATE[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_STATE[]>(`${apiUrlBase}/LssITA24/LssITA24List`)
      .then((res) => resolve(res.data.map((el, i) => ({ ...el, id: i }))))
      .catch((err) => reject(err));
  });
}

export function LssITA24(code: string): Promise<LSS_T_STATE> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_STATE>(`${apiUrlBase}/LssITA24?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 *
 * END LssITA24
 */

/**
 *
 * LssITA26
 */
export function LssITA26SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA26/LssITA26Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA26SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA26/LssITA26Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA26EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA26/LssITA26Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA26DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA26/LssITA26Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA26ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA26/LssITA26List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 *
 * END LssITA26
 */

/**
 * LssITA60
 */
export function LssITA60SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA60/LssITA60Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA60SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA60/LssITA60Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA60EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA60/LssITA60Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA60DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA60/LssITA60Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA60ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA60/LssITA60List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 *
 * END LssITA60
 */

/**
 * LssITA28
 */
export function LssITA28SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA28/LssITA28Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssITA28SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA28/LssITA28Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA28EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA28/LssITA28Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA28DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA28/LssITA28Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA28ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA28/LssITA28List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 *
 * END LssITA28
 */

/**
 * master LssITA27
 */
export function LssITA27SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/LssITA27Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA27SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/LssITA27Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA27EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA27/LssITA27Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA27DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/LssITA27Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA27ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/LssITA27List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA27GetTimeOutAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/LssITA27GetTimeOut`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 * end LssITA27
 */

/**
 * master LssITA61
 */
export function LssITA61ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountComList`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA61SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountComSave`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA61SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountComSearch`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA61EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssAccount/LssAccountComEdit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA61DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountComDelete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 * end LssITA61
 */

/**
 * master LssITA62
 */
export function LssITA62ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountOicList`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LssCompanyListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssCompanyList`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA62SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountOicSave`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA62SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountOicSearch`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA62EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssAccount/LssAccountOicEdit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA62DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssAccount/LssAccountDelete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetSectionInfoAPI(): Promise<LSS_T_SECTION[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_SECTION[]>(`${apiUrlBase}/LSSData/LSSData_SECTION`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetPositionInfoAPI(): Promise<LSS_T_POSITION[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_POSITION[]>(`${apiUrlBase}/LSSData/LSSData_POSITION`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetGroupStaffAPI(): Promise<LSS_T_GROUP_STAFF[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_GROUP_STAFF[]>(`${apiUrlBase}/LSSData/LssData_Groupstaff`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetGroupStaff(code: string): Promise<LSS_T_GROUP_STAFF> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_GROUP_STAFF>(
        `${apiUrlBase}/LssITA63/LssITA63Search?CODE=${code}`
      )
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetGroupInfoAPI(data: any): Promise<LSS_T_GROUP_STAFF[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_GROUP_STAFF[]>(`${apiUrlBase}/LSSITA63/LSSITA63List`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 * end LssITA62
 */

/**
 * master LssITA63
 */
export function LssITA63ListAPI(): Promise<LSS_T_GROUP_STAFF[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_GROUP_STAFF[]>(`${apiUrlBase}/LSSITA63/LSSITA63List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA63SaveAPI(data: LSS_T_GROUP_STAFF): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSITA63/LssITA63Save`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA63SearchAPI(data: any): Promise<LSS_T_GROUP_STAFF[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_GROUP_STAFF[]>(
        `${apiUrlBase}/LSSITA63/LSSITA63Search`,
        data,
        {}
      )
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA63EditAPI(data: LSS_T_GROUP_STAFF): Promise<number> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LSSITA63/LSSITA63Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.status))
      .catch((err) => reject(err));
  });
}

export function LssITA63DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSITA63/LSSITA63Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
/**
 * end LssITA63
 */

//loadfile
export function FileDownloadFile(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Files/DownloadFile`, data, {
        responseType: "blob", // VERY IMPORTANT
        headers: { Accept: "application/pdf" },
      })
      .then((res) => {
        resolve(res.data);

        // const url = window.URL.createObjectURL(res.data);
        // const a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = url;
        // a.download = "test.pdf";
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
        // window.URL.revokeObjectURL(url);

        //แบบdownload อัตโนมัติ
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(file);
        // link.download = `a001-${+new Date()}.pdf`;
        // link.click();

        //แบบเปิดเลยไม่ต้อง download
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((err) => reject(err));
  });
}
//end load file

export function LssGetPayin(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Payin/PayinSearch`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssGetPayinKeyFile(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/Payin/PayinSearchKeyAttachment`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

// nod add LssITA22 | AO5
export function LssITA03List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/data/LssITA03List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA03Search(data: any): Promise<any> {
  // //console.log(data);

  return new Promise((resolve, reject) => {
    // let data2:any = { "CODE" : "1002" };
    axios
      .post(`${apiUrlBase}/data/CompanySearch`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export async function LssITA05GROUPANOUCEList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA05/LssITA05GROUPANOUCEList`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export const getShowAllByComYearQuarter = (
  type: string,
  year: any,
  quarter: any,
  token: any
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${apiUrlBase}/DashboardAdmin/ShowAllByComYearQuarter`,
        {
          COMPANY_TYPE: type,
          YEAR: year,
          QUARTER: quarter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export function getAnnou_office(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/data/getAnnou_office`, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA27(params: { CODE: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA27/Search`, params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssIQ011ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ011/LSSIQ011Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ011List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ011/LSSIQ011List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR010ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR010/LSSIR010Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR010List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR010/LSSIR010List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR011ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR011/LSSIR011Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR011List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR011/LSSIR011List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ010ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ010/LSSIQ010Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ010List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ010/LSSIQ010List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR013ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR013/LSSIR013Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR013List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR013/LSSIR013List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ070ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ070/LSSIQ070Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ70List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ070/LSSIQ070List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ051ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ051/LSSIQ051Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ51List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ051/LSSIQ051List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ051ListWhereT(para: any): Promise<LSS_V_LSSIR010[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIR010[]>(`${apiUrlBase}/LSSIQ051/LSSIQ051SearchT`, para)
      .then((res) => {
        resolve(res.data.map((el, i) => ({ ...el, id: i })));
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ051ListWhereGroup(para: any): Promise<LSS_V_LSSIR010[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIR010[]>(`${apiUrlBase}/LSSIQ051/LSSIQ051SearchGroup`, para)
      .then((res) => {
        resolve(res.data.map((el, i) => ({ ...el, id: i })));
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ51ListT(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ051/LSSIQ051ListT`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ053ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ053/LSSIQ053Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ053ListWhereGroup(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ053/LSSIQ053SearchGroup`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIQ53List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIQ053/LSSIQ053List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR012ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR012/LSSIR012Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR012List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR012/LSSIR012List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR014ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR014/LSSIR014Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR014List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR014/LSSIR014List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR015ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR015/LSSIR015Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR015List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR015/LSSIR015List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR020ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR020/LSSIR020Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR020List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR020/LSSIR020List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR021ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<any[]>(`${apiUrlBase}/LSSIR021/LSSIR021Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR021List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR021/LSSIR021List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR017ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR017/LSSIR017Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssIR017List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR017/LSSIR017List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function DashBoardListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/DashBoard/DashBoardSearch`,
        para
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function DashBoardList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/DashBoard/DashBoardList`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIR019ListWhere(para: any): Promise<LSS_V_LSSIR019[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIR019[]>(
        `${apiUrlBase}/LSSIR019/LSSIR019Search`,
        para ?? {}
      )
      .then((res) => {
        resolve(res.data.map((el, i) => ({ ...el, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function LSSIR019List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIR019/LSSIR019List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSCSSList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIA020/LSSCSSList`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIA020ListWhere(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIA020/LSSIA020Search`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIA020List(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSIA020/LSSIA020List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

// export function getPayIn(docCode: string): Promise<Blob> {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`${apiUrlBase}/document/getOIC-payin-pdf?code=${docCode}`, {
//         responseType: "blob",
//       })
//       .then((res) => {
//         resolve(res.data);
//       })
//       .catch((err) => reject(err));
//   });
// }

// export function getForm(docCode: string): Promise<Blob> {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`${apiUrlBase}/document/getOIC-form-pdf?code=${docCode}`, {
//         responseType: "blob",
//       })
//       .then((res) => {
//         resolve(res.data);
//       })
//       .catch((err) => reject(err));
//   });
// }

export function LSSIP020List(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/Batch/LSSIP020Search`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}
export function LSSIP020ListCancelPayin(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Batch/LSSIP020ListCancelPayin`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIP020ListSendMail(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Batch/LSSIP020ListSendMail`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIP020SearchMail(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Batch/LSSIP020SearchMail`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSIP020Dashboard(
  params: object | null = null
): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIA020[]>(
        `${apiUrlBase}/LSSIA020/LSSIA020List`,
        params ?? {}
      )
      .then((res) => {
        // sum
        resolve([
          ["ประเภท", "จำนวน"],
          [
            "นำส่งแล้ว",
            res.data
              .filter((x) => x.STATUS_CODE === "SS")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
          [
            "ยกเลิกไปแล้ว",
            res.data
              .filter((x) => x.STATUS_CODE === "CC")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
          [
            "รอการนำส่ง",
            res.data
              .filter((x) => x.STATUS_CODE === "WS")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
          [
            "รอยกไป",
            res.data
              .filter((x) => x.STATUS_CODE === "WD")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
          [
            "ยกไปแล้ว",
            res.data
              .filter((x) => x.STATUS_CODE === "DD")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
          [
            "ยังไม่ดำเนินการ",
            res.data
              .filter((x) => x.STATUS_CODE === "QQ")
              .reduce((p, v) => p + v.AMOUNT, 0),
          ],
        ]);
      })
      .catch((err) => reject(err));
  });
}

export function ProcessReRun(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/Batch/ProcessReRun`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function ProcessReRunCancelPayment(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Batch/ProcessReRunCancelPayment`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function ProcessReRunSendMail(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/Batch/ProcessReRunSendMail`,
        data
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA01(data: object | null): Promise<LSS_V_LSSIRA01[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA01[]>(`${apiUrlBase}/LSSIRA01/LSSIRA01List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA02(data: object | null): Promise<LSS_V_LSSIRA02[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA02[]>(`${apiUrlBase}/LSSIRA02/LSSIRA02List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA03(data: object | null): Promise<LSS_V_LSSIRA03[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA03[]>(`${apiUrlBase}/LSSIRA03/LSSIRA03List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA04(data: object | null): Promise<LSS_V_LSSIRA04[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA04[]>(`${apiUrlBase}/LSSIRA04/LSSIRA04List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getAccountRequestFile(
  code: string
): Promise<{ SCHEMAS: FileBrowserSchema[]; ATTACHMENTS: Attachment[] }> {
  return new Promise((resolve, reject) => {
    axios
      .get<{ SCHEMAS: FileBrowserSchema[]; ATTACHMENTS: Attachment[] }>(
        `${apiUrlBase}/AccountRequest/AccountRequestFiles?CODE=${code}`
      )
      .then((res) => {
        resolve({
          SCHEMAS: res.data.SCHEMAS,
          ATTACHMENTS: res.data.ATTACHMENTS.map(
            (at) =>
            ({
              ...at,
              FILE: new File(
                [base64toBlob(at.FILE, "application/pdf")],
                at.NAME
              ),
            } as Attachment)
          ),
        });
      })
      .catch((err) => reject(err));
  });
}

export function getAccountChangeFile(
  code: string
): Promise<{ SCHEMAS: FileBrowserSchema[]; ATTACHMENTS: Attachment[] }> {
  return new Promise((resolve, reject) => {
    axios
      .get<{ SCHEMAS: FileBrowserSchema[]; ATTACHMENTS: Attachment[] }>(
        `${apiUrlBase}/AccountRequest/AccountChangeFiles?CODE=${code}`
      )
      .then((res) => {
        resolve({
          SCHEMAS: res.data.SCHEMAS,
          ATTACHMENTS: res.data.ATTACHMENTS.map(
            (at) =>
            ({
              ...at,
              FILE: new File(
                [base64toBlob(at.FILE, "application/pdf")],
                at.NAME
              ),
            } as Attachment)
          ),
        });
      })
      .catch((err) => reject(err));
  });
}

export function getFileDownload(code: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    axios
      .post<Blob>(
        `${apiUrlBase}/Files`,
        { CODE: code },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA05OnLoad(): Promise<{
  MENUS: LSS_T_MENU[];
  FUNCTIONS: LSS_T_FUNCTION[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{ MENUS: LSS_T_MENU[]; FUNCTIONS: LSS_T_FUNCTION[] }>(
        `${apiUrlBase}/LSSIRA05`
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA05(data: object | null): Promise<LSS_V_LSSIRA05[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA05[]>(`${apiUrlBase}/LSSIRA05/LSSIRA05List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA06(data: object | null): Promise<LSS_V_LSSIRA06[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA06[]>(`${apiUrlBase}/LSSIRA06/LSSIRA06List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA07OnLoad(): Promise<LSS_T_ERROR_GROUP[]> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_ERROR_GROUP[]>(`${apiUrlBase}/LSSIRA07`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA07(data: object | null): Promise<LSS_V_LSSIRA07[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA07[]>(`${apiUrlBase}/LSSIRA07/LSSIRA07List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA08OnLoad(): Promise<LSS_T_TRANSACTION[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_TRANSACTION[]>(`${apiUrlBase}/LSSIRA08/LoadType`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LSSITA04Load_Dayoff(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSITA04/LssITA04List`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA08(data: object | null): Promise<LSS_V_LSSIRA08[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA08[]>(`${apiUrlBase}/LSSIRA08/LSSIRA08List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function LSSITA04Load(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LSSITA04/LSSITA04Load`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssITA04Save(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(`${apiUrlBase}/LssITA04/LssITA04Save`, para)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssITA04SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSITA04/LssITA04Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA04SaveDetail(para: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios

      .post<CompareProcessView[]>(
        `${apiUrlBase}/LssITA04/LssITA04SaveDetail`,
        para
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function LssITA04EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LSSITA04/LssITA04Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA04DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSITA04/LssITA04Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLSSIRA09(data: object | null): Promise<LSS_V_LSSIRA09[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA09[]>(`${apiUrlBase}/LSSIRA09/LSSIRA09List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA10OnLoad(): Promise<{
  MENUS: LSS_T_MENU[];
  FUNCTIONS: LSS_T_FUNCTION[];
  ACCOUNTS: LSS_T_ACCOUNT[];
  SECTIONS: LSS_T_SECTION[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{
        MENUS: LSS_T_MENU[];
        FUNCTIONS: LSS_T_FUNCTION[];
        ACCOUNTS: LSS_T_ACCOUNT[];
        SECTIONS: LSS_T_SECTION[];
      }>(`${apiUrlBase}/LSSIRA10`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getLSSIRA10(data: any): Promise<LSS_V_LSSIRA10[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_V_LSSIRA10[]>(`${apiUrlBase}/LSSIRA10/LSSIRA10List`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function LSSIR016OnLoad(): Promise<{
  COMPANY_TYPES: { CODE: string; NAME: string }[];
  COMPANIES: { CODE: string; NAME: string, COMPANY_TYPE_CODE: string }[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{
        COMPANY_TYPES: { CODE: string; NAME: string }[];
        COMPANIES: { CODE: string; NAME: string; COMPANY_TYPE_CODE: string }[];
      }>(`${apiUrlBase}/LSSIR016`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function searchLSSIR016(data: any): Promise<IR016[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<IR016[]>(`${apiUrlBase}/LSSIR016`, data ?? {})
      .then((res) => {
        resolve(res.data.map((lv, i) => ({ ...lv, id: i + 1 })));
      })
      .catch((err) => reject(err));
  });
}

export function LssITA20ListAPI(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA20/LssITA20List`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA20SearchAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA20/LssITA20Search`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA20SaveAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA20/LssITA20Save`, data, {})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA20EditAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA20/LssITA20Edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA20DeleteAPI(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA20/LssITA20Delete`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function donwloadFile(url: string, name: string = "download") {
  axios
    .get<Blob>(apiUrlBase + url, { responseType: "blob" })
    .then((res) => {
      const localurl = URL.createObjectURL(
        new Blob([res.data], { type: res.data.type })
      );
      const link = document.createElement("a");
      link.href = localurl;
      link.download = `${name}`;
      link.click();
      link.remove();

      window.URL.revokeObjectURL(localurl);
    })
    .catch(() => {
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    });
}

export function downloadFilePost(url: string, name: string = "download", params: any | null = null) {
  axios
    .post<Blob>(apiUrlBase + url, params, { responseType: "blob" })
    .then((res) => {
      const localurl = URL.createObjectURL(
        new Blob([res.data], { type: res.data.type })
      );
      const link = document.createElement("a");
      link.href = localurl;
      link.download = `${name}`;
      link.click();
      link.remove();

      window.URL.revokeObjectURL(localurl);
    })
    .catch(() => {
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    });
}

export function LssITA61OnLoad(): Promise<{
  SECTIONS: LSS_T_SECTION[];
  POSITIONS: LSS_T_POSITION[];
  COMPANIES: LSS_T_COMPANY[];
  PREFIXES: LSS_T_PREFIX[];
  STAFF_GROUP: LSS_T_GROUP_STAFF[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{
        SECTIONS: LSS_T_SECTION[];
        POSITIONS: LSS_T_POSITION[];
        COMPANIES: LSS_T_COMPANY[];
        PREFIXES: LSS_T_PREFIX[];
        STAFF_GROUP: LSS_T_GROUP_STAFF[];
      }>(`${apiUrlBase}/LssITA61/OnLoad`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA61(code: string): Promise<LSS_T_ACCOUNT> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_ACCOUNT>(`${apiUrlBase}/LssITA61?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA61List(): Promise<LSS_T_ACCOUNT[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_ACCOUNT[]>(`${apiUrlBase}/LssITA61/LssITA61List`)
      .then((res) => resolve(res.data.map((el, i) => ({ ...el, id: i + 1 }))))
      .catch((err) => reject(err));
  });
}

export function saveLssITA61(data: LSS_T_ACCOUNT): Promise<number> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA61/LssITA61Edit`, data)
      .then((res) => resolve(res.status))
      .catch((err) => reject(err));
  });
}

export function LssITA62OnLoad(): Promise<{
  SECTIONS: LSS_T_SECTION[];
  POSITIONS: LSS_T_POSITION[];
  COMPANIES: LSS_T_COMPANY[];
  PREFIXES: LSS_T_PREFIX[];
  STAFF_GROUP: LSS_T_GROUP_STAFF[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{
        SECTIONS: LSS_T_SECTION[];
        POSITIONS: LSS_T_POSITION[];
        COMPANIES: LSS_T_COMPANY[];
        PREFIXES: LSS_T_PREFIX[];
        STAFF_GROUP: LSS_T_GROUP_STAFF[];
      }>(`${apiUrlBase}/LssITA62/OnLoad`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA62(code: string): Promise<LSS_T_ACCOUNT> {
  return new Promise((resolve, reject) => {
    axios
      .get<LSS_T_ACCOUNT>(`${apiUrlBase}/LssITA62?CODE=${code}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA62List(): Promise<LSS_T_ACCOUNT[]> {
  return new Promise((resolve, reject) => {
    axios
      .post<LSS_T_ACCOUNT[]>(`${apiUrlBase}/LssITA62/LssITA62List`)
      .then((res) => resolve(res.data.map((el, i) => ({ ...el, id: i + 1 }))))
      .catch((err) => reject(err));
  });
}

export function saveLssITA62(data: LSS_T_ACCOUNT): Promise<number> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA62/LssITA62Edit`, data)
      .then((res) => resolve(res.status))
      .catch((err) => reject(err));
  });
}

export function lssITA64OnLoad(): Promise<{
  COMPANIES: COMPANY[];
  COMPANY_TYPES: { CODE: string; NAME: string }[];
}> {
  return new Promise((resolve, reject) => {
    axios
      .get<{
        COMPANIES: COMPANY[];
        COMPANY_TYPES: { CODE: string; NAME: string }[];
      }>(`${apiUrlBase}/LssITA64`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssITA64Save(code: string, companyType: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA64`, { CODE: code, TYPE: companyType })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function loginOffice(
  userName: string,
  password: string
): Promise<LoginData> {
  return new Promise((resolve, reject) => {
    axios
      .post<LoginData>(`${apiUrlBase}/user/office/login`, {
        userName,
        password,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function logoutAccount(token: string): Promise<number> {
  return new Promise((resolve, reject) => {
    //Extract SID
    try {
      const ep = new ExtractPayload(token as string);
      axios
        .post(`${apiUrlBase}/user/logout`, { SID: ep.get("sid") })
        .then((res) => {
          resolve(res.status);
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

export function getAllMenu(Code: any): Promise<LSS_T_MENU[]> {
  console.log(Code);
  return new Promise((resolve, reject) => {
    try {
      axios
        .post<any>(`${apiUrlBase}/data/menus`, { CODE: Code })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

export function requestUnlock(username: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${apiUrlBase}/user/unlock-login`, { UserName: username })
        .then((res) => {
          resolve(res.status);
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

export function confirmUnlock(sid: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${apiUrlBase}/user/confirm-unlock-login`, { SID: sid })
        .then((res) => {
          resolve(res.status);
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

export function getLssIT60GroupStaffList(groupStaffCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA60/LssITA60GroupStaffList`, { GROUP_STAFF_CODE: groupStaffCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssGroupStaffPermissionCheck(groupStaffCode: string, menuCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssGroupStaffPermission/LssGroupStaffPermissionCheck`, { GROUP_STAFF_CODE: groupStaffCode, MENU_CODE: menuCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function lssGroupStaffPermissionUnCheck(groupStaffCode: string, menuCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssGroupStaffPermission/LssGroupStaffPermissionUnCheck`, { GROUP_STAFF_CODE: groupStaffCode, MENU_CODE: menuCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getAccountGroupStaffList(groupStaffCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssGroupStaffAccount/AccountGroupStaffList`, { GROUP_STAFF_CODE: groupStaffCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssGroupStaffAccountCheck(groupStaffCode: string, accountCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssGroupStaffAccount/LssGroupStaffAccountCheck`, { GROUP_STAFF_CODE: groupStaffCode, ACCOUNT_CODE: accountCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function lssGroupStaffAccountUnCheck(groupStaffCode: string, accountCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssGroupStaffAccount/LssGroupStaffAccountUnCheck`, { GROUP_STAFF_CODE: groupStaffCode, ACCOUNT_CODE: accountCode })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getDayoff(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/User/dayoff`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLSS_T_ERROR_GROUP(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/data/LSS_T_ERROR_GROUP`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}


export function lssDocTypeDetailSave(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailSave`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssDocTypeDetailDelete(params: { CODE: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailDelete`, params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssDocTypeDetailEdit(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailEdit`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssDocTypeDetailList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssDocTypeDetailListByDocType(params: { CODE: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailListByDocType`, params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function lssDocTypeDetailSearch(params: { CODE: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssDocTypeDetail/LssDocTypeDetailSearch`, params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getCompanyList(params: { COMPANY_TYPE_CODE?: string | null }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/data/CompanyList`, { CODE: params.COMPANY_TYPE_CODE || "" })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function getSectionList(params: { COMPANY_TYPE_CODE?: string | null }): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/data/SectionList`, params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function Loadcheck(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get<any>(`${apiUrlBase}/LssITA02/Loadcheck`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function BatchCRR(data:any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post<any>(`${apiUrlBase}/Batch/ProcessAll`,data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function CRR_NONLIFE_LIST(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post<any>(`${apiUrlBase}/Batch/CRR_NONLIFE_LIST`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}
export function CRR_LIFE_LIST(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post<any>(`${apiUrlBase}/Batch/CRR_LIFE_LIST`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function CompanyList(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/data/CompanyList`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA24UploadFile(data: { CODE: string, fileName: string, formFile: File }): Promise<any> {
  //console.log(data);
  const fdata = new FormData();
  fdata.append("CODE", data.CODE);
  fdata.append("fileName", data.fileName);
  fdata.append("formFile", data.formFile);
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/files/StatusUploadFile`, fdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getLssITA24FileUrl(code: string): string {
  return `${apiUrlBase}/files/get-icon?CODE=${code}`
}

export function getDashboardData(params: any): Promise<{ DATA: any[], CHART_DATA: any[] }> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/DashBoard/DashBoardDataSearch`, params)
      .then((res) => {
        const data: any[] = res.data
        const charData = [
          ["สถานะ", "จำนวน"],
          [
            "ชำระเงินเรียบร้อยแล้ว",
            data
              .filter((x) => x.STATE_CODE === "COMPLETED").length
            //.reduce((p, v) => p + (v.TOTAL_PAY || 0) + (v.TOTAL_FINE_RATE || 0), 0),
          ],
          [
            "รอชำระเงิน",
            data
              .filter((x) => x.STATE_CODE === "REPAYMENT" && x.PAYMENT_STATUS !== "Y").length
            //.reduce((p, v) => p + (v.TOTAL_PAY || 0) + (v.TOTAL_FINE_RATE || 0), 0),
          ],
          [
            "ยังไม่ได้นำส่ง/สถานะร่าง",
            data
              .filter((x) => x.STATE_CODE === "BLANK").length
            //.reduce((p, v) => p + (v.TOTAL_PAY || 0) + (v.TOTAL_FINE_RATE || 0), 0),
          ],
          [
            "ยกเลิกแล้ว",
            data
              .filter((x) => x.STATE_CODE === "CANCELED").length
            //.reduce((p, v) => p + (v.TOTAL_PAY || 0) + (v.TOTAL_FINE_RATE || 0), 0),
          ],
        ]
        resolve({ DATA: data, CHART_DATA: charData });
      })
      .catch((err) => reject(err));
  });
}

export function Getdatayear(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/data/datayear`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80PersonalSyncList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PersonalSyncList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80PersonalList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PersonalList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80PositionSyncList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PositionSyncList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80PositionList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PositionList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSITA80PrefixSyncList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PrefixSyncList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSITA80PrefixList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80PrefixList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSITA80SectionSyncList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SectionSyncList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
export function LSSITA80SectionList(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SectionList`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80SyncPersonalSave(data: {
  INSERT_ITEMS: string[],
  UPDATE_PREFIX_CODE_ITEMS: string[],
  UPDATE_TFNAME_ITEMS: string[],
  UPDATE_TLNAME_ITEMS: string[],
  UPDATE_EFNAME_ITEMS: string[],
  UPDATE_ELNAME_ITEMS: string[],
  UPDATE_POSITION_CODE_ITEMS: string[],
  UPDATE_SECTION_CODE_ITEMS: string[],
}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SyncPersonalSave`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80SyncPositionSave(data: {
  INSERT_ITEMS: string[],
  UPDATE_NAME_ITEMS: string[]
}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SyncPositionSave`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80SyncPrefixSave(data: {
  INSERT_ITEMS: string[],
  UPDATE_NAME_ITEMS: string[]
}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SyncPrefixSave`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSITA80SyncSectionSave(data: {
  INSERT_ITEMS: string[],
  UPDATE_NAME_ITEMS: string[]
}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA80/LSSITA80SyncSectionSave`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70Save(data: LSS_T_DYNAMIC_REPORT): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA70/LssITA70Save`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70Delete(id: Number): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiUrlBase}/LssITA70/LssITA70Delete?ID=${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70Edit(data: LSS_T_DYNAMIC_REPORT): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA70/LssITA70Edit`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70List(): Promise<LSS_T_DYNAMIC_REPORT[]> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA70/LssITA70List`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70Search(data: { REPORT_NAME?: string; ENABLE?: string }): Promise<LSS_T_DYNAMIC_REPORT[]> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LssITA70/LssITA70Search`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LssITA70Get(id: number): Promise<LSS_T_DYNAMIC_REPORT> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/LssITA70?ID=${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function LSSIR019DynamicReport(data: DR_REPORT_PARAMETER): Promise<{ DATA: any[], FIELDS: LSS_T_DR_FIELD[] }> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrlBase}/LSSIR019/LSSIR019DynamicReport`, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}


export function LSSIR019DynamicReportExcel(data: DR_REPORT_PARAMETER, downloadName: string) {
  axios
    .post<Blob>(apiUrlBase + "/LSSIR019/LSSIR019DynamicReportExcel", data, { responseType: "blob" })
    .then((res) => {
      const localurl = URL.createObjectURL(
        new Blob([res.data], { type: res.data.type })
      );
      const link = document.createElement("a");
      link.href = localurl;
      link.download = `${downloadName}`;
      link.click();
      link.remove();

      window.URL.revokeObjectURL(localurl);
    })
    .catch(() => {
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    });
}

export function GetTooltipById(id: string): Promise<LSS_T_TOOLTIP>{
  console.log(id);
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/Tooltip/GetTooltipById?ID=${id}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
  // return new Promise((resolve, reject) => {
  //   axios
  //     .post(`${apiUrlBase}/Tooltip`)
  //     .then((res) => resolve(res.data))
  //     .catch((err) => reject(err));
  // });
}

export function UpdateGridPosition(id: string, number: string){
  var paylaod = {
    id: id,
    number: number
  }
  console.log(paylaod);
  return new Promise((resolve, reject) => {
    axios
      .patch(`${apiUrlBase}/LssITA05/GridPositionEdit`, paylaod)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

export function getCancelAuto() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiUrlBase}/Document/cancelAuto`)
      .then((res) => resolve(res.data.companies))
      .catch((err: AxiosError) => reject(err));
  });
}