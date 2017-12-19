/**
 * 维度Store
 */
import { observable, computed, action, autorun } from 'mobx';
import httpProxy from '../net/httpProxy';
import { WEB_API } from '../constants/api';
import { HTTP_METHOD } from '../constants/http';

class DimensionStore {
    constructor() {
        this.getDimensionObjects = this.getDimensionObjects.bind(this);
    }

    @observable listData = [];
    @observable loading = true;

    @action async getDimensionObjects(params) {
        const responseData = await httpProxy.request(WEB_API.GET_DIMENSION_OBJECTS_URL, HTTP_METHOD.POST, params)
        this.listData = responseData;
        this.loading = false;
    }
    
    // getDimensionObject: async (id) => 
    //     await httpProxy.request(`${WEB_API.GET_DIMENSION_OBJECT_URL}/${id}`, HTTP_METHOD.GET)
    // ,
    // getDimensionData: async (id) => 
    //     await httpProxy.request(`${WEB_API.GET_DIMENSION_DATA_URL}/${id}`, HTTP_METHOD.GET)
    // ,
    
}

export default DimensionStore;
