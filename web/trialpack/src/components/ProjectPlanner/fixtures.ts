import {ApiProject} from "./types";

export const projectSampleData: ApiProject = {
  projectStartDate: '2026-03-01',
  dateDisplayTemplate: 'yyyy/MM/dd',
  projectHeaderAttributes: [
    { attrId: 'wbs_code', attrName: 'WBS', },
    { attrId: 'work_name', attrName: 'Work', },
    { attrId: 'length', attrName: 'Len.', },
    { attrId: 'percent_complete', attrName: '% done', },
  ],
  projectWorksList: [
    { wbs_code: '1', work_name: 'Project "Building construction" (2026-1-INV)', },
    { wbs_code: '1.1', work_name: 'Building floors', },
    { wbs_code: '1.1.1', work_name: 'Building pad including UG utils', length: 25, percent_complete: 85, },
    { wbs_code: '1.1.2', work_name: '1st floor masonry structure', length: 12, },
    { wbs_code: '1.1.3', work_name: '2nd floor masonry structure', length: 13, },
    { wbs_code: '1.1.4', work_name: '3rd floor masonry structure', length: 15, },
    { wbs_code: '1.1.5', work_name: 'Stair and elevator masonry structure', length: 10, },
    { wbs_code: '1.2', work_name: 'Building roof', },
    { wbs_code: '1.2.1', work_name: 'Roof slab mounting', length: 5, },
    { wbs_code: '1.2.2', work_name: 'Place roof trusses', length: 20, },
  ]
}
