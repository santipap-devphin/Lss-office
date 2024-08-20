export interface LSS_T_DYNAMIC_REPORT {
    ID?: number;
    REPORT_NAME?: string;
    QUERY?: string | null;
    ENABLE?: string | null;
    CREATE_USER?: string | null;
    CREATED_DATE?: Date | null;
    UPDATE_USER?: string | null;
    UPDATED_DATE?: Date | null;
    FIELDS?: LSS_T_DR_FIELD[];
    PARAMETERS?: LSS_T_DR_PARAMETER[];
}

export interface LSS_T_DR_FIELD {
    ID?: number;
    DR_ID?: number;
    NAME?: string;
    DISPLAY_NAME?: string | null;
    SEQ?: number | null;
    CREATE_USER?: string | null;
    CREATED_DATE?: Date | null;
    UPDATE_USER?: string | null;
    UPDATED_DATE?: Date | null;
}

export interface LSS_T_DR_PARAMETER {
    ID?: number;
    DR_ID?: number;
    NAME?: string;
    DISPLAY_NAME?: string | null;
    TYPE_CODE?: string | null;
    SEQ?: number | null;
    IS_REQUIRE?: string | null;
    CREATE_USER?: string | null;
    CREATED_DATE?: Date | null;
    UPDATE_USER?: string | null;
    UPDATED_DATE?: Date | null;
}

export interface DR_REPORT_PARAMETER {
    ID: Number;
    SORT_BY?: string | null,
    SORT_DIRECTION?: string | null,
    PARAMS?: any,
}