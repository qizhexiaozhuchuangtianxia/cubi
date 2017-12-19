let HOST = 'http://test.cube.ruixuesoft.com:81';
//let HOST = 'http://localhost:8080';
//if (process.env.NODE_ENV === 'production') {
    //HOST = 'http://test.cube.ruixuesoft.com:81';
//}
// Node服务器API接口
export const WEB_API = {
    HOST,
    get SAVE_DASHBOARD_URL() { return `${HOST}/dashboard/dashboard`; },
    get SAVE_RESOURCE_URL() { return `${HOST}/dashboard/resource`; },
    get GET_DIMENSION_DATA_URL() { return `${HOST}/dimension/dimension_data`; },
    get GET_DIMENSION_OBJECT_URL() { return `${HOST}/dimension/dimension_object`; },
    get GET_DIMENSION_OBJECTS_URL() { return `${HOST}/dimension/dimension_objects`; },
    get GET_FILTER_TREE_DIMENSION_DATA_URL() { return `${HOST}/dimension/filter_tree_dimension_data`; },
    get GET_PAGE_FIELD_DATA_URL() { return `${HOST}/dimension/page_field_data`; },
    get GET_PAGE_FIELD_DATA_WIDTH_FILTERS_URL() { return `${HOST}/dimension/page_field_data_with_filters`; },
    get GET_FIELD_MAX_MIN_DATA_URL() { return `${HOST}/dimension/field_max_min_data`; },
    get GET_METADATA_URL() { return `${HOST}/data_cube/metadata`; },
    get LOGIN_URL() { return `${HOST}/user/login`; },
    get LOGOUT_URL() { return `${HOST}/user/logout`; },
    get GET_DIRECTORIES_URL() { return `${HOST}/data_cube/get_resources`; },
    

    get GET_AUTHORITIES_URL() { return `${HOST}/user/authorities`; },
    get GET_TEAM_OBJECT_URL() { return `${HOST}/user/teams`; },
    get SAVE_RESOURCE_AUTHORITIES_URL() { return `${HOST}/user/resource_authorities`; },
    get GET_AUTHORITY_TREE_URL() { return `${HOST}/user/authority_tree`; },

    get DASHBOARD_QUERY_RESOURCES_URL() { return `${HOST}/dashboard/query_resources`; },
    get DASHBOARD_COPY_RESOURCES_URL() { return `${HOST}/dashboard/copy_resources`; },
    get DASHBOARD_MOVE_RESOURCES_URL() { return `${HOST}/dashboard/move_resources`; },
    get DASHBOARD_DELETE_RESOURCE_URL() { return `${HOST}/dashboard/resources/:id`; },
    get DASHBOARD_GET_DASHBOARD_URL() { return `${HOST}/dashboard/:id`; },
    get DASHBOARD_GET_PATH_URL() { return `${HOST}/dashboard/path/:id`; },
    get DASHBOARD_GET_RESOURCE_URL() { return `${HOST}/dashboard/resources/:id`; },
    get DASHBOARD_RENAME_RESOURCE_URL() { return `${HOST}/dashboard/resources/:id` },
    get DASHBOARD_GET_AREA_URL() { return `${HOST}/dashboard/areas/:id`; },
    get DASHBOARD_ANALYSIS_EXPRESSION_URL() { return `${HOST}/dashboard/expression` },

    get COMMON_GET_FUNCTIONS_URL() { return `${HOST}/common/functions`; },
 
    get GET_REPORT_PATH_URL() { return `${HOST}/analyzer/path`; },   
    get GRT_RESOURCE_URL() { return `${HOST}/analyzer/resource`; },
    get GET_REPORT_RESOURCES_URL() { return `${HOST}/analyzer/query_resources`; },
    get MOVE_REPORT_RESOURCES_URL() { return `${HOST}/analyzer/move_resources`; },
    get RENAME_REPORT_RESOURCE_URL() { return `${HOST}/analyzer/rename_resource`; },
    get SAVE_REPORT_URL() { return `${HOST}/analyzer/save_report`; },
    get SAVE_REPORT_RESOURCE_URL() { return `${HOST}/analyzer/save_resource`; },    
    get VALIDATE_EXPRESSION_URL() { return `${HOST}/analyzer/expression`; },     
    get DOWNLOAD_EXCEL_URL() { return `${HOST}/analyzer/download_excel`; },
    get EXPORT_EXCEL_BY_AREA_INFO_URL() { return `${HOST}/analyzer/export_excel_by_area_info`; },
    get EXPORT_DATA_MODEL_BY_AREA_INFO_URL() { return `${HOST}/analyzer/export_data_model_by_area_info`; },
    get GETAREA_URL() { return `${HOST}/analyzer/area`; }, 
    get GET_USERNAME_URL() { return `${HOST}/user/user_name`;},

    get GET_AREA_BY_AREAINFO_URL() { return `${HOST}/analyzer/get_area_by_areaInfo`;},
    get SAVE_EXTEND() { return `${HOST}/analyzer/save_extend`;},
    get REPORT_GET_DIRECTORIES() { return `${HOST}/analyzer/get_directories`;},
    get REPORT_COPY_RESOURCES() { return `${HOST}/analyzer/copy_resources/:id`;},
    get REPORT_DELETE_RESOURCES() { return `${HOST}/analyzer/delete_resource/:id`;},
    get GET_USED_DASHBOARDS() { return `${HOST}/dashboard/get_used_dashboards/:id`;},
    get GET_EXTENDS() { return `${HOST}/analyzer/get_extends`;},
    get METADATA_GET_RESOURCES() { return `${HOST}/data_cube/get_resources`;},
    get METADATA_GET_RESOURCE() { return `${HOST}/data_cube/get_resource/:id`;},
    get METADATA_GET_PATH() { return `${HOST}/data_cube/get_path/:id`;},
    get GET_FUNCTION_TREE() { return `${HOST}/user/get_function_tree`; },










};
