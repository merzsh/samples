import {ApiProject} from "./types";

export const projectSampleData: ApiProject = {
  projectTitle: 'Project "Building construction" (2026-1-INV)',
  projectStartDate: '2026-03-01',
  dateDisplayTemplate: 'yyyy/MM/dd',
  projectHeaderAttributes: [
    { attrId: 'wbs_code', attrName: 'WBS', },
    { attrId: 'work_name', attrName: 'Work', },
    { attrId: 'duration', attrName: 'Len.', },
    { attrId: 'percent_complete', attrName: '% done', },
  ],
  projectWorksList: [
    { wbs_code: '1', work_name: 'Building floors', },
    { wbs_code: '1.1', work_name: 'Building pad including UG utils', duration: 25, percent_complete: 85, },
    { wbs_code: '1.2', work_name: '1st floor masonry structure', duration: 12, },
    { wbs_code: '1.3', work_name: '2nd floor masonry structure', duration: 13, },
    { wbs_code: '1.4', work_name: '3rd floor masonry structure', duration: 15, },
    { wbs_code: '1.5', work_name: 'Stair and elevator masonry structure', duration: 10, },
    { wbs_code: '2', work_name: 'Building roof', },
    { wbs_code: '2.1', work_name: 'Roof slab mounting', duration: 5, },
    { wbs_code: '2.2', work_name: 'Place roof trusses', duration: 20, },
  ]
}
