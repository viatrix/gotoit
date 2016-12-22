
import _ from 'lodash';

import WorkerModel from './models/WorkerModel';
import ProjectModel from './models/ProjectModel';
import OfficeModel from './models/OfficeModel';


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
            //    WorkerModel.generate(3)
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
        workers: [WorkerModel.generatePlayer()],
        workers_roles: {player: {design: true, manage: true, program: true, admin: true}},
        projects: [],
        projects_reports: [],
        projects_technologies: [],
        projects_default_technologies: [],
        relations: [],
        helpers: {}
    }
};

export default app_state;