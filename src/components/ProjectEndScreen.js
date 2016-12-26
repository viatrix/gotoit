import React, { Component } from 'react';

import Modal from 'react-modal';
import ProjectReport from './ProjectReport';
import ProjectsTop from '../services/ProjectsTop';

import {skills_names, project_platforms, project_kinds} from '../data/knowledge';


class ProjectEndScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //   end_screen_project: null
        };

    }

    render() {
        const data = this.props.data;
        let project = this.props.project;
        //console.log(end_screen_project);

        let all_top_handler = ProjectsTop.getHandler(data.simplified_reports);
        let platform_top_handler = all_top_handler.filter('platform', project.platform);
        let kind_top_handler = all_top_handler.filter('kind', project.kind);
        let platform_kind_top_handler = all_top_handler.filter('platform', project.platform).filter('kind', project.kind);

        const modalStyles = {
            content : {
                top                   : '45%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };

        return (
            <div>
                <Modal
                    isOpen={true}
                    onRequestClose={data.helpers.projectArchiving}
                    style={modalStyles}
                    contentLabel="Modal">
                    <div>
                        <p><button className="btn btn-warning pull-right" onClick={data.helpers.projectArchiving}>Archive</button></p>
                    </div>
                    <div className="text-center">
                        <ProjectReport key={project.id} project={project} data={this.props.data} />
                        <div className="panel panel-success text-center">
                            <h3>Project Top Score</h3>
                            <h2>All Project Top: {all_top_handler.getTopNumber(project.id)}</h2>
                            <div className="flex-container-row">
                                {skills_names.map((skill) => <div key={skill} className="flex-element">
                                    {skill} top: {all_top_handler.getTopNumber(project.id, skill)}
                                </div>)}
                            </div>
                            <h3>{project_platforms[project.platform].name} Top: {platform_top_handler.getTopNumber(project.id)}</h3>
                            <div className="flex-container-row">
                                {skills_names.map((skill) => <div key={skill} className="flex-element">
                                    {skill} top: {platform_top_handler.getTopNumber(project.id, skill)}
                                </div>)}
                            </div>
                            <h3>{project_kinds[project.kind].name} Top: {kind_top_handler.getTopNumber(project.id)}</h3>
                            <div className="flex-container-row">
                                {skills_names.map((skill) => <div key={skill} className="flex-element">
                                    {skill} top: {kind_top_handler.getTopNumber(project.id, skill)}
                                </div>)}
                            </div>
                            <h3>{project_platforms[project.platform].name} {project_kinds[project.kind].name} Top: {platform_kind_top_handler.getTopNumber(project.id)}</h3>
                            <div className="flex-container-row">
                                {skills_names.map((skill) => <div key={skill} className="flex-element">
                                    {skill} top: {platform_kind_top_handler.getTopNumber(project.id, skill)}
                                </div>)}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ProjectEndScreen;