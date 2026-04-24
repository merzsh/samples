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
  projectStartDate: '2026-04-20',
  dateDisplayTemplate: 'yy/MM/dd',
  isSuppressZeros: true,
  projectHeaderAttributes: [
    { attrId: 'wbs_code', attrName: 'WBS', },
    { attrId: 'work_name', attrName: 'Work', },
    { attrId: 'length', attrName: 'Len. (d)', },
    { attrId: 'percent_complete', attrName: '% done', },
    { attrId: 'start_date', attrName: 'Start at', },
    { attrId: 'finish_date', attrName: 'Finish at', },
    { attrId: 'prev_works', attrName: 'Prev.', },
  ],
  projectWorksList: [
    { wbs_code: '', work_name: 'Project "Creation of a billing information system" (DEV-26-10)', },
    { wbs_code: '1', work_name: 'Analysis', },
    { wbs_code: '1.1', work_name: 'Requirements scope definition', },
    { wbs_code: '1.1.1', work_name: 'Business process analysis AS-IS', length: 6, },
    { wbs_code: '1.1.2', work_name: 'Choosing a set of automation tasks', length: 3, prev_works: ['1.1.1'], },
    { wbs_code: '1.1.3', work_name: 'The choice of design tasks in the set', length: 3, prev_works: ['1.1.1'], },
    { wbs_code: '1.1.4', work_name: 'Definition of System properties', length: 3, prev_works: ['1.1.3'], },
    { wbs_code: '1.2', work_name: 'Defining System functions and automation strategies', },
    { wbs_code: '1.2.1', work_name: 'Analysis of existing developments', length: 3, prev_works: ['1.1.4'], },
    { wbs_code: '1.2.2', work_name: 'Choosing the method of System acquiring', length: 3, prev_works: ['1.2.1'], },
    { wbs_code: '1.2.3', work_name: 'Choosing an automation strategy', length: 3, prev_works: ['1.2.1'], },
    { wbs_code: '1.2.4', work_name: 'Defining automation goals and objectives', length: 6, prev_works: ['1.2.3'], },
    { wbs_code: '1.3', work_name: 'Justification of design decisions', },
    { wbs_code: '1.3.1', work_name: 'Justification of design decisions on technical support', length: 6, prev_works: ['1.2.4'], },
    { wbs_code: '1.3.2', work_name: 'Justification of design decisions on information support', length: 6, prev_works: ['1.3.1'], },
    { wbs_code: '1.3.3', work_name: 'Justification of design decisions on software', length: 6, prev_works: ['1.3.2'], },
    { wbs_code: '1.3.4', work_name: 'Creation of technical task documentation', length: 3, prev_works: ['1.2.4'], },
    { wbs_code: '2', work_name: 'Designing', },
    { wbs_code: '2.1', work_name: 'Development of an automation project', },
    { wbs_code: '2.1.1', work_name: 'Development of an automation schedule', length: 3, prev_works: ['1.3.3'], },
    { wbs_code: '2.1.2', work_name: 'Project cost estimation', length: 9, prev_works: ['2.1.1'], },
    { wbs_code: '2.1.3', work_name: 'Project architecture development', length: 3, prev_works: ['1.3.3'], },
    { wbs_code: '2.1.4', work_name: 'Risk analysis', length: 3, prev_works: ['2.1.3'], },
    { wbs_code: '2.2', work_name: 'Development of information support for the task', },
    { wbs_code: '2.2.1', work_name: 'Information model development', length: 3, prev_works: ['2.1.2'], },
    { wbs_code: '2.2.2', work_name: 'Classifier development', length: 3, prev_works: ['2.2.1'], },
    { wbs_code: '2.2.3', work_name: 'Development of prototypes of screen forms', length: 3, prev_works: ['2.2.2'], },
    { wbs_code: '2.2.4', work_name: 'Creation of project documentation', length: 3, prev_works: ['2.2.3'], },
    { wbs_code: '3', work_name: 'Implementation', },
    { wbs_code: '3.1', work_name: 'Preparing for software development', },
    { wbs_code: '3.1.1', work_name: 'Purchase and installation of software tools', length: 6, prev_works: ['2.3'], },
    { wbs_code: '3.1.2', work_name: 'Formalization of calculations of indicators', length: 3, prev_works: ['3.1.1'], },
    { wbs_code: '3.1.3', work_name: 'Algorithm development', length: 9, prev_works: ['3.1.2'], },
    { wbs_code: '3.2', work_name: 'Software development', },
    { wbs_code: '3.2.1', work_name: 'Database development', length: 21, prev_works: ['3.1.3'], },
    { wbs_code: '3.2.2', work_name: 'Interface development', length: 15, prev_works: ['3.1.3'],},
    { wbs_code: '3.2.3', work_name: 'Software modules development', length: 32, prev_works: ['3.2.1'], },
    { wbs_code: '3.2.4', work_name: 'Development of software verification tests', length: 16, prev_works: ['3.2.3'], },
    { wbs_code: '3.2.5', work_name: 'Creation of software documentation', length: 3, prev_works: ['3.2.4'], },
  ]
}
