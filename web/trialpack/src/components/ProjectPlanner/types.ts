export type ApiProjectAttribValueTypes = string | number;
export type ApiProjectAttribNodeSpecIds = 'wbs_code' | 'work_name';
export type ApiProjectAttribLeafSpecIds = 'length' | 'percent_complete';
export type ApiProjectAttribAllIds = ApiProjectAttribNodeSpecIds | ApiProjectAttribLeafSpecIds;

export type ApiProjectHeaderAttribute = {
  attrId: ApiProjectAttribAllIds;
  attrName: string;
  isOptionalForLeaf?: boolean;
}

export type ApiProjectWork = Record<ApiProjectAttribNodeSpecIds, ApiProjectAttribValueTypes> &
  Partial<Record<ApiProjectAttribLeafSpecIds, ApiProjectAttribValueTypes>>;

export type ApiProject = {
  projectStartDate: string;
  projectCurrDate?: string;
  dateDisplayTemplate?: string;
  projectHeaderAttributes: ApiProjectHeaderAttribute[];
  projectWorksList: ApiProjectWork[];
};

export type ProjectWorkNode = ApiProjectWork & {
  children: ProjectWorkNode[];
}
