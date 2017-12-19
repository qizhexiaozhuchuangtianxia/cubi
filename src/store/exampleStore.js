import { observable, computed, action, autorun } from 'mobx';

class ExampleStore {
    @observable propA = null;

    @action dosomething() {
        this.propA = 123;
    }
}

export default ExampleStore;
