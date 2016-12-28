import React, { Component } from 'react';


import {project_sizes} from '../data/knowledge';

class ProjectName extends Component {
    render() {
        const project = this.props.project;
        //console.log(project);
        return (
            <span>
                {project_sizes[project.size].name} {project.platform} {project.kind} {project.name}
            </span>
        );
    }
}

export default ProjectName;
