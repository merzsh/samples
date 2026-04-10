/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2026 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * This file is part of TrialPack.
 *
 * TrialPack is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const projectSampleDataApiRawResponse = {
  projectStartDate: '2026-03-01',
  dateDisplayTemplate: 'yyyy/MM/dd',
  isSuppressZeros: true,
  projectHeaderAttributes: [
    { attrId: 'wbs_code', attrName: 'WBS', },
    { attrId: 'work_name', attrName: 'Work', },
    { attrId: 'length', attrName: 'Len. (d)', },
    { attrId: 'percent_complete', attrName: '% done', },
  ],
  projectWorksList: [
    { wbs_code: '', work_name: 'Project "Building construction" (2026-1-INV)', },
    { wbs_code: '1', work_name: 'Building floors', },
    { wbs_code: '1.1', work_name: 'Building pad including UG utils', length: 25, percent_complete: 85, },
    { wbs_code: '1.2', work_name: '1st floor masonry structure', length: 12, },
    { wbs_code: '1.3', work_name: '2nd floor masonry structure', length: 13, },
    { wbs_code: '1.4', work_name: '3rd floor masonry structure', length: 15, },
    { wbs_code: '1.5', work_name: 'Stair and elevator masonry structure', length: 10, },
    { wbs_code: '2', work_name: 'Building roof', },
    { wbs_code: '2.1', work_name: 'Roof slab mounting', length: 5, },
    { wbs_code: '2.2', work_name: 'Place roof trusses', length: 20, },
  ]
}
