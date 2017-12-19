import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

@inject('exampleStore')
@observer
class ExampleContainer extends Component {

    constructor(props) {
        super(props);

        const { exampleStore } = props;
        console.dir(exampleStore)

        exampleStore.dosomething();
    }

    render() {
        const { exampleStore } = this.props;
        return (
            <div>
                Hello Example { exampleStore.propA }
            </div>
        );
    }
}

export default ExampleContainer;
