import React, { Component } from 'react';

class ProjectName extends Component {
    render() {
        const project = this.props.project;
        //console.log(project);
        return (
            <span>
                {project.size_name} {project.platform} {project.kind} {project.name}
            </span>
        );
    }
}

export default ProjectName;
