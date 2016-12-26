
import _ from 'lodash';


class ProjectsTop {
    constructor(dataset) {
        this.dataset = dataset;
        this.dataset_sorted_by_total = [];
    }

    static getHandler(dataset) {
        return new ProjectsTop(dataset);
    }

    getTopNumber(project_id, top_by='total') {
        if (!this.dataset_sorted_by_total[top_by]) {
            this.dataset_sorted_by_total[top_by] = _.sortBy(this.dataset, top_by).reverse();
        }
        for (let top = 1; top <= this.dataset_sorted_by_total[top_by].length; top++ ) {
            if (this.dataset_sorted_by_total[top_by][top-1].id === project_id) {
                return top;
            }
        }
        return 'out of top';
    }

    filter(key, value) {
        return new ProjectsTop(_.filter(this.dataset, [key, value]));
    }

    query(kind, platform) {
        let table_data = [];

        let filtered_reports = [];
        let put = (report) => { filtered_reports.push(report); };

        this.dataset.forEach((report) => {
            if (this.state.selected_kind === 'all' && this.state.selected_platform === 'all') {
                put(report);
            }
            else if (this.state.selected_kind === 'all') {
                if (this.state.selected_platform === report.platform) {
                    put(report);
                }
            } else if (this.state.selected_platform === 'all') {
                if (this.state.selected_kind === report.kind) {
                    put(report);
                }
            } else {
                if (this.state.selected_platform === report.platform
                    && this.state.selected_kind === report.kind) {
                    put(report);
                }
            }
        });
        table_data = (_.sortBy(filtered_reports, 'total')).slice(-10);
        table_data.forEach((val, key) => { table_data[key].top = table_data.length-key; });

        table_data = table_data.reverse();
    }
}



export default ProjectsTop;