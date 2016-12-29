
import _ from 'lodash';

import WorkerModel from './models/WorkerModel';
import ProjectModel from './models/ProjectModel';
import OfficeModel from './models/OfficeModel';

import {project_platforms, project_kinds} from './data/knowledge';

var app_state =
{
    data: {
        money: 0,
        stage: 'start',
        date: {
            tick: 0,
            hour: 0,
            day: 0,
            weak: 0,
            month: 0,
            year: 0,
            is_working_time: false
        },
        office: new OfficeModel(1),
        candidates: {
            resumes: [
                WorkerModel.generate(3)
            ],
            agency: [],
            stars: [
            //    WorkerModel.generate(30)
            ],
        },
        offered_projects: {
            freelance: [
                ProjectModel.generate(2, 1),
                ProjectModel.generate(2, 2)
             //   ProjectModel.generate(1, _.random(1, 2)),
             //   ProjectModel.generate(1, _.random(1, 2))
            ],
            contract: [],
            bigdeal: [
            //    ProjectModel.generate(30, 4)
            ],
        },
        hiring_agency_state: {},
        sales_agency_state: {},
        workers: [],
        workers_roles: {player: {design: true, manage: true, program: true, admin: true}},
        projects: [],
        projects_end_reports: [],
        projects_archive_reports: [],
        simplified_reports: [],
        projects_known_technologies: [],
        projects_technologies: [],
        projects_default_technologies: [],
        relations: [],
        helpers: {}
    }
};

_.keys(project_platforms).forEach((platform) => {
    _.keys(project_kinds).forEach((kind) => {
        for (let top = 1; top <= 10; top++) {
            let q = (11-top)*2;
            let size = Math.ceil(q/5);
            app_state.data.simplified_reports.push(ProjectModel.generate(q, size, kind, platform).generateReport(false));
        }
    });
});

export default app_state;